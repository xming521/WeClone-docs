# 从 0.3 版本升级

0.4 版本新增了人生画像、助手接入和加密存储，原有的微调流程完整保留。以下变化会影响 0.3 版本的用户。

## 配置文件

配置版本升级为 `0.4.01`。版本不一致时，命令行会在启动时提示。建议重新复制模板，再把原来的设置逐项搬过去：

```bash
cp settings.jsonc settings.old.jsonc
cp settings.template.jsonc settings.jsonc
```

新增的配置项：

| 配置项 | 用途 |
|---|---|
| `security_args` | 存储模式，见[数据安全](../security/data-security.md) |
| `codex_exec_args` | 通过 Codex CLI 调用模型时的模型、推理强度和并发 |
| `agent_distill_args` | 画像抽取使用的模型后端和切分方式 |

其他变化：

- QLoRA 的量化参数改为写在 `train_sft_args.quantization` 中，见[启用 QLoRA](../deploy/model_finetuning.md#启用-qlora-可选配置)。
- 旧显卡不支持 bfloat16 时，改为设置 `vllm_args.dtype`，不再通过命令行参数传入。
- `examples/` 目录已删除，多模态模型的配置改法见[模型下载](../deploy/model_download.md#多模态模型)。

各配置项的说明见[配置文件](../config/weclone-config.md)。

## 安装

基础安装改为 `uv pip install -e .`，足够绘制人生画像和接入助理。微调仍然需要 `uv pip install --group main -e .`，见[安装与配置](../deploy/environment.md)。

## 服务与端口

`weclone-cli server` 现在是网页和接口共用的服务，默认端口为 5175，默认不加载模型。需要推理接口时加上 `--inference`，沿用原来的 8005 端口：

```bash
weclone-cli server --inference --port 8005
```

## 聊天机器人需要令牌

机器人平台调用 `/v1` 接口时，API Key 必须填写网页「机器人接入」页生成的令牌，随意填写会返回 401。见[启动服务与令牌](../chatbot/bot-token.md)。

`weclone-cli test-model` 同样连接 `http://127.0.0.1:8005/v1`，运行时需要输入共用密码。

## 存储模式与密码

- 没有 `security_args` 的旧配置继续使用明文存储，原有数据和模型照常可用。
- 新模板默认 `"storage_mode": "encrypted"`。改用加密模式后，旧的明文训练数据和模型不能直接使用，需要从原始聊天重新生成训练数据并重新训练。
- 打开网页需要先设置共用密码，加密模式下命令行任务也用这个密码解锁数据。
