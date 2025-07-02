import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh'
    },
    en: {
      label: 'English',
      lang: 'en', // 可选，将作为 `lang` 属性添加到 `html` 标签中
      // link: '/en/' // 默认 /fr/ -- 显示在导航栏翻译菜单上，可以是外部的
    }
  },
  title: "WeClone",
  description: "One-stop solution for creating your digital avatar from chat history",
  head: [['link', { rel: 'icon', href: '/img/logo.svg' }]],
  lastUpdated: true,
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
          { text: '社区资源', link: '/community-resources' },
          { text: 'FAQ', link: '/FAQ' },
        ]
      },
      {
        text: '部署WeClone',
        collapsed: false,
        items: [
          { text: '硬件要求', link: '/deploy/hardware' },
          { text: '环境配置', link: '/deploy/environment' },
          { text: '导出聊天记录', link: '/deploy/export-chat-history' },
          { text: '修改配置文件', link: '/deploy/override-settings' },
          { text: '模型下载', link: '/deploy/model_download' },
          { text: '数据预处理', link: '/deploy/data_preprocessing' },
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
      },
      {
        icon: {
          svg: '<svg t="1751163941772" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1499" width="256" height="256"><path d="M757.6 53.6H228C114.4 53.6 22.4 145.6 22.4 259.2v529.6c0 113.6 92 205.6 205.6 205.6h529.6c113.6 0 205.6-92 205.6-205.6V259.2c0-113.6-92-205.6-205.6-205.6zM169.6 586.4l-20 44-31.2-52 13.6-119.2h48.8l-11.2 127.2z m99.2 68.8H219.2c-19.2 0-35.2-16-35.2-35.2v-8.8l35.2 5.6V392h48.8l0.8 263.2z m35.2-96l-4.8-100h49.6l12.8 122.4-28 48.8-29.6-71.2z m132.8 96h-78.4l24-50.4h78.4l-24 50.4z m-49.6-68.8l17.6-36 23.2-48H368.8L421.6 392h48.8l-35.2 72.8h10.4l3.2-6.4h48.8l-44 91.2H480l-17.6 36h-75.2v0.8z m247.2 68.8H464.8l24-50.4h48.8V452h-30.4v-42.4H616v42.4h-30.4v153.6h48.8v49.6z m228-110.4V617.6c0 20.8-16.8 37.6-37.6 37.6h-21.6c-19.2 0-35.2-16-35.2-35.2v-8.8h45.6v-66.4H734.4v110.4h-48.8V544.8h-44.8v-42.4h44.8v-51.2H648v-42.4h37.6V392h48.8v17.6h28c16.8 0 31.2 9.6 37.6 24 4 7.2 6.4 16 6.4 24.8v44h17.6c20.8 0 38.4 16.8 38.4 38.4v4z m-20.8-92.8h-24v-24c0-13.6 11.2-24 24-24 13.6 0 24 11.2 24 24 0.8 12.8-10.4 24-24 24z" p-id="1500"></path><path d="M734.4 452h24v51.2h-24z" p-id="1501"></path></svg>'
        },
        link: 'https://www.xiaohongshu.com/user/profile/628109730000000021029de4',
        ariaLabel: '关注小红书'
      }
    ],
    editLink: {
      pattern: 'https://github.com/xming521/WeClone-docs/blob/main/docs/:path',
      text: 'Edit this page on GitHub'
    },
    footer: {
      message: '联系我们：<a href="mailto:hello@weclone.love" style="color: var(--vp-c-brand-1); text-decoration: none;">✉️ hello@weclone.love</a>',
      copyright: 'Copyright © 2025 WeClone. All rights reserved.'
    },

  }

})