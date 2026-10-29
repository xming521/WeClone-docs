# Deploy to a Chat Bot via AstrBot

[AstrBot](https://github.com/AstrBotDevs/AstrBot) is an easy-to-use multi-platform LLM chat bot framework that can deploy your WeClone clone to Telegram, Feishu, Slack, Discord and more.

Steps:

1. **Deploy AstrBot:** install and configure AstrBot on your server or locally following its documentation, and set up the messaging platform you want to use.

2. **Start the WeClone server and generate a token:** follow [Server and Bot Token](./bot-token.md) to run `weclone-cli server --inference --port 8005` and generate a token on the Bots page of the web UI. If AstrBot runs in Docker on Linux, add `--host 172.17.0.1` to the command.

3. **Add a provider in AstrBot:**

   * Type: OpenAI
   * API Base URL: the WeClone address as AstrBot reaches it, such as `http://127.0.0.1:8005/v1`. In Docker on Linux, `http://172.17.0.1:8005/v1`. On Docker Desktop, `http://host.docker.internal:8005/v1`
   * Model: `gpt-3.5-turbo`
   * API Key: the generated token

4. **Turn off tool calling (important):**
   The fine-tuned model imitates your style and doesn't support tool calling. Send this command to your bot on the chat platform to turn off all default tools, or turn them off by hand in the AstrBot WebUI, so you can see the fine-tuning effect:

   ```
   /tool off_all
   ```

5. **Set the system prompt:**
   Set the bot's **System Prompt** in the AstrBot configuration. It must **exactly match** `default_system` in `settings.jsonc` used for fine-tuning.

   <img src="https://blog-img.051088.xyz/AstrBot%E6%95%99%E7%A8%8B01.png"/>

6. **Adjust sampling parameters (optional):**
   Adjust sampling in `infer_args` of the configuration file or in AstrBot, such as `temperature`, `top_p` and `top_k`. See [custom model parameters](https://astrbot.app/config/model-config.html) in the AstrBot documentation.

> [!TIP]
> Check the WeClone server log regularly to make sure the prompt AstrBot sends matches what you used in fine-tuning and testing, with all tool plugins off.

---
**Your clone should now be running on the chat bot platform. Chat with it to see how it does.**
