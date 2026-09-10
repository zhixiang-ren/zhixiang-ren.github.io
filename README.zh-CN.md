# 任智祥 · 个人学术主页

[English](./README.md) | [简体中文](./README.zh-CN.md)

这是一个为**任智祥**构建的双语、数据驱动个人学术主页。网站以快速静态页面集中呈现个人履历、近期论文、经过核对的学术身份、构建时引用指标、招聘信息与机器可读元数据。

项目使用 [Astro](https://astro.build/) 和 [Tailwind CSS](https://tailwindcss.com/) 构建，面向低维护成本的 GitHub Pages 部署。

> **准备使用 AI 编程助手修改项目？** 请先阅读 [`AGENTS.md`](./AGENTS.md)。其中包含提供给 Agent 的工程架构、实现约束、设计不变量与验证流程。

## 核心特性

- **单页双语界面**：中英文使用同一套经过校验的内容源，并提供持久化的语言及深浅色切换。
- **内容驱动维护**：身份、简介、经历、服务、荣誉、招聘和论文通过 Astro Content Layer 管理，而非写死在页面组件中。
- **学术论文工作流**：全部论文集中维护在一个 Markdown 文件中；本地命令可以导入 DOI 或 arXiv 元数据、作者、期刊信息、链接和 BibTeX。
- **静态 Scholar 指标**：引用数与 h-index 在构建阶段更新，访客浏览器不会直接请求 Google Scholar。
- **搜索与 AI 检索友好**：构建产物包含 Sitemap、`robots.txt`、自动生成的 `llms.txt`、Schema.org JSON-LD、Canonical 与品牌化 Open Graph 卡片。
- **发布级静态产物**：包含响应式布局、双语 404、受保护的联系方式、源码/产物隐私审计及 GitHub Pages 自动部署。

## 技术栈

- Astro 7、TypeScript、Zod 4 与 Content Layer API
- 通过 Vite 插件接入的 Tailwind CSS 4、Geist Sans 与 Geist Mono
- Satori、resvg 与 Sharp 构建期 Open Graph 图片
- Crossref 与 arXiv 论文元数据接口
- 带校验和旧数据兜底的 Google Scholar 抓取脚本
- GitHub Actions 与 GitHub Pages

## 快速开始

需要 Node.js **22.12.0 或更高版本**及 npm **10.8.2 或更高版本**。只有刷新或检查 Scholar 指标时才需要 Python 3.13、Ruff 0.11.7 和系统 `curl` 命令。仓库中的 `.nvmrc` 与 `.python-version` 是本地运行时版本的统一依据。

```sh
npm install
npm run dev
```

浏览器打开 `http://localhost:4321`。如需使用同一局域网中的手机或其他设备测试：

```sh
npm run dev:network
```

发布修改前运行：

```sh
npm run build
npm run preview
```

`npm run build` 会校验内容、运行 Astro 诊断、生成 `dist/` 静态网站，并审计源码及最终产物是否意外泄露敏感信息。

## 常用命令

| 命令                                | 用途                            |
| ----------------------------------- | ------------------------------- |
| `npm run dev`                       | 启动本地开发服务器              |
| `npm run dev:network`               | 将开发预览开放到本地网络        |
| `npm run build`                     | 执行发布审计、检查和生产构建    |
| `npm run preview`                   | 预览生成后的生产网站            |
| `npm run check`                     | 检查 Prettier、Astro/TS 与 Ruff |
| `npm run check:web`                 | 仅检查 Prettier 与 Astro/TS     |
| `npm run format`                    | 格式化代码、内容数据和文档      |
| `npm run add-paper -- <DOI\|arXiv>` | 将一篇论文导入统一论文文件      |
| `npm run fetch:scholar`             | 刷新本地 Scholar 指标           |

## 日常内容维护

绝大部分文字更新都不需要修改组件：

| 更新内容                       | 文件                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------------ |
| 姓名、研究领域、学术身份和链接 | [`src/content/identity.yaml`](./src/content/identity.yaml)                           |
| 当前职位、机构及工作和学术经历 | [`src/content/experience.yaml`](./src/content/experience.yaml)                       |
| 中英文标题句、页面元描述与简介 | [`src/content/profile.md`](./src/content/profile.md)                                 |
| 编辑与审稿服务                 | [`src/content/academic-services.yaml`](./src/content/academic-services.yaml)         |
| 代表性荣誉                     | [`src/content/representative-honors.yaml`](./src/content/representative-honors.yaml) |
| 招聘与合作说明                 | [`src/content/open-positions.md`](./src/content/open-positions.md)                   |
| 完整论文数据                   | [`src/content/publications.md`](./src/content/publications.md)                       |
| Scholar 兜底数据               | [`src/content/scholar.json`](./src/content/scholar.json)                             |

双语字段使用 `{ en: ..., zh: ... }`，修改时应同步更新两种语言。按照当前设计，论文标题在中英文界面中均显示正式英文原题。

### 添加论文

使用 DOI 或 arXiv 标识符导入元数据：

```sh
npm run add-paper -- 10.1021/acs.jcim.5c03204
npm run add-paper -- 2603.12808
```

不修改内容文件，仅检查生成结果：

```sh
npm run add-paper -- 2603.12808 --dry-run
npm run add-paper -- 10.1021/acs.jcim.5c03204 --check
```

导入器会向唯一的 `publications.md` 论文集合追加数据，并拒绝重复标识符。导入后需要人工检查发表状态、作者顺序、本人作者标记、期刊缩写、BibTeX 与外链。只有在论文或仓库 README 明确证明对应关系时才添加代码仓库。无需出现在主页十篇精选中的论文应设置 `featured: false`。

Crossref 元数据会区分正式发表与 bioRxiv 等预印本平台。正式期刊优先使用官方短名，缺失时调用 ISO 4 缩写服务；可选服务失败时保留完整期刊名，不自行猜测。

### 刷新引用指标

```sh
npm run fetch:scholar
```

脚本会在原子替换 `src/content/scholar.json` 前校验全部指标。本地直连失败时会尝试 `socks5h://127.0.0.1:7897`。Scholar 偶尔可能返回验证码，定时构建会保留最后一份有效数据，不会发布零值或残缺指标。

运行细节见 [`docs/deployment.md`](./docs/deployment.md)。

### 更换照片

用压缩后的照片替换 [`src/assets/zhixiang-ren.webp`](./src/assets/zhixiang-ren.webp)，保持相同路径和大致 **2:3** 构图，然后检查：

- 桌面端和移动端裁切；
- 深色与浅色主题；
- 自动生成的 `/og/default.png` 预览。

主页与 Open Graph 生成器共用同一张源照片。

### 生成 Google Scholar 头像

从站点标准肖像生成一张不拉伸人物的正方形上传文件：

```sh
npm run generate:scholar-avatar
```

脚本会将 `resources/scholar-avatar.png` 写成离线上传资产；它不在 Astro 源码依赖图中，也不会进入部署产物。脚本会围绕面部裁切照片，并延展现有边缘背景，让 Google Scholar 的圆形裁切保留舒适的横向空间。运行 `npm run generate:scholar-avatar -- --help` 可查看尺寸、输入、输出和人物比例参数。

## 部署

[`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) 中的工作流会：

- 在每次推送到 `master` 时构建并部署；
- 每周一 UTC 00:00 尝试刷新 Scholar 数据；
- 刷新失败时保留最后一份有效指标；
- 支持手动触发；
- 兼容 GitHub 用户站点和仓库子路径。

第一次部署时：

1. 将当前 checkout 的 `origin` 从上游模板修改为最终仓库。
2. 推送代码，并将 `master` 设为默认分支。
3. 在 **Settings → Pages** 中选择 **GitHub Actions** 作为来源。
4. 如有 GitHub Runner 可访问的远程代理，可通过 Actions Secret `SCHOLAR_PROXY_URL` 提供。

部署与失败处理详见 [`docs/deployment.md`](./docs/deployment.md)。禁止提交代理凭证。

## 自动生成与机器可读产物

生产构建会自动生成：

- `/llms.txt`：与页面共用个人资料、经历、论文及引用数据；
- `/robots.txt` 与 Sitemap：根据实际部署子路径生成 URL；
- `/og/default.png`：使用本地内容、字体和照片生成的 1200×630 社交预览图；
- Schema.org `Person` JSON-LD 及标准 Open Graph/Twitter 元数据。

这些文件通常应通过对应的内容源更新，而不是直接修改生成产物。

## 安全与隐私

该学术网站向正常的搜索、学术与 AI 爬虫开放。联系方式针对简单静态收割做了保护，生产构建也会审计常见凭证和私有文件。这些措施用于降低机会型抓取风险，不能替代服务端限速。

修改联系方式、爬虫策略或部署基础设施前，请阅读 [`SECURITY.md`](./SECURITY.md)。

## 来源与许可证

视觉基础改编自 [Astro Sphere](https://github.com/markhorn-dev/astro-sphere)。Content Collections 模式与最初的 404 结构参考了 [Academic Portfolio Astro](https://github.com/rubzip/academic-portfolio-astro)。

两个上游项目均采用 MIT License，其声明保留在 [`LICENSE`](./LICENSE) 中。

- **源代码**：可复用的网站引擎、组件、样式、脚本、构建配置及工作流依据 [MIT License](./LICENSE) 开放。
- **内容与媒体**：肖像、个人身份与形象，以及原创简介、研究和招聘文字不属于 MIT 授权范围，未经许可不得复用。具体边界及第三方材料说明见 [`CONTENT-NOTICE.md`](./CONTENT-NOTICE.md)。
