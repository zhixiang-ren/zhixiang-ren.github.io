#!/usr/bin/env python3
"""Refresh static citation metrics from a Google Scholar author profile."""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = PROJECT_ROOT / "src" / "content" / "scholar.json"
DEFAULT_AUTHOR_KEY = "ec_pCdEAAAAJ"
DEFAULT_LOCAL_PROXY = "socks5h://127.0.0.1:7897"
USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/131.0.0.0 Safari/537.36"
)


class ScholarMetricsParser(HTMLParser):
    """Extract the three all-time metrics from the Scholar statistics table."""

    def __init__(self) -> None:
        super().__init__()
        self.in_stats_table = False
        self.table_depth = 0
        self.in_cell = False
        self.cell_parts: list[str] = []
        self.row: list[str] | None = None
        self.rows: list[list[str]] = []
        self.author_name = ""
        self.in_author_name = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        if tag == "div" and attributes.get("id") == "gsc_prf_in":
            self.in_author_name = True
        if tag == "table" and attributes.get("id") == "gsc_rsb_st":
            self.in_stats_table = True
            self.table_depth = 1
            return
        if self.in_stats_table:
            if tag == "table":
                self.table_depth += 1
            elif tag == "tr":
                self.row = []
            elif tag in {"td", "th"} and self.row is not None:
                self.in_cell = True
                self.cell_parts = []

    def handle_data(self, data: str) -> None:
        if self.in_author_name:
            self.author_name += data
        if self.in_cell:
            self.cell_parts.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag == "div" and self.in_author_name:
            self.in_author_name = False
        if not self.in_stats_table:
            return
        if tag in {"td", "th"} and self.in_cell and self.row is not None:
            self.row.append(" ".join("".join(self.cell_parts).split()))
            self.in_cell = False
        elif tag == "tr" and self.row is not None:
            if self.row:
                self.rows.append(self.row)
            self.row = None
        elif tag == "table":
            self.table_depth -= 1
            if self.table_depth == 0:
                self.in_stats_table = False


def parse_number(value: str) -> int:
    digits = re.sub(r"[^0-9]", "", value)
    if not digits:
        raise ValueError(f"Invalid metric value: {value!r}")
    return int(digits)


def parse_profile(html: str) -> dict[str, int | str]:
    lowered = html.lower()
    if "our systems have detected unusual traffic" in lowered or "g-recaptcha" in lowered:
        raise RuntimeError("Google returned a bot-check page")

    parser = ScholarMetricsParser()
    parser.feed(html)
    metrics = {row[0].strip().lower(): row[1] for row in parser.rows if len(row) >= 2}
    required = ("citations", "h-index", "i10-index")
    missing = [key for key in required if key not in metrics]
    if missing:
        raise RuntimeError(f"Scholar metrics table is missing: {', '.join(missing)}")

    return {
        "author_name": " ".join(parser.author_name.split()),
        "total_citations": (parse_number(metrics["citations"]) // 100) * 100,
        "h_index": parse_number(metrics["h-index"]),
        "i10_index": parse_number(metrics["i10-index"]),
    }


def fetch_profile(author_key: str, proxy_url: str | None = None) -> str:
    curl = shutil.which("curl")
    if not curl:
        raise RuntimeError("curl is required but was not found")

    url = f"https://scholar.google.com/citations?hl=en&user={author_key}"
    command = [
        curl,
        "--silent",
        "--show-error",
        "--location",
        "--fail",
        "--compressed",
        "--max-time",
        "25",
        "--retry",
        "1",
        "--user-agent",
        USER_AGENT,
        "--header",
        "Accept-Language: en-US,en;q=0.9",
    ]
    if proxy_url:
        command.extend(["--proxy", proxy_url])
    command.append(url)

    result = subprocess.run(command, capture_output=True, text=True, timeout=35, check=False)
    if result.returncode != 0:
        detail = result.stderr.strip() or f"curl exited with status {result.returncode}"
        raise RuntimeError(detail)
    return result.stdout


def write_atomically(data: dict) -> None:
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(
        "w", encoding="utf-8", dir=OUTPUT_PATH.parent, delete=False
    ) as temp_file:
        json.dump(data, temp_file, ensure_ascii=False, indent=2)
        temp_file.write("\n")
        temp_path = Path(temp_file.name)
    temp_path.replace(OUTPUT_PATH)


def refresh(author_key: str, proxy_url: str | None) -> dict:
    attempts: list[tuple[str, str | None]] = [("direct", None)]
    if proxy_url:
        attempts.append(("SOCKS5 proxy", proxy_url))

    errors: list[str] = []
    for label, proxy in attempts:
        try:
            metrics = parse_profile(fetch_profile(author_key, proxy))
            print(f"Google Scholar fetch succeeded via {label}")
            return {
                "source": "Google Scholar",
                "author_key": author_key,
                **metrics,
                "updated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
                "is_placeholder": False,
            }
        except (RuntimeError, subprocess.TimeoutExpired, ValueError) as error:
            errors.append(f"{label}: {error}")

    raise RuntimeError("; ".join(errors))


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--allow-stale",
        action="store_true",
        help="Keep existing JSON and exit successfully when fetching fails",
    )
    args = parser.parse_args()

    author_key = os.environ.get("SCHOLAR_AUTHOR_KEY", DEFAULT_AUTHOR_KEY).strip()
    configured_proxy = os.environ.get("SCHOLAR_PROXY_URL", "").strip()
    proxy_url = configured_proxy or (
        None if os.environ.get("CI") == "true" else DEFAULT_LOCAL_PROXY
    )
    try:
        result = refresh(author_key, proxy_url)
        write_atomically(result)
    except RuntimeError as error:
        if args.allow_stale and OUTPUT_PATH.is_file():
            print(f"::warning::Google Scholar sync failed; keeping existing metrics. {error}")
            return 0
        print(f"Google Scholar sync failed: {error}", file=sys.stderr)
        return 1

    print(
        f"Updated {OUTPUT_PATH.relative_to(PROJECT_ROOT)} for {result['author_name']} ({author_key})"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
