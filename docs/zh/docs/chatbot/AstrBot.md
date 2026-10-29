# 通过 AstrBot 部署到聊天机器人

[AstrBot](https://github.com/AstrBotDevs/AstrBot) 是易上手的多平台 LLM 聊天机器人及开发框架，可以将你的 WeClone 分身部署到 Telegram、飞书、Slack、Discord 等平台。

部署步骤：

1. **部署 AstrBot：** 根据 AstrBot 官方文档的指引，在你的服务器或本地安装并配置好 AstrBot，并部署要使用的消息平台。

2. **启动 WeClone 服务并生成令牌：** 按[启动服务与令牌](./bot-token.md)执行 `weclone-cli server --inference --port 8005`，在网页「机器人接入」页生成令牌。AstrBot 在 Linux 上用 Docker 部署时，启动命令加上 `--host 172.17.0.1`。

3. **在 AstrBot 中新增服务提供商：**

   * 类型选择：OpenAI
   * API Base URL：根据 AstrBot 的部署方式填写 WeClone 的地址，例如 `http://127.0.0.1:8005/v1`。Linux 上的 Docker 为 `http://172.17.0.1:8005/v1`，Docker Desktop 为 `http://host.docker.internal:8005/v1`
   * 模型：`gpt-3.5-turbo`
   * API Key：生成的令牌

4. **关闭工具调用（重要）：**
   微调后的模型主要用于模仿你的语言风格，不支持工具调用。在 AstrBot 对应的聊天平台中，向你的机器人发送指令关闭所有默认工具，以确保能看到微调效果，或者在 AstrBot WebUI 中手动关闭工具：

   ```
   /tool off_all
   ```

5. **设置系统提示词：**
   在 AstrBot 的配置中，为你的机器人设置**系统提示词 (System Prompt)**。这个提示词必须与你微调模型时在 `settings.jsonc` 中设置的 `default_system` **完全一致**。

   <img src="https://blog-img.051088.xyz/AstrBot%E6%95%99%E7%A8%8B01.png"/>

6. **调整采样参数（可选）：**
   可以在配置文件的 `infer_args` 中调整模型的采样参数，也可以在 AstrBot 中调整，如 `temperature`、`top_p`、`top_k` 等。具体方法请参考 AstrBot 文档中关于[配置自定义模型参数](https://astrbot.app/config/model-config.html#配置自定义的模型参数)的部分。

> [!TIP]
> 经常检查 WeClone 服务的日志，确保 AstrBot 发送给模型的提示词与你微调和测试时期望的一致，并关闭所有工具插件。

---
**现在，你的分身应该已经部署到聊天机器人平台了，可以和它聊聊天看看效果。**
