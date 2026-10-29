# 微调模型

开始前请先完成[数据预处理](data_preprocessing.md)。

## 训练参数

- 修改 `per_device_train_batch_size` 和 `gradient_accumulation_steps` 调整显存占用。
- 根据数据的数量和质量调整 `train_sft_args` 中的 `num_train_epochs`、`lora_rank`、`lora_dropout` 等参数。
- `train_sft_args` 支持 LLaMA Factory 的所有参数，见 [参数介绍 - LLaMA Factory](https://llamafactory.readthedocs.io/zh-cn/latest/advanced/arguments.html)。

## 单卡训练

```bash
weclone-cli train-sft
```

> 多卡环境单卡训练，需要先执行 `export CUDA_VISIBLE_DEVICES=0`

训练脚本会读取 `settings.jsonc` 中的配置并开始微调。留意终端输出，观察 loss 是否在正常下降。

训练完成后，LoRA 适配器权重保存在 `common_args.adapter_name_or_path`（默认 `./model_output`），它同时也是训练的输出目录。加密模式下权重加密保存。

## 多卡训练

如果你有多张 NVIDIA GPU：

1. **安装 DeepSpeed：**

   ```bash
   uv pip install "deepspeed<=0.16.9"
   ```

2. **配置 DeepSpeed：** 取消 `settings.jsonc` 中 `"deepspeed": "ds_config.json"` 一行的注释，或填写你自己的 DeepSpeed 配置文件路径。

3. **启动多卡训练：**

   ```bash
   deepspeed --num_gpus=<使用显卡数量> weclone/train/train_sft.py
   ```

> [!WARNING]
> 加密模式暂不支持分布式训练。

## 启用 QLoRA（可选配置）

如果你希望进一步减少显存消耗，可以开启 **QLoRA 量化训练**。

> [!Warning]
> 
> 使用量化后的模型进行微调后权重将无法合并到原模型中。

在 `settings.jsonc` 的 `train_sft_args` 中添加 `quantization`：

```json
"train_sft_args": {
    ...
    "quantization": {
        "quantization_bit": 4,
        "quantization_type": "nf4",
        "double_quantization": true,
        "quantization_method": "bnb"
    }
},
```

> [!NOTE]
>
> - `quantization_bit` 支持值：2 / 4 / 8，数值越低显存越省，但推理速度和效果可能略有下降。
> - 推理（`webchat-demo`、`server --inference`）沿用这里的量化设置。
> - 如果遇到报错`ImportError: Please install bitsandbytes>=0.45.3`，可以尝试重新安装`bitsandbytes`：
>
>   ```bash
>   uv pip install "bitsandbytes>=0.45.3"
>   ```
