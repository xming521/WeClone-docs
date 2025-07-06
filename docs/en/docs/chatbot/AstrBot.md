# Deploy to a Chatbot via AstrBot

[AstrBot](https://github.com/AstrBotDevs/AstrBot) is a multi-platform LLM chatbot framework that can deploy your WeClone model to platforms like QQ, WeChat, and Telegram.

Deployment steps:

1. **Deploy AstrBot:** Follow the official AstrBot documentation to install and configure AstrBot on your server or local machine.


2. **Start the WeClone API service:** Ensure that your `weclone-cli server` is running and that AstrBot can access the service's address and port.

3. **Add a new service provider in AstrBot:**

   * Type: OpenAI
   * API Base URL: Fill in the WeClone API service address according to the AstrBot deployment method (e.g., `http://127.0.0.1:8005/v1`).
   * Model: `gpt-3.5-turbo`
   * API Key: Just fill in a few random letters, do not leave it blank.

4. **Deploy a messaging platform in AstrBot:** Configure AstrBot to connect to the chat platform you want to use (e.g., WeChat, QQ, etc.).

5. **Disable tool calls (Important):**
   The fine-tuned model is mainly used to imitate your language style and usually does not support complex tool calls. In the corresponding chat platform in AstrBot, send a command to your bot to turn off all default tools to ensure you can see the fine-tuning effect, or manually turn off the tools in the AstrBot WebUI:

   ```
   /tool off_all
   ```

6. **Set the system prompt:**
   In the AstrBot configuration, set the **System Prompt** for your bot. This prompt must be **exactly the same** as the `default_system` you set in `settings.jsonc` when you fine-tuned the model.

   <img src="https://blog-img.051088.xyz/AstrBot%E6%95%99%E7%A8%8B01.png"/>

7. **Adjust sampling parameters (Optional):**
   You can adjust the model's sampling parameters in the `infer_args` of the configuration file. You can also adjust them in AstrBot, such as `temperature`, `top_p`, `top_k`, etc. For specific configuration methods, please refer to the section on [configuring custom model parameters](https://astrbot.app/config/model-config.html#configuring-custom-model-parameters) in the AstrBot documentation.

> [!TIP]
> Frequently check the log output of `api_service.py` to ensure that the prompt sent by AstrBot to the large model service is consistent with what you expected during fine-tuning and testing.

---
**Now, your exclusive digital avatar should be successfully deployed to the chatbot platform! Go and chat with "it" to see how it works~**