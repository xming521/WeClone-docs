# 通过 Dify 部署到工作流

[Dify](https://dify.ai/zh) 是开源的 LLM 应用开发平台，提供 AI 工作流、RAG 管道、Agent 和模型管理等功能。你可以把 WeClone 的分身接入 Dify，在工作流中使用。

1. **部署 Dify：**
   参考 [Dify 官方文档](https://docs.dify.ai/zh/home) 安装配置，或直接使用云服务。

   - [Dify 云服务](https://cloud.dify.ai/apps)
   - [Dify 社区版 Docker Compose 部署](https://docs.dify.ai/zh/self-host/deploy/quick-start/docker-compose)

2. **启动 WeClone 服务并生成令牌：**
   按[启动服务与令牌](./bot-token.md)启动服务并生成令牌。Dify 用 Docker 部署在 Linux 上时，启动命令加上 `--host 172.17.0.1`：

   ```bash
   weclone-cli server --inference --port 8005 --host 172.17.0.1
   ```

3. **配置模型供应商：**
   在 Dify 中进入 **设置 → 模型供应商 → OpenAI → 添加模型**，按如下方式填写：

   - 模型名称：`gpt-3.5-turbo` 或其他 GPT 模型名称
   - API Key：生成的令牌
   - API Base：
     - Linux 上用 Docker 部署的 Dify：`http://172.17.0.1:8005`
     - Docker Desktop（macOS、Windows）上部署的 Dify：`http://host.docker.internal:8005`
     - Dify 云服务需要把本地服务暴露到公网，填写 `http://<公网IP地址>:8005`

   > [!WARNING]
   > 不推荐把本地服务直接暴露到公网。令牌能解密全部数据，详见[数据安全](../security/data-security.md)。

   <img src="https://blog-img.051088.xyz/Dify.png" alt="Dify 配置示意图" style="zoom:67%;" />

4. **在工作流中插入 WeClone 模型节点：**
   在 Dify 的工作流编辑器中插入一个 **LLM 节点**，绑定刚才添加的模型（如 `gpt-3.5-turbo`），在节点的 **SYSTEM** 中填写微调时使用的 `default_system`。使用默认配置时填写：

   ```text
   请你扮演一名人类，不要说自己是人工智能
   ```

   ![Dify 工作流插入 WeClone 节点示意图](https://blog-img.051088.xyz/Dify01.png)

---
**现在，你的分身应该已经接入 Dify 了，可以和它聊聊天看看效果。**
