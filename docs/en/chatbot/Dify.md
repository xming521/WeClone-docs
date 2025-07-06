# Deploy to a Workflow via Dify

[Dify](https://dify.ai/) is an open-source LLM application development platform dedicated to helping developers quickly build generative AI applications. It provides an intuitive and easy-to-use interface, combining features such as AI workflows, RAG pipelines, agent functionality, and model management, which greatly simplifies the process from prototype construction to actual deployment.

You can deploy the model from `WeClone` to Dify and integrate it into your workflow to enhance the model's usability and interactivity.

Here is the basic deployment process:

1. **Deploy Dify:**
   You can refer to the [official Dify documentation](https://docs.dify.ai/getting-started/readme) for installation and configuration, or use their cloud service directly.

- [Dify Cloud Service Address](https://cloud.dify.ai/apps)
- [Dify Community Edition Deployment Tutorial](https://docs.dify.ai/getting-started/install-self-hosted/readme)

2. **Configure the Model Provider:**
   Go to the Dify main interface, click **Settings → Model Providers → OpenAI → Add Model** in the left menu.
   Configure as follows:

   - Model Name: Fill in `gpt-3.5-turbo` or another GPT model name;
   - API Key / Organization ID: You can fill in any value;
   - API Base:
     - If you are using Dify deployed with Docker, please fill in: `http://host.docker.internal:8005/`
     - If you are using the Dify cloud service, you need to expose your local service to the public network and fill in: `http://<public_ip_address>:8005/`
       ⚠️ *For security reasons, it is not recommended to expose local services directly to the public network.*

   <img src="https://blog-img.051088.xyz/Dify.png" alt="Dify Configuration Diagram" style="zoom:67%;" />

3. **Insert a WeClone Model Node in the Workflow**

   In the Dify workflow editor, insert an **LLM node** and bind it to the model you just added (e.g., `gpt-3.5-turbo`).
    Then, in the **System Prompt (SYSTEM)** configuration of that node, fill in the prompt used during the WeClone model training.
    If you are using WeClone's default configuration, you should enter:

   ```text
   Please act as a human and do not say that you are an artificial intelligence.
   ```

   This way, the model can maintain a consistent tone and character setting within the workflow.

   ![Diagram of inserting a WeClone node in a Dify workflow](https://blog-img.051088.xyz/Dify01.png)

---
**Now, your exclusive digital avatar should be successfully deployed to the Dify platform! Go and chat with "it" to see how it works~**