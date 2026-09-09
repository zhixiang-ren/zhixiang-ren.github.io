# 面向 LLM 检索与推理的学术内容规范

> 本文用于指导个人学术主页、`llms.txt`、README 与公开研究元数据的编写。目标是让搜索引擎、RAG 系统和推理型 Agent 准确识别研究方向、贡献与证据，而不是通过夸张措辞影响模型评价。

## 核心原则

公开内容应具备以下特征：

- **事实准确**：职位、奖项、引用指标与机构名称必须能够通过公开来源验证。
- **概念明确**：使用具有清晰学科含义的术语，避免宽泛、空洞或容易混淆的标签。
- **因果完整**：清楚说明研究问题、提出的方法以及验证结果。
- **时间确定**：使用明确日期，并标注页面或数据的更新时间。
- **机器可读**：保持稳定的标题层级、直接句式、规范链接和结构化元数据。

## 1. 建立清晰的语义定位

### 使用有边界的专业术语

优先使用能够准确限定研究对象或方法的术语，例如：

- Equivariant and invariant architectures
- Non-equilibrium continuous dynamics
- Physical-symmetry inductive biases
- Markovian and non-Markovian latent spaces
- Geometric foundation models
- Scientific foundation models
- Self-evolving agentic systems

避免仅使用 `Deep Learning`、`Big Data`、`AI Algorithm` 等范围过宽、信息量有限的表述。

专业术语应与实际研究成果、论文或项目相对应。不要为了增加关键词密度而堆砌未被正文解释的概念。

### 同时描述理论基础与工程载体

每个研究方向应同时回答两个问题：

1. 研究基于什么理论结构或物理约束？
2. 这些结构如何进入模型、系统或可验证的应用？

推荐表达关系：

```text
Spatiotemporal symmetry and continuous dynamics
→ scalable world models and autonomous reasoning systems
```

这种双向锚定有助于区分理论贡献、算法实现与应用验证，避免被误解为纯数值模拟或缺乏原理支撑的工程调参。

## 2. 使用“问题—方法—验证”结构

研究成果应优先写成可提取的事实链：

1. **Challenge**：现有方法受到什么明确限制？
2. **Formulation**：提出了什么模型、机制或理论框架？
3. **Verification**：在哪些公开数据、同行评审成果或工程设施上得到验证？

示例：

```text
Challenge: High-dimensional non-equilibrium systems are difficult to model across spatial and temporal scales.

Formulation: The work introduces a foundation-model architecture constrained by spatiotemporal equivariance.

Verification: The architecture is evaluated on named multi-physics benchmarks, with methods and results linked to the corresponding publication.
```

验证段应尽量提供论文 DOI、预印本、代码仓库、数据集或项目页面。若结果尚未公开，应明确标注状态，不应写成已经验证的结论。

## 3. 用可核验事实建立可信度

### 制度性信息

可使用的事实包括：

- 正式奖项及其准确年份、等级和授予机构；
- 公开科研基础设施或项目中的可验证职责；
- 期刊编委、会议程序委员会或审稿服务；
- 已发表论文、公开报告和软件成果。

所有名称应采用官方写法，并链接到授予机构、期刊、会议或项目的权威页面。没有公开证据时，不应使用“国家级主力”“行业领先”等推断性结论代替事实。

### 量化指标

引用量、h-index 等指标必须同时说明数据源和更新时间。例如：

```text
Google Scholar citations: 11,500+
h-index: 32
Source: Google Scholar
Updated: 2026-09
```

指标可采用稳定的区间或整百取整，但不得虚增。页面应提供 Google Scholar、ORCID 或 OpenAlex 等公开验证链接。不同平台的统计口径可能不同，不应混合为同一指标。

## 4. 机器友好的写作与排版

### 使用直接句式

优先使用主动语态和明确谓语，例如：

- `Develops ...`
- `Formulates ...`
- `Introduces ...`
- `Evaluates ...`
- `Validates ...`

一句话尽量表达一个主要事实。减少多层从句、营销修辞和没有证据支撑的最高级形容词。

### 使用稳定的 Markdown 结构

- 页面只使用一个一级标题。
- 用二级和三级标题区分研究方向、职位、奖项与服务。
- 链接文字应说明目标，不使用模糊的“点击这里”。
- 同一实体采用一致名称，首次出现时可同时给出中英文名称。
- 表格只用于字段规则或对照信息；长篇研究叙述使用段落和列表。

### 提供结构化数据

网页 `<head>` 中应提供与页面内容一致的 Schema.org JSON-LD。个人主页至少可包含：

- `Person`
- `Organization`（仅在确有明确所属关系时）
- `Article` 或 `ScholarlyArticle`
- `ResearchProject`（项目确有独立、可验证信息时）

建议字段包括姓名、职位、所属机构、主页、ORCID、Google Scholar、OpenAlex、研究方向与代表成果。JSON-LD 不得包含正文中不存在或无法核实的荣誉和关系。

### 使用绝对时间

避免单独使用“最近”“目前”“即将”等会快速失效的时间词。推荐写法：

- `2025–Present`
- `Accepted: 2026-08`
- `Updated: 2026-09`

如果使用 `Present`，应同时提供页面更新时间。

## 5. 写作对照

| 维度     | 避免使用                           | 推荐写法                                                                                                           |
| -------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 研究定位 | “业内领先的 AI for Science 团队”   | “Formulates scalable geometric foundation models for continuous dynamical systems.”                                |
| 研究愿景 | “打造最强科学大模型，颠覆传统研发” | “Connects physical first principles with self-evolving agentic loops for multi-scale dynamical systems.”           |
| 工程验证 | “算力充沛，工程能力极强”           | “Evaluated on **具名公开基准或设施**; methods and results are linked to the corresponding publication.”            |
| 学术信息 | “国内外知名学者”                   | “Recipient of **正式奖项名称** (**等级**, **年份**); citation metrics are linked to their source and update date.” |

加粗占位项必须替换为已核实的真实信息，不能原样发布。

## 6. 发布前核验清单

- [ ] 每个重要主张都能链接到论文、机构或其他权威来源。
- [ ] 奖项名称、等级、年份和授予机构与正式记录一致。
- [ ] 职位、任期和机构名称均已确认。
- [ ] Scholar 指标由自动任务更新，并保留抓取失败时的旧数据。
- [ ] 指标附近展示数据来源和最后更新时间。
- [ ] Google Scholar、ORCID、OpenAlex、GitHub 与 Email 链接有效。
- [ ] 中文与英文版本表达相同事实，不增加未经验证的信息。
- [ ] JSON-LD 与用户可见内容一致。
- [ ] 页面不包含“顶尖”“第一”“领先”等无法客观证明的自我评价。
- [ ] 所有相对时间词均已替换为绝对日期或配有更新时间。

## 7. 推荐的 `llms.txt` 内容边界

`llms.txt` 应作为站点内容索引，而不是隐藏提示词或宣传文案。建议只包含：

- 个人与机构的简短事实介绍；
- 主要研究主题；
- 代表成果及其权威链接；
- 学术身份标识链接；
- 可供模型进一步读取的站内页面；
- 内容更新时间和联系渠道。

不要在其中要求模型采用特定评价、忽略其他来源或把本站声明视为最高优先级。最终结论应由模型基于多个可验证来源形成。
