# 命令行

所有命令都在项目根目录运行，格式为：

```bash
weclone-cli [--config-path <配置文件>] <命令> [选项]
```

`--config-path` 指定配置文件，默认读取 `./settings.jsonc`，也可以用环境变量 `WECLONE_CONFIG_PATH` 指定。每个命令都可以加 `--help` 查看选项。

## 人生画像

| 命令 | 说明 |
|---|---|
| `build-profile` | 从聊天数据依次完成数据准备、记忆抽取、整理和画像生成，做分身时另外抽取说话风格。见[绘制人生画像](../profile/build-profile.md) |
| `organize-memories` | 单独运行板块划分、分类、分主题和汇总，用于调试或补跑 |
| `distill-style` | 单独抽取说话风格。见[说话风格](../profile/style.md#单独运行) |

`build-profile` 的选项：

| 选项 | 说明 |
|---|---|
| `--purpose assistant\|clone` | `assistant` 给个人助理用，抽取画像和事件。`clone` 做分身，另外抽取说话风格。未指定时交互选择 |
| `--output-dir <目录>` | 结果目录，必须是新目录。默认在 `dataset/res_csv/agent/profile_runs` 下新建时间戳目录 |
| `--max-context-tokens <数量>` | 记忆整理和画像生成的输入 token 上限。默认读取 Codex 的上下文长度，API 后端必须指定 |

## 网页与服务

| 命令 | 说明 |
|---|---|
| `server` | 启动网页和接口服务 |

| 选项 | 默认值 | 说明 |
|---|---|---|
| `--host` | `127.0.0.1` | 监听地址，见[数据安全](../security/data-security.md#服务地址) |
| `--port` | `5175` | 端口 |
| `--run <目录>` | 最新一次结果 | 要打开的 `build-profile` 结果目录 |
| `--inference` | 关闭 | 加载微调模型，开放 `/v1` 推理接口，供[聊天机器人](../chatbot/bot-token.md)调用 |

网页的用法见[网页审核](../profile/review.md)，助手接入见[接入 AI 助理](../profile/assistant.md)。

## 密码与加密

加密模式下使用，见[数据安全](../security/data-security.md#密码)。

| 命令 | 说明 |
|---|---|
| `security-init` | 按 `settings.jsonc` 固定存储模式，并设置网页和文件读写共用的密码 |
| `security-change-password` | 用旧密码修改密码，保留已有的加密数据 |
| `server-reset-password` | 忘记密码时重新设置。旧的加密文件无法再读取，必须从原始聊天重新生成全部数据 |
| `decrypt --input <加密文件> --output <明文文件>` | 输入密码，把加密文件导出为新的明文文件 |

## 微调分身

| 命令 | 说明 |
|---|---|
| `make-dataset` | 把聊天记录处理成微调数据集。见[数据预处理](../deploy/data_preprocessing.md) |
| `train-sft` | 微调模型。见[模型微调](../deploy/model_finetuning.md) |
| `webchat-demo` | 在浏览器中和微调后的模型对话，仅支持明文模式。见[模型推理与测试](../deploy/model_inference.md) |
| `test-model` | 用常见聊天问题测试模型，需要先启动带 `--inference` 的服务。见[模型推理与测试](../deploy/model_inference.md#使用常见聊天问题测试) |

## 其他

| 命令 | 说明 |
|---|---|
| `version` | 显示 WeClone 版本 |
| `dev` | 同时启动后端和前端开发服务，用于开发网页 |
