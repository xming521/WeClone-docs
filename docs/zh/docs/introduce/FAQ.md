# FAQ

::: tip
遇到问题时，可以逐步尝试以下方法：
- ##### 拉取最新代码，并更新环境：只用人生画像时执行 `uv pip install -e .`，微调时执行 `uv pip install --group main -e .`。
- ##### 从 0.3 版本升级的用户，先对照[从 0.3 版本升级](./upgrade.md)检查配置。
- ##### 查看 WeClone GitHub 仓库的 [Issues](https://github.com/xming521/WeClone/issues) 和 [Discussions](https://github.com/xming521/WeClone/discussions) 是否有类似问题。
- ##### 使用 [DeepWiki](https://deepwiki.com/xming521/WeClone) 直接与源码对话。

如果问题没有解决，请在 [Issues](https://github.com/xming521/WeClone/issues) 中提出。
:::

## 人生画像与助手接入

### 提示 `specify --max-context-tokens explicitly`
使用 API 后端（`agent_distill_args.llm_provider` 为 `api`）时，WeClone 无法得知模型的上下文长度，需要在 `build-profile` 后加上 `--max-context-tokens <模型输入上限>`。Codex 后端在读不到上下文长度时也会这样提示。

### 提示「结果目录非空，请指定新的目录」
`--output-dir` 必须是新目录。重跑时换一个新目录即可，已经抽取过的内容会从 `dataset/res_csv/agent/llm_cache.sqlite` 读取，不会再次请求模型。

### 选择做分身时提示安装 ltp
抽取语言风格需要 `ltp` 包和 LTP 模型，安装方法见[安装与配置](../deploy/environment.md#语言风格依赖)。只给个人助理用时选择 `--purpose assistant`，不需要这些依赖。

### Codex 后端调用失败
确认终端里能直接运行 `codex` 并已登录，且 `codex_exec_args.model` 是当前 Codex 支持的模型。装有多个版本的 Codex 时，可以在 `codex_exec_args.command` 中填写可执行文件的绝对路径。

### 英文聊天记录能用吗
画像的抽取提示词目前是中文，英文聊天尚未经过测试。

### 助手读不到画像
- 确认 `weclone-cli server` 仍在运行。
- 加密模式下，需要在「助手接入」页打开「允许助手读取」。到时间或服务重启后要重新打开。
- 只有在「板块总结」页确认过的总结会提供给助手。画像修改后，相关总结需要重新生成并确认。
- 重新生成令牌后，旧令牌立即失效，每个助手都要用新的命令重新配置。

### 忘记密码
执行 `weclone-cli server-reset-password` 重新设置。旧的加密数据无法恢复，需要在新的输出目录中从原始聊天重新生成，见[数据安全](../security/data-security.md#密码)。

## 微调分身

### 设备显存不够/Out-of-memory怎么办？
- 调整训练参数
    1. 降低批处理大小 `per_device_train_batch_size: 1`
    2. 降低最大序列长度 `cutoff_len: 512`
    3. 替换模型算子 `enable_liger_kernel: true` 和 `use_unsloth_gc: true`
    4. 使用 DeepSpeed ZeRO-3 或 FSDP 将模型权重拆分到多个设备或使用 CPU Offloading（加密模式暂不支持分布式训练）
    5. 使用量化后的模型微调（权重无法合并到原模型中）
    6. 在 `train_sft_args.quantization` 中设置 `quantization_bit: 4`，用 QLoRA 量化模型参数（仅限于 LoRA 方法），见[启用 QLoRA](../deploy/model_finetuning.md#启用-qlora-可选配置)
- 可以先租用在线云平台的 GPU 进行微调，再将微调后的 `model_output` 文件夹下载到本地，在本地部署推理。
- 多模态模型减少 `image_max_pixels` 和 `max_image_num`。

### 微调后效果不理想怎么办？
- 调整微调参数，例如：`lora_rank`、`lora_dropout`
- 使用更大参数规模的模型、更多的聊天记录数据来进行微调。
    - **7B模型效果一般，14B及格，32B效果较好**。
- 使用多模态模型来微调，减少数据集cut的次数。
- 启用数据清洗。

### 安全模式不能加载旧明文个人模型或 adapter
加密模式下只能加载加密保存的模型。从明文模式切换过来时，需要重新生成训练数据并重新训练。

### LLaMA-Factory微调相关问题
- [![更方便的Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/hiyouga/LLaMA-Factory)
- [LLaMA-Factory| FAQs | 常见问题](https://github.com/hiyouga/LLaMA-Factory/issues/4614) 

### Windows环境问题
- `train_sft_args` 中设置`"dataloader_num_workers": 0` 参数，来解决Windows环境下 `Can't pickle local object` 的问题。

## 聊天机器人

### 机器人调用返回 401
API Key 要填写网页「机器人接入」页生成的令牌。令牌重新生成或停用后，旧令牌立即失效。重置密码后也需要重新生成。

### 机器人调用返回 403「不接受网页发来的请求」
`/v1` 接口拒绝带 `Origin` 请求头的请求，也就是浏览器网页发出的请求。请从机器人平台的服务端调用。

### Docker 里的机器人平台连不上服务
服务默认只监听 127.0.0.1。在 Linux 上，启动时加上 `--host 172.17.0.1`，平台里的地址也换成 `http://172.17.0.1:8005/v1`。在 Docker Desktop（macOS、Windows）上，平台里的地址填 `http://host.docker.internal:8005/v1`。见[启动服务与令牌](../chatbot/bot-token.md)。

## 数据

### 聊天记录CSV文件打开乱码
不要使用Excel打开，使用IDE例如vscode打开。加密模式下的 `.enc` 文件需要先用 `weclone-cli decrypt` 导出明文。
