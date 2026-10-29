---
outline: false
---
# What is WeClone

WeClone distills your identity, goals, preferences and current situation from your digital life into a portrait of your life, organized into domains such as work, family and health, that you can review, trace to its sources and share on your own terms. It also analyzes your speaking style. The portrait works as long-term memory for your AI assistants and will power clones with your personal style. Chat history is supported today, with more data sources coming.

## Two routes

| Route | What it does | What it needs |
|---|---|---|
| [Life portrait and assistants](../profile/build-profile.md) | Extract and organize your portrait, review it fact by fact in the web UI, and share it with Claude Code, Codex and other assistants over MCP | The base install and the Codex CLI or any OpenAI-compatible API. No GPU |
| [Fine-tuned clone](../deploy/hardware.md) | Fine-tune an open model on your chat history and connect it to bot platforms such as AstrBot and LangBot | An NVIDIA GPU. The default model with LoRA needs about 16GB of VRAM |

Both routes share [Installation](../deploy/environment.md) and [Preparing Data](../deploy/export-chat-history.md), and you can follow just one of them. The agent clone, driven by a large model from your portrait, memories and speaking style, is still in development.

::: tip
The portrait's extraction prompts are currently in Chinese, and English chats have not been tested yet. The web UI is available in English and Chinese.
:::

## Fine-tuned clone results

> ##### Bots fine-tuned with WeClone run in our [community channels](./community-resources.md). More examples are on our [Xiaohongshu](https://www.xiaohongshu.com/user/profile/628109730000000021029de4).

> [!NOTE]
> We're looking for interesting examples of native English speakers chatting with WeClone!
> Feel free to share them with us on Twitter.

::: details View fine-tuning screenshots (click to expand)
<div style="display: flex; flex-wrap: wrap; gap: 10px;">
<img src="/screenshots/1.jpg" alt="WeClone fine-tuning demo 1" style="width: 52%; min-width: 150px;">
<img src="/screenshots/2.jpg" alt="WeClone fine-tuning demo 2" style="width: 52%; min-width: 150px;">
<img src="/screenshots/3.jpg" alt="WeClone fine-tuning demo 3" style="width: 52%; min-width: 150px;">
</div>
:::

::: tip
Fine-tuning results depend on the model size and on the amount and quality of the dialogue data. Generally, **the larger the model, the more dialogue data and the more consistent the style, the closer the clone gets to you**.
:::

Before you begin, please note:

::: warning
Properly protect your personal chat records and the portrait built from them to prevent the leakage of private information. **Do not upload them to public platforms**.<br> Ensure this project is not used for any illegal purposes. Users are solely responsible for their use of data and their actions.
:::

## ⚠️ Disclaimer
> [!CAUTION]
> **This project is for learning, research, and experimental purposes only. Using it in a production environment carries significant risks. Please evaluate carefully.**
> **Do not use for illegal purposes. You are responsible for your own actions.**

**Users must carefully read and understand the entire content of this disclaimer before use and ensure strict compliance with its provisions when using this project.**

::: details Click to view Disclaimer Terms
### 1. Assumption of Risk
- Users should fully understand and assume all related risks when using this project.
- **The author of this project is not responsible for any direct or indirect losses arising from the use of this project.**
- This includes, but is not limited to: data loss, economic loss, legal disputes, damage to personal reputation, impact on social relationships, psychological trauma, career setbacks, and damage to business reputation.

### 2. Production Environment Risk Warning
- **Users assume all risks for using this project for commercial purposes or providing services to others.**
- The user is solely responsible for all consequences that may arise from use in a production environment (including but not limited to service interruptions, data security issues, user complaints, legal liabilities, etc.).
- **It is recommended to conduct thorough testing, validation, and risk assessment before using in a production environment.**

### 3. Unreliability of Model Output
- The fine-tuned model may produce inaccurate, harmful, or misleading content.
- The model's output does not represent the views or intentions of the real person.
- Users should manually review and verify the model's output.

### 4. Data Security and Privacy
- Users must ensure that the uploaded chat records and other data comply with relevant laws and regulations.
- Users must obtain **appropriate authorization from the individuals involved in the data**.
- This project is not responsible for **data leakage or privacy violations**.

### 5. Legal Compliance
- **Users must ensure that their use of this project complies with local laws and regulations.**
- This includes laws related to artificial intelligence, data protection, and intellectual property.
- **The user is responsible for the consequences of any illegal use.**

### 6. Limitation of Technical Support
- This project is provided "as is," without any express or implied warranties.
- The author does not commit to providing ongoing technical support or maintenance.
- The stability, reliability, or suitability of the project is not guaranteed.

## Usage Suggestions

### Mandatory Bot Identity
**When using a clone generated by this project, it is strongly recommended to:**
- Clearly identify it as an "AI Bot" or "AI clone" at the beginning of each conversation.
- Prominently display "This is AI-generated content" in the user interface.
- Avoid misleading users into thinking they are conversing with a real human, which could create risks.

### Risk Assessment Suggestions

If it is necessary to use this in a production environment, it is recommended to:
1. Conduct comprehensive security testing.
2. Establish a robust content moderation mechanism.
3. Develop an emergency response plan.
4. Purchase appropriate insurance coverage.
5. Consult with legal professionals.

This disclaimer may be revised as the project is updated. Users should check the latest version regularly. Continued use of this project constitutes acceptance of the latest disclaimer terms.

By downloading, cloning, modifying, distributing, or otherwise using the code or models of this project, you acknowledge that you have read, understood, and unconditionally agree to all terms of this disclaimer.
:::
