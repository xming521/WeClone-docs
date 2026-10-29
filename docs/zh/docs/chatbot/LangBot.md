# 通过 LangBot 部署到聊天机器人

[LangBot](https://github.com/langbot-app/LangBot) 是开源的 LLM 机器人平台，可以接入全球多种即时通信平台。

1. [部署 LangBot](https://docs.langbot.app/zh/insight/guide)，并在 LangBot 中添加一个机器人。
2. 按[启动服务与令牌](./bot-token.md)启动 WeClone 服务并生成令牌。LangBot 在 Linux 上用 Docker 部署时，启动命令加上 `--host 172.17.0.1`，Docker Desktop 上不用加。
3. 在模型页添加新模型：名称填 `gpt-3.5-turbo`，供应商选择 OpenAI，请求 URL 填 WeClone 的地址（连接方式参考 [LangBot 文档](https://docs.langbot.app/zh/workshop/network-details)），API Key 填生成的令牌。

<img width="400px" alt="image" src="https://github.com/user-attachments/assets/fc167dea-7c93-4d94-9c5f-db709d0320ba" />

4. 在流水线配置中选择刚才添加的模型，并把提示词改为微调时使用的 `default_system`。

<img width="400px" alt="image" src="https://github.com/user-attachments/assets/dbb0fd0a-f760-42db-acd0-bb99c859b52e" />

---
**现在，你的分身应该已经部署到聊天机器人平台了，可以和它聊聊天看看效果。**
