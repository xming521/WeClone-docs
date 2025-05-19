import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "WeClone",
  description: "从聊天记录创造数字分身的一站式解决方案",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '开始', link: '/什么是WeClone' }
    ],

    sidebar: [
      {
        text: '简介',
        collapsed: false,
        items: [
          { text: '什么是WeClone', link: '/什么是WeClone' }
        ]
      },
      {
        text: '部署',
        collapsed: false,
        items: [
          { text: '硬件要求', link: '/硬件要求' },
          {
            text:'环境配置',
            collapsed: true,
            items:[ 
            { text: 'Windows', link: '/纯Windows环境部署指南' },
            { text: 'WSL2', link: '/WSL2部署指南' }
            ]
          },
          { text: '导出聊天记录', link: '/导出聊天记录' },
          { text: '模型下载', link: '/模型下载' },
          { text: '数据预处理', link: '/数据预处理' },
          { text: '修改配置文件', link: '/修改配置文件' },
          { text: '模型微调', link: '/模型微调' },
          { text: '模型推理', link: '/模型推理' },
        ]
      },
      {
        text: '部署到聊天机器人',
        collapsed: false,
        items: [
          { text: 'AstrBot', link: '/部署到AstrBot' },
          { text: 'LangBot', link: '/部署到LangBot' }
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
