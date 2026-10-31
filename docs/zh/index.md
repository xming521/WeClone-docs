---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "WeClone"
  text: "绘制你的人生画像"
  tagline: 让助理懂你，让分身像你
  image: 
    src: /img/logo_plain.png
    alt: "weclone-hero-image"
  actions:
    - theme: brand
      text: 快速开始
      link: /zh/docs/introduce/what-is-weclone
    - theme: alt
      text: GitHub仓库
      link: https://github.com/xming521/WeClone/

features:
  - icon: 🗺️
    title: 交互式人生画像
    details: 画像按板块与主题逐层组织，每条事实均可追溯原文，支持逐条审核与修改。可通过 Codex 或任意 OpenAI 兼容 API 抽取画像。

  - icon: 🧠
    title: 接入 AI 助理
    details: Claude Code、Codex 等助手可通过 MCP 读取你的画像与板块总结，能读哪些板块、读到哪个隐私级别由你设定。

  - icon: 🎭
    title: 专属数字分身
    details: 基于聊天记录微调开源模型，并通过 AstrBot、LangBot 部署至 Telegram、Discord、Slack、飞书等平台。训练数据经过隐私信息过滤。

  - icon: 🗣️
    title: 语言风格分析
    details: 覆盖词汇、句式、语气、情绪、修辞、互动节奏等十大类、179 项风格特征。

  - icon: 🤖
    title: Agent 分身（开发中）
    details: 无需训练，由大模型结合画像、记忆与语言风格实时驱动。

  - icon: 🔒
    title: 隐私优先
    details: 默认本地加密存储，每条事实标注隐私级别，导出与授权范围由你决定。
---
