# 绘制人生画像

人生画像从聊天记录中整理出你的身份、目标、条件、偏好和计划，按工作、家庭、健康等板块和主题组织，每条事实都能追溯到原始聊天。这条路线不需要 GPU，抽取由你配置的 API 模型完成。

开始前请先完成[安装](../deploy/environment.md)、[配置模型后端](../deploy/environment.md#配置模型后端)和[准备数据](../deploy/export-chat-history.md)。

## 运行

在项目根目录执行：

```bash
weclone-cli build-profile
```

运行时选择用途，也可以直接指定：

- `--purpose assistant`：给个人助理用，抽取画像和事件。
- `--purpose clone`：做分身，另外抽取语言风格，需要先安装[语言风格依赖](../deploy/environment.md#语言风格依赖)。

开始前命令行会显示结果目录、抽取内容和模型后端，并请你确认。确认后聊天内容会发送给该模型服务。

| 参数 | 说明 |
|---|---|
| `--purpose assistant\|clone` | 用途，不指定时交互选择 |
| `--output-dir <目录>` | 结果目录，必须是新目录。默认在 `dataset/res_csv/agent/profile_runs/` 下按时间新建 |
| `--max-context-tokens <上限>` | 记忆整理和画像生成的输入 Token 上限。Codex 后端默认读取模型的上下文长度，API 后端必须指定 |

## 流程

| 阶段 | 内容 |
|---|---|
| 1. 准备聊天数据 | 按联系人整理文字消息，切分成对话段，写入 `people/` |
| 2. 抽取记忆 | 从每个对话段中抽取画像记忆和事件记忆，写入 `distill/` |
| 3. 整理记忆 | 划分板块，分类、分主题并汇总记忆，为每条事实标注隐私级别和时效，写入 `memory_organization/` |
| 4. 生成画像层级 | 生成网页展示和审核使用的画像，写入 `profile_hierarchy/` |
| 5. 生成板块总结 | 为每个板块写一段总结，见[板块总结](./summary.md) |
| 6. 抽取语言风格 | 仅 `--purpose clone`，写入 `style/`，见[语言风格](./style.md) |

准备聊天数据时，同一个人连续两分钟内发出的消息合并为一条，间隔超过十分钟的对话切分为新的一段。过短的对话段不参与抽取，以节省模型调用。

## 画像的内容

每条事实归入一个维度，并带有以下信息：

| 信息 | 说明 |
|---|---|
| 维度 | 人口学与基本身份、长期需求动机与目标、资源禀赋与生活条件、重要计划与承诺、兴趣与偏好 |
| 板块和主题 | 由模型根据你的聊天内容划分，例如工作、家庭、健康 |
| 隐私级别 | 公开、普通、私密、敏感，决定哪些内容可以提供给助手 |
| 时效 | 长期、当前、已过时或某个时间的事件 |
| 来源 | 支持这条事实的对话段，可以在网页上查看原文 |
| 可信度和重要度 | 来源评分的平均值 |

抽取时不会因为隐私删除事实，每条事实都保留下来并标注隐私级别。哪些内容提供给谁，在[审核](./review.md)和[接入助理](./assistant.md)时由你决定。

## 缓存与重跑

模型的回答按输入内容缓存在 `dataset/res_csv/agent/llm_cache.sqlite`。中途失败时换一个新的结果目录重跑，只会请求缺少的部分。删除该文件则全部重新请求。

联系人编号保存在 `dataset/res_csv/agent/contacts.json`，只增不改。同一个联系人在重新导出、重新运行后保持原来的编号。

## 结果目录

```
dataset/res_csv/agent/profile_runs/<时间>/
├── people/                # 聊天快照
├── distill/               # 抽取的画像记忆和事件记忆
├── memory_organization/   # 板块、分类和汇总后的记忆
├── profile_hierarchy/     # 画像，以及网页上的审核记录
└── style/                 # 语言风格（仅 --purpose clone）
```

加密模式下这些文件以 `.enc` 结尾。完成后用 `weclone-cli server` 打开网页[审核画像](./review.md)。

## 单独运行某个阶段

调试或补跑时，可以单独运行：

```bash
weclone-cli organize-memories --help                     # 板块划分、分类、分主题和汇总
weclone-cli distill-style --input-dir <结果目录>/people  # 语言风格
```

## 请求设置

| 配置项 | 说明 |
|---|---|
| `codex_exec_args.model`、`effort` | Codex 后端使用的模型和推理强度 |
| `codex_exec_args.batch_size` | Codex 后端的并发请求数 |
| `codex_exec_args.request_interval_seconds`、`capacity_cooldown_seconds` | 请求间隔，以及模型繁忙时的等待时间 |
| `agent_distill_args.batch_size`、`timeout`、`max_tokens` | API 后端的并发数、超时和输出上限 |
| `agent_distill_args.max_samples_per_window`、`max_content_chars` | 较短的对话段合并成一次请求，这两项是每次请求最多放入的对话段数和正文总字数。超过字数上限的对话段单独请求 |

所有调用模型服务的请求都记录在 `logs/llm_audit/`，见[数据安全](../security/data-security.md#请求日志)。
