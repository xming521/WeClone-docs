# 修改配置文件 (`settings.jsonc`)

WeClone 项目的训练与推理核心配置集中在 `settings.jsonc` 文件中。你需要根据实际使用场景，**适当调整其中的关键参数**。

## 重点关注参数
请打开项目根目录下的 `WeClone/settings.jsonc` 文件，重点关注以下配置项：

**训练相关参数：**

- **`per_device_train_batch_size`** 和 **`gradient_accumulation_steps`**：
  控制单张显卡的显存占用与有效 batch size。可根据显存大小调整，达到资源利用与训练稳定性的平衡。

   >**调节建议：**
   >
   >-  **显存较小**：减小 `per_device_train_batch_size`，增大 `gradient_accumulation_steps`；
   >-  显存充足：可适当增大 `per_device_train_batch_size`，以加快训练速度；

- **`train_sft_args` 中的参数**（适用于 SFT 阶段微调）：
  可根据数据量与任务复杂度调整以下参数：

  - `num_train_epochs`：训练轮数；
  - `lora_rank`：LoRA 子空间维度，越高越耗显存；
  - `lora_dropout`：LoRA dropout 比例，用于防止过拟合。

- **建议：**

  - 配置文件中包含详细注释，建议逐条阅读理解后再做修改。
  - 若你希望使用其他微调策略（如全量微调、Freeze 等），请确保 `finetuning_type` 与相关参数保持一致。
  - 进一步了解参数，请查看`LLaMA Factory`官方文档：[参数介绍 - LLaMA Factory](https://llamafactory.readthedocs.io/zh-cn/latest/advanced/arguments.html)


## **启用 QLoRA（可选配置）**

如果你希望进一步减少显存消耗（尤其在显存紧张场景下），可以开启 **QLoRA 量化训练**。

在 `settings.jsonc` 的 `common_args` 字段中添加以下配置：

```json
"quantization_bit": 4,
"quantization_type": "nf4",
"double_quantization": true,
"quantization_method": "bitsandbytes"
```

> [!NOTE]
>
> - `quantization_bit` 支持值：2 / 4 / 8，数值越低显存越省，但推理速度和效果可能略有下降。
>
> - 如果遇到报错`ImportError: Please install bitsandbytes>=0.45.3`，可以尝试重新安装`bitsandbytes`：
>
>   ```bash
>   #使用uv安装 bitsandbytes，建议科学上网
>   uv pip install bitsandbytes>=0.39.0
>   ```

**调整建议：**

- 配置文件中包含详细注释，建议逐条阅读理解后再做修改。
- 若你希望使用其他微调策略（如全量微调、Freeze、QLoRA 等），请确保 `finetuning_type` 与相关参数保持一致。
- 进一步了解参数详情请查看`LLaMA Factory`官方文档：[参数介绍 - LLaMA Factory](https://llamafactory.readthedocs.io/zh-cn/latest/advanced/arguments.html)

<details>
<summary>Linux编辑文件操作教程（nano编辑器简要教程）</summary>

1. 在根目录下运行`nano`编辑器

```bash
nano settings.jsonc 
```

2. 移动光标到你要修改的位置，进行对应修改操作。

   `Ctrl + ^` 是标记开始（英文叫 "set mark"）；

   `Alt + 6` 是复制（保留内容），`Ctrl + K` 是剪切（删除原内容）；`Ctrl + U` 是粘贴(仅粘贴内部复制或剪切内容)；

   `鼠标右键`是粘贴外部内容。

3. 修改后按 `Ctrl + O` 保存，按 `Enter` 确认；再按 `Ctrl + X` 退出。

</details>


---

**到这里你已经完成所有前期的配置工作了，接下来即将开始正式推理、训练模型！！！**