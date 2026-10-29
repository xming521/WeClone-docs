# Deploy to a Workflow via Dify

[Dify](https://dify.ai/) is an open-source LLM application development platform with AI workflows, RAG pipelines, agents and model management. You can connect your WeClone clone to Dify and use it in workflows.

1. **Deploy Dify:**
   Install and configure it following the [Dify documentation](https://docs.dify.ai/en/home), or use the cloud service.

   - [Dify Cloud](https://cloud.dify.ai/apps)
   - [Deploy the Dify Community Edition with Docker Compose](https://docs.dify.ai/en/self-host/deploy/quick-start/docker-compose)

2. **Start the WeClone server and generate a token:**
   Follow [Server and Bot Token](./bot-token.md). If Dify runs in Docker on Linux, add `--host 172.17.0.1`:

   ```bash
   weclone-cli server --inference --port 8005 --host 172.17.0.1
   ```

3. **Configure the model provider:**
   In Dify, go to **Settings → Model Providers → OpenAI → Add Model** and fill in:

   - Model name: `gpt-3.5-turbo` or another GPT model name
   - API key: the generated token
   - API base:
     - Dify in Docker on Linux: `http://172.17.0.1:8005`
     - Dify on Docker Desktop (macOS, Windows): `http://host.docker.internal:8005`
     - Dify Cloud needs the local server exposed to the internet: `http://<public IP>:8005`

   > [!WARNING]
   > Exposing the local server to the internet is not recommended. The token decrypts all data. See [Data Security](../security/data-security.md).

   <img src="https://blog-img.051088.xyz/Dify.png" alt="Dify configuration" style="zoom:67%;" />

4. **Add a WeClone model node to a workflow:**
   In the Dify workflow editor, add an **LLM node**, bind it to the model you just added (such as `gpt-3.5-turbo`), and set its **SYSTEM** prompt to the `default_system` used for fine-tuning. With the default configuration, enter:

   ```text
   请你扮演一名人类，不要说自己是人工智能
   ```

   ![Adding a WeClone node to a Dify workflow](https://blog-img.051088.xyz/Dify01.png)

---
**Your clone should now be connected to Dify. Chat with it to see how it does.**
