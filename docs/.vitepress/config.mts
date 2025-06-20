import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh'
    },
    // en: {
    //   label: 'English',
    //   lang: 'en', // 可选，将作为 `lang` 属性添加到 `html` 标签中
    //   // link: '/en/' // 默认 /fr/ -- 显示在导航栏翻译菜单上，可以是外部的
    // }
  },
  title: "WeClone",
  description: "One-stop solution for creating your digital avatar from chat history",
  head: [['link', { rel: 'icon', href: '/img/logo.svg' }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    nav: [
      { text: '主页', link: '/' },
      { text: '文档', link: '/what-is-weclone' }
    ],
    outline: {
      level: [2, 3], // 显示 h2 和 h3 标题
      label: '目录' // 自定义标题，默认是 "On this page"
    },
    sidebar: [
      {
        text: '简介',
        collapsed: false,
        items: [
          { text: '什么是WeClone', link: '/what-is-weclone' },
          { text: 'FAQ', link: '/FAQ' }
        ]
      },
      {
        text: '部署',
        collapsed: false,
        items: [
          { text: '硬件要求', link: '/deploy/hardware' },
          {
            text: '环境配置',
            collapsed: true,
            items: [
              { text: 'Windows', link: '/deploy/Windows' },
              { text: 'WSL2', link: '/deploy/wsl2' },
              { text: 'Linux', link: '/deploy/Linux' }
            ]
          },
          { text: '导出聊天记录', link: '/deploy/export-chat-history' },
          { text: '模型下载', link: '/deploy/model_download' },
          { text: '数据预处理', link: '/deploy/data_preprocessing' },
          { text: '修改配置文件', link: '/deploy/override-settings' },
          { text: '模型微调', link: '/deploy/model_finetuning' },
          { text: '模型推理', link: '/deploy/model_inference' },
        ]
      },
      {
        text: '部署到聊天机器人',
        collapsed: false,
        items: [
          { text: 'AstrBot', link: '/chatbot/AstrBot' },
          { text: 'LangBot', link: '/chatbot/LangBot' },
          { text: 'Dify', link: '/chatbot/Dify' }
        ]
      },
    ],
    search: {
      provider: 'local'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/xming521/WeClone/' },
      { icon: 'x', link: 'https://x.com/weclone567' },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>'
        },
        link: 'https://t.me/weclone666',
        ariaLabel: '加入 Telegram 群组'
      }
    ],
    footer: {
      message: '联系我们：<a href="mailto:hello@weclone.love" style="color: var(--vp-c-brand-1); text-decoration: none;">📧 hello@weclone.love</a>',
      copyright: 'Copyright © 2025 WeClone. All rights reserved.'
    },
  }
})
