# 通过 Dify 部署到工作流

[Dify](https://dify.ai/zh) 是一个开源的 LLM 应用开发平台，致力于帮助开发者快速构建生成式 AI 应用。它提供直观易用的界面，结合 AI 工作流、RAG 管道、代理功能与模型管理等特性，大幅简化了从原型构建到实际部署的流程。

你可以将 `WeClone` 中的模型部署到 Dify，并集成进你的工作流中，提升模型的可用性和交互能力。

以下是部署的基本流程：

1. **部署 Dify：**
   可参考 [Dify 官方文档](https://docs.dify.ai/zh-hans/introduction) 进行安装配置，或直接使用其提供的云服务。

-  [Dify 云服务地址](https://cloud.dify.ai/apps)
-  [Dify 社区版部署教程](https://docs.dify.ai/zh-hans/getting-started/install-self-hosted/readme)

2. **配置模型供应商：**
   进入 Dify 主界面，点击左侧菜单中的 **设置 → 模型供应商 → OpenAI → 添加模型**。
   按如下方式进行配置：

   - 模型名称：填写 `gpt-3.5-turbo` 或其他 GPT 模型名称；
   - API Key / 组织 ID：可填写任意值；
   - API Base：
     - 若使用 Docker 部署的 Dify，请填写：`http://host.docker.internal:8005/`
     - 若使用 Dify 云服务，需要将本地服务暴露至公网，填写：`http://<公网IP地址>:8005/`
       ⚠️ *出于安全考虑，不推荐直接将本地服务暴露至公网。*

   <img src="https://blog-img.051088.xyz/Dify.png" alt="Dify 配置示意图" style="zoom:67%;" />

3. **在工作流中插入 WeClone 模型节点**

   在 Dify 的工作流编辑器中，插入一个 **LLM 节点**，并将其绑定到刚才添加的模型（如 `gpt-3.5-turbo`）。
    随后，在该节点的 **System Prompt（SYSTEM）** 配置中填写 WeClone 模型训练时所使用的提示词。
    若你使用的是 WeClone 的默认配置，则应填入：

   ```text
   请你扮演一名人类，不要说自己是人工智能。
   ```

   这样，模型在工作流中就能保持一致的语气风格与角色设定。

   ![Dify 工作流插入 WeClone 节点示意图](https://blog-img.051088.xyz/Dify01.png)

---
**现在，你的专属数字分身应该已经成功部署到 Dify 平台了！快去和“它”聊聊天，看看效果如何吧~**