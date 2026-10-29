# Deploy to a Chat Bot via LangBot

[LangBot](https://github.com/langbot-app/LangBot) is an open-source LLM bot platform that connects to many instant messaging platforms worldwide.

1. [Deploy LangBot](https://docs.langbot.app/en/insight/guide) and add a bot in LangBot.
2. Start the WeClone server and generate a token as described in [Server and Bot Token](./bot-token.md). If LangBot runs in Docker on Linux, add `--host 172.17.0.1` to the command. Docker Desktop doesn't need it.
3. Add a new model on the model page: name it `gpt-3.5-turbo`, choose OpenAI as the provider, set the request URL to the WeClone address (see the [LangBot documentation](https://docs.langbot.app/en/workshop/network-details) for connection details), and use the generated token as the API key.

<img width="400px" alt="image" src="https://github.com/user-attachments/assets/fc167dea-7c93-4d94-9c5f-db709d0320ba" />

4. Select the new model in the pipeline configuration and set the prompt to the `default_system` used for fine-tuning.

<img width="400px" alt="image" src="https://github.com/user-attachments/assets/dbb0fd0a-f760-42db-acd0-bb99c859b52e" />

---
**Your clone should now be running on the chat bot platform. Chat with it to see how it does.**
