# 通过 AstrBot 部署到聊天机器人

[AstrBot](https://github.com/AstrBotDevs/AstrBot) 是一个支持多平台的 LLM 聊天机器人框架，可以将你的 WeClone 模型部署到 QQ、微信、Telegram 等平台。

部署步骤：

1. **部署 AstrBot：** 根据 AstrBot 官方文档的指引，在你的服务器或本地安装并配置好 AstrBot。


2. **启动 WeClone API 服务：** 确保你的 `weclone-cli server` 正在运行，并且 AstrBot 可以访问到该服务的地址和端口。

3. **在 AstrBot 中新增服务提供商：**

   * 类型选择：OpenAI
   * API Base URL：根据AstrBot部署方式填写WeClone API 服务地址 （例如：`http://127.0.0.1:8005/v1`）。
   * 模型： `gpt-3.5-turbo` 
   * API Key：随意填写几个字母即可，不要留空

4. **在 AstrBot 中部署消息平台：** 配置 AstrBot 以连接到你希望使用的聊天平台 (如微信、QQ 等)。

5. **关闭工具调用 (重要)：**
   微调后的模型主要用于模仿你的语言风格，通常不支持复杂的工具调用。在 AstrBot 对应的聊天平台中，向你的机器人发送指令关闭所有默认工具，以确保能看到微调效果，或者在 AstrBot WebUI中手动关闭工具：

   ```
   /tool off_all
   ```

6. **设置系统提示词：**
   在 AstrBot 的配置中，为你的机器人设置**系统提示词 (System Prompt)**。这个提示词必须与你微调模型时在 `settings.jsonc` 中设置的 `default_system` **完全一致**。

   <img src="https://blog-img.051088.xyz/AstrBot%E6%95%99%E7%A8%8B01.png"/>

7. **调整采样参数（可选）：**
   可以在配置文件的`infer_args`中调整模型的采样参数。也可在 AstrBot 中调整，如 `temperature`, `top_p`, `top_k` 等。具体配置方法请参考 AstrBot 文档中关于[配置自定义模型参数](https://astrbot.app/config/model-config.html#配置自定义的模型参数)的部分。

> [!TIP]
> 经常检查 `api_service.py` 的日志输出，确保 AstrBot 发送给大模型服务的prompt与你微调和测试时期望的一致。

---
**现在，你的专属数字分身应该已经成功部署到聊天机器人平台了！快去和“它”聊聊天，看看效果如何吧~**