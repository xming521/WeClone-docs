# WeClone：让你的聊天记录拥有“灵魂”

你是否曾设想过——如果你的聊天风格、口头禅，甚至独特的表达习惯，能够被 AI 学会，并在数字世界中“复刻”一个你，会是怎样的体验？ [xming521/WeClone 项目](https://github.com/xming521/WeClone) 正是在这样一个愿景下诞生的尝试。

WeClone 是一个一站式解决方案，它通过分析你的微信聊天记录，微调大语言模型（LLM），让模型说出“你那味儿”的话，并将其接入聊天机器人，打造出专属于你的数字分身。

<details>   <summary>点击展开查看我的训练效果图</summary>   <div style="display: flex; justify-content: center; align-items: stretch; gap: 10px; margin-top: 10px;">     <img src="https://blog-img.051088.xyz/%E6%9C%80%E7%BB%88%E6%95%88%E6%9E%9C1.png" alt="图1" style="max-width: 55%; object-fit: contain;" />     <img src="https://blog-img.051088.xyz/%E6%9C%80%E7%BB%88%E6%95%88%E6%9E%9C.png" alt="图2" style="max-width: 35%; object-fit: contain;" />   </div> </details>

------

::: tip
WeClone 项目仍在快速更新迭代中，当前效果并非最终状态。本教程基于WeClone 0.2.2书写。微调结果受模型规模、数据数量及数据质量等因素影响较大。通常来说，**模型越大、数据越多、表达越一致，效果越接近原始人格特征**。此外，由于 Windows 环境并未作为官方推荐平台，本指南旨在提供一个实践参考，实际运行中仍可能遇到特定问题。
:::

------

在正式开始前，请务必注意：

::: warning
请务必妥善保护自己的聊天记录及个人信息，**切勿上传至公共平台**，并确保本项目不被用于任何非法用途。使用者应对自己的数据使用和行为承担全部责任。
:::

------

## 问题解决与支持

  * **微调问题：** 可以参考 LLaMA Factory 的 [FAQs | 常见问题](https://github.com/hiyouga/LLaMA-Factory/issues/4614)，因为 WeClone 底层使用了 LLaMA Factory 的部分组件或类似逻辑。
  * **项目 Issues：** 查看 WeClone GitHub 仓库的 [Issues](https://github.com/xming521/WeClone/issues) 和 [Discussions](https://github.com/xming521/WeClone/discussions) 是否有类似问题和解决方案。

## 免责声明

> [!CAUTION]
> 请勿用于非法用途，否则后果自负。
> 本教程仅供学习交流使用。任何违反法律法规、侵犯他人合法权益的行为，均与WeClone项目及笔者无关。严禁用于窃取他人隐私。

## 参考资料


