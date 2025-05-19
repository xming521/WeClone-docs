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
  description: "从聊天记录创造数字分身的一站式解决方案",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '开始', link: '/what-is-weclone' }
    ],

    sidebar: [
      {
        text: '简介',
        collapsed: false,
        items: [
          { text: '什么是WeClone', link: '/what-is-weclone' }
        ]
      },
      {
        text: '部署',
        collapsed: false,
        items: [
          { text: '硬件要求', link: '/deploy/hardware' },
          {
            text:'环境配置',
            collapsed: true,
            items:[ 
            { text: 'Windows', link: '/deploy/Windows' },
            { text: 'WSL2', link: '/deploy/wsl2' }
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
          { text: 'LangBot', link: '/chatbot/LangBot' }
        ]
      },
    ],
    search: {
      provider: 'local'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/xming521/WeClone/' }
    ]
  }
})
