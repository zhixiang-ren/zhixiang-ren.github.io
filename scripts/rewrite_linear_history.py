#!/usr/bin/env python3
"""Detach a linear branch from its older ancestry without changing commit trees.

The source branch and remotes are never changed. By default this is a dry run;
--write creates a new candidate branch only. Back up the original branch before
manually replacing it, and use an exact --force-with-lease when pushing.

Example (using the original, pre-cleanup legacy tip):
    python3 scripts/rewrite_linear_history.py \
        --source 5883efa450236460663496ebac1410392f7dda29 \
        --after 25c30de2b4ce3e3f23559384699bb4b9865d6473
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys


def git(*args: str, input_data: bytes | None = None) -> bytes:
    result = subprocess.run(
        ["git", *args],
        input=input_data,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )
    if result.returncode != 0:
        detail = result.stderr.decode("utf-8", errors="replace").strip()
        raise RuntimeError(detail or f"git {args[0]} failed with status {result.returncode}")
    return result.stdout


def resolve_commit(reference: str) -> str:
    return (
        git("rev-parse", "--verify", "--end-of-options", f"{reference}^{{commit}}").decode().strip()
    )


def split_commit(commit: str) -> tuple[list[bytes], bytes]:
    raw = git("cat-file", "commit", commit)
    header, message = raw.split(b"\n\n", 1)
    return header.split(b"\n"), message


def rewrite_header(
    lines: list[bytes], expected_parent: str, new_parent: str | None
) -> tuple[list[bytes], bool]:
    parent_header = f"parent {expected_parent}".encode()
    if [line for line in lines if line.startswith(b"parent ")] != [parent_header]:
        raise ValueError("The selected commits must form a single linear parent chain")

    result: list[bytes] = []
    skipping_signature = False
    was_signed = False
    for line in lines:
        if line.startswith((b"gpgsig ", b"gpgsig-sha256 ")):
            skipping_signature = True
            was_signed = True
            continue
        if skipping_signature and line.startswith(b" "):
            continue
        skipping_signature = False
        if line == parent_header:
            if new_parent is not None:
                result.append(f"parent {new_parent}".encode())
            continue
        result.append(line)
    return result, was_signed


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", required=True, help="Original branch or commit to preserve")
    parser.add_argument("--after", required=True, help="Last ancestor to exclude")
    parser.add_argument(
        "--output-ref", help="New, nonexistent refs/heads/... branch to create with --write"
    )
    parser.add_argument(
        "--write", action="store_true", help="Write commit objects and output branch"
    )
    args = parser.parse_args()

    if args.write != bool(args.output_ref):
        parser.error("--write and --output-ref must be supplied together")

    source = resolve_commit(args.source)
    after = resolve_commit(args.after)
    if source == after:
        parser.error("--source must contain at least one commit after --after")
    git("merge-base", "--is-ancestor", after, source)

    if args.output_ref:
        if not args.output_ref.startswith("refs/heads/"):
            parser.error("--output-ref must be under refs/heads/")
        git("check-ref-format", args.output_ref)
        existing = subprocess.run(
            ["git", "show-ref", "--verify", "--quiet", args.output_ref], check=False
        )
        if existing.returncode != 1:
            parser.error("--output-ref already exists or could not be checked")

    commits = git("rev-list", "--reverse", f"{after}..{source}").decode().splitlines()
    if not commits:
        parser.error("No commits found after the cutoff")

    previous_old = after
    previous_new: str | None = None
    signed_count = 0
    for commit in commits:
        header, message = split_commit(commit)
        rewritten, was_signed = rewrite_header(header, previous_old, previous_new)
        signed_count += was_signed
        if args.write:
            raw = b"\n".join(rewritten) + b"\n\n" + message
            previous_new = git("hash-object", "-t", "commit", "-w", "--stdin", input_data=raw)
            previous_new = previous_new.decode().strip()
        previous_old = commit

    if args.write:
        if git("rev-parse", f"{source}^{{tree}}") != git("rev-parse", f"{previous_new}^{{tree}}"):
            raise RuntimeError("Final tree mismatch; output branch was not created")
        git("update-ref", args.output_ref, previous_new, "0" * 40)

    print(
        json.dumps(
            {
                "source": source,
                "cutoff": after,
                "commits_preserved": len(commits),
                "signatures_invalidated": signed_count,
                "output_ref": args.output_ref if args.write else None,
                "new_tip": previous_new,
            }
        )
    )
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (RuntimeError, ValueError) as error:
        print(f"History rewrite aborted: {error}", file=sys.stderr)
        raise SystemExit(1) from error
