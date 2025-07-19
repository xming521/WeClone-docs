# FAQ

::: tip
遇到问题时，可以逐步尝试以下方法，并检查是否解决：
- ##### 拉取最新代码，并更新环境 `uv pip install --group main -e .` 。
- ##### 检查模型是否下载完整，重新执行模型下载指令。
- ##### Issues： 查看 WeClone GitHub 仓库的 [Issues](https://github.com/xming521/WeClone/issues) 和 [Discussions](https://github.com/xming521/WeClone/discussions) 是否有类似问题。
- ##### 使用 [DeepWiki](https://deepwiki.com/xming521/WeClone) 直接与源码对话。
另外,可参考本页面常见问题。<br>
如果问题没有解决，请在[Issues](https://github.com/xming521/WeClone/issues)中提出。
:::

### 设备显存不够/Out-of-memory怎么办？
- 调整训练参数
    1. 降低批处理大小 per_device_train_batch_size: 1
    2. 降低最大序列长度 cutoff_len: 512
    3. 替换模型算子 enable_liger_kernel: true 和 use_unsloth_gc: true
    4. 使用 DeepSpeed ZeRO-3 或 FSDP 将模型权重拆分到多个设备或使用 CPU Offloading
    5. 使用量化后的模型微调（权重无法合并到原模型中）
    6. 设置 quantization_bit: 4 量化模型参数（仅限于 LoRA 方法）
- 可以先租用在线云平台的GPU进行微调，再将微调后的model_output文件夹下载到本地，在本地部署推理。
- 多模态模型减少`image_max_pixels`和`max_image_num`。
---

### 微调后效果不理想怎么办？
- 调整微调参数，例如：`lora_rank`、`lora_dropout`
- 使用更大参数规模的模型、更多的聊天记录数据来进行微调。
    - **7B模型效果一般，14B及格，32B效果较好**。
- 使用多模态模型来微调，减少数据集cut的次数。
- 启用数据清洗。
---


### LLaMA-Factory微调相关问题：  
- [![更方便的Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/hiyouga/LLaMA-Factory)
- [LLaMA-Factory| FAQs | 常见问题](https://github.com/hiyouga/LLaMA-Factory/issues/4614) 

### 聊天记录CSV文件打开乱码
不要使用Excel打开，使用IDE例如vscode打开。

### Windows环境问题
- `train_sft_args` 中设置`"dataloader_num_workers": 0` 参数，来解决Windows环境下 `Can't pickle local object` 的问题。