# 配置文件 (`settings.jsonc`)

WeClone 默认读取项目根目录的 `settings.jsonc`。从 `settings.template.jsonc` 复制一份开始修改：

```bash
cp settings.template.jsonc settings.jsonc
```

也可以用 `weclone-cli --config-path <路径> <命令>` 或环境变量 `WECLONE_CONFIG_PATH` 指定其他配置文件。文件支持注释。`version` 与项目要求的配置版本不一致时，启动会给出警告，此时请对照模板更新配置，从旧版本升级见[从 0.3 版本升级](../introduce/upgrade.md)。

下文只列出常用配置项，表中的默认值是模板中的值。

## security_args

数据存储方式，详见[数据安全](../security/data-security.md#存储模式)。

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `storage_mode` | `"encrypted"` | `encrypted` 加密保存聊天数据和衍生产物，`plaintext` 明文保存。首次初始化后固定，改变模式须重新处理全部数据。配置中没有这一项时按 `plaintext` 处理 |
| `state_dir` | `".weclone"` | 保存密钥、令牌和助理设置的目录 |
| `runtime_dir` | 系统临时目录 | 加密模式下解密文件的临时存放位置 |

## common_args

各功能共用的参数，主要用于微调和推理。

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `model_name_or_path` | `"./models/Qwen2.5-7B-Instruct"` | 基座模型路径，见[下载模型](../deploy/model_download.md) |
| `adapter_name_or_path` | `"./model_output"` | LoRA 权重目录，训练时作为输出目录，推理时从这里加载 |
| `template` | `"qwen"` | LLaMA Factory 的对话模板，需与模型匹配 |
| `default_system` | `"请你扮演一名人类，不要说自己是人工智能"` | 训练和推理使用的系统提示词。聊天机器人平台中的系统提示词必须与它完全一致 |
| `media_dir` | `"dataset/media"` | 图片等媒体文件目录 |
| `image_max_pixels` | `409920` | 多模态训练时图片的最大像素数，409920 约为 720P |
| `finetuning_type` | `"lora"` | 微调方式，目前只支持 LoRA |
| `enable_thinking` | `false` | 是否启用模型的思考模式 |
| `trust_remote_code` | `true` | 加载模型时是否信任模型仓库中的代码 |

## cli_args

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `log_level` | `"INFO"` | 终端日志级别：`DEBUG`、`INFO`、`WARNING`、`ERROR`、`CRITICAL`。`logs/weclone.log` 始终记录 `DEBUG` 及以上级别 |
| `full_log` | `false` | 把第三方库的终端输出一并写入 `logs/weclone.log`，仅在明文模式下生效 |

## codex_exec_args

Codex CLI 后端的设置，用于[绘制人生画像](../profile/build-profile.md)和[语言风格](../profile/style.md)。

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `model` | `"gpt-6.1-sol"` | 使用的模型。建议智能水平不低于 gpt-6-sol medium |
| `effort` | `"medium"` | 推理强度 |
| `batch_size` | `30` | 并发请求数 |
| `request_interval_seconds` | `0.5` | 相邻请求的发起间隔（秒） |
| `capacity_cooldown_seconds` | `20.0` | 模型繁忙或触发限流时暂停发起新请求的时间（秒） |
| `timeout` | `300` | 单次请求超时（秒） |
| `command` | `"codex"` | Codex 可执行文件。多个版本共存时可填支持当前模型的版本的绝对路径 |
| `sandbox` | `"read-only"` | Codex 的沙箱模式 |

## agent_distill_args

人生画像的请求设置，详见[绘制人生画像](../profile/build-profile.md#请求设置)。

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `llm_provider` | `"codex_exec"` | 模型后端：`codex_exec` 读取 `codex_exec_args`；`api` 使用 `make_dataset_args` 的 `base_url`、`llm_api_key`、`model_name`，见[配置模型后端](../deploy/environment.md#配置模型后端) |
| `batch_size` | `10` | API 后端的并发请求数 |
| `timeout` | `120` | API 后端的单次请求超时（秒） |
| `max_tokens` | 不限 | API 后端的单次输出上限 |
| `max_samples_per_window` | `8` | 较短的对话段合并成一次请求，这是每次请求最多放入的对话段数 |
| `max_content_chars` | `400` | 每次请求最多放入的正文总字数，不计 ID、时间和角色标签。超过上限的对话段单独请求 |

抽取和整理的结果按输入内容缓存在 `dataset/res_csv/agent/llm_cache.sqlite`，重跑时只请求缺少的部分。删除该文件即全部重新请求。

## harness_args

由模型驱动的分身使用的设置。该功能仍在开发中，暂时不需要修改。

## make_dataset_args

数据处理和微调数据集的设置。`make-dataset` 的用法见[数据预处理](../deploy/data_preprocessing.md)。

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `platform` | `"chat"` | 数据来源：`chat`（通用 CSV）或 `telegram`，见[准备数据](../deploy/export-chat-history.md) |
| `language` | `"zh"` | 聊天常用语言，`zh` 或 `en`，决定隐私过滤使用的识别器 |
| `telegram_args.my_id` | `"user1234567890"` | 使用 Telegram 数据时必须改为你自己的 ID，即 `result.json` 中你发送消息的 `from_id` |
| `include_type` | `["text"]` | 训练数据包含的消息类型。加上 `"image"` 训练多模态模型 |
| `max_image_num` | `2` | 单条训练数据最多包含的图片数 |
| `blocked_words` | 示例值 | 禁用词。包含禁用词的消息不会进入训练数据。`dataset/blocked_words.json` 中的禁用词也会一并使用 |
| `add_time` | `false` | 在训练数据中加入消息时间 |
| `add_relation` | `false` | 在训练数据中加入与对方的关系，关系来自 [users.json](../deploy/export-chat-history.md#users-json) |
| `single_combine_time_window` | `2` | 同一人连续发送的消息在多少分钟内合并为一句 |
| `qa_match_time_window` | `5` | 对方消息与你的回复在多少分钟内组成一组问答 |
| `combine_msg_max_length` | `2048` | 合并后单条消息的最大长度，配合 `cutoff_len` 使用 |
| `messages_max_length` | `2048` | 单条训练数据的最大字符数，配合 `cutoff_len` 使用 |
| `prompt_with_history` | `false` | 是否在提示中加入对话历史，对多模态数据无效 |
| `clean_dataset` | 关闭 | 用大模型给训练数据打分并过滤，见[数据预处理](../deploy/data_preprocessing.md#相关参数) |
| `online_llm_clear` | `false` | 清洗时使用在线 API，而不是本地 vLLM |
| `base_url`、`llm_api_key`、`model_name` | 示例值 | OpenAI 兼容接口的地址、密钥和模型名。在线清洗和画像的 API 后端都使用这三项 |
| `clean_batch_size` | `50` | 在线清洗的批大小 |
| `vision_api` | 关闭 | 用多模态 API 把图片转成文字描述，见[数据预处理](../deploy/data_preprocessing.md#相关参数) |

## train_sft_args

微调参数，见[模型微调](../deploy/model_finetuning.md)。这里可以填写 LLaMA Factory 支持的所有参数，参考 [LLaMA Factory 参数说明](https://llamafactory.readthedocs.io/zh-cn/latest/advanced/arguments.html)。WeClone 额外支持以下几项：

| 配置项 | 说明 |
|---|---|
| `quantization` | QLoRA 量化设置，推理时也会沿用，见[启用 QLoRA](../deploy/model_finetuning.md#启用-qlora-可选配置) |
| `resume_adapter_name_or_path` | 从已有的 LoRA 权重继续训练。输出仍写到 `common_args.adapter_name_or_path` |
| `deepspeed` | 多卡训练使用的 DeepSpeed 配置文件，如 `"ds_config.json"` |

## infer_args

推理时的采样参数，网页 Demo、API 服务和测试都使用。

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `repetition_penalty` | `1.2` | 重复惩罚 |
| `temperature` | `0.5` | 温度 |
| `max_length` | `256` | 最大生成长度 |
| `top_p` | `0.65` | Top-p 采样 |

## vllm_args

离线清洗数据时 vLLM 的参数，见[使用 vLLM 时的注意事项](../deploy/data_preprocessing.md#💡-使用-vllm-时的注意事项)。

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `gpu_memory_utilization` | `0.9` | vLLM 可使用的显存比例 |
| `dtype` | 自动 | 计算精度。不支持 bfloat16 的显卡（如 Tesla T4、V100）填 `"float16"` |
| `quantization`、`load_format` | 不设置 | 量化加载方式，如 `"bitsandbytes"` |

## test_model_args

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `test_data_path` | `"dataset/eval/test_data-zh.json"` | `test-model` 使用的测试问题，见[模型推理与测试](../deploy/model_inference.md#使用常见聊天问题测试) |

## embedding_service_args

开发中的功能使用，暂时不需要修改。
