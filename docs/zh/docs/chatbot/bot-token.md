# 启动服务与令牌

聊天机器人平台通过 `/v1` 下的 OpenAI 兼容接口调用[微调好的分身](../deploy/model_finetuning.md)。

| 平台 | 部署支持 |
|------|------|
| 个人微信 | ✅（基于 **openclaw-weixin**） |
| Telegram | ✅ |
| WhatsApp | 🚧 |
| Discord | ✅ |
| Slack | ✅ |

## 启动服务

```bash
weclone-cli server --inference --port 8005
```

- `--inference` 加载分身模型，没有这个参数时机器人无法调用。
- 服务默认只监听 127.0.0.1。机器人平台在 Linux 上用 Docker 部署时加上 `--host 172.17.0.1`（宿主机在 Docker 网络中的地址），否则容器访问不到服务。此时平台里填写的地址也要换成 `http://172.17.0.1:8005/v1`。
- 机器人平台部署在 Docker Desktop（macOS、Windows）上时不用改监听地址，平台里填写 `http://host.docker.internal:8005/v1`。

## 生成令牌

打开网页的「机器人接入」页（`#/bots`），点击「生成令牌」。令牌只显示这一次，页面上会给出 API Base URL 和 API Key：

| 平台上的设置 | 填写 |
|---|---|
| 模型服务类型 | OpenAI |
| API Base URL | `http://127.0.0.1:8005/v1`。Linux 上的 Docker 为 `http://172.17.0.1:8005/v1`，Docker Desktop 为 `http://host.docker.internal:8005/v1` |
| API Key | 生成的令牌 |
| 模型名称 | 随意填写，例如 `gpt-3.5-turbo` |

- 所有机器人共用这一个令牌，服务重启后仍然有效。「重新生成」或「停用」后，旧令牌立即失效。
- 加密模式下，数据密钥用令牌加密后保存在本机的 `.weclone/bots.sqlite3`，机器人调用时凭令牌解开，不需要有人登录。
- 令牌和 `bots.sqlite3` 放在一起就能解密全部数据，请像密码一样保管。修改密码不影响令牌，重置密码后需要重新生成。
- `/v1` 拒绝带 `Origin` 请求头的请求，网页无法使用这个令牌。

## 平台上的通用设置

- 微调后的模型不会调用工具，请在平台上关掉工具和插件，否则看不到微调效果。
- 系统提示词要与微调时 `settings.jsonc` 中的 `default_system` 完全一致。
- 检查服务的日志，尽量保证平台发给模型的请求参数和微调、测试时一致。

各平台的具体步骤见 [AstrBot](./AstrBot.md)、[LangBot](./LangBot.md) 和 [Dify](./Dify.md)。
