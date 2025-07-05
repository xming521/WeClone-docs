# 微调模型


## 单卡训练


```bash
weclone-cli train-sft
```

> 多卡环境单卡训练，需要先执行 `export CUDA_VISIBLE_DEVICES=0`

训练脚本会读取 `settings.jsonc` 中的配置并开始微调。留意终端输出，观察 loss 是否在正常下降。

## 多卡训练

如果你有多张 NVIDIA GPU 并希望进行多卡训练：

1. **安装 Deepspeed：**

   ```bash
   uv pip install deepspeed
   ```

2. **配置 Deepspeed** <br>
   在 `settings.jsonc` 中，找到 `deepspeed` 配置项，并取消其注释或根据需要填写 Deepspeed 的 JSON 配置文件路径。

3. **启动多卡训练：**

   ```bash
   deepspeed --num_gpus=<使用显卡数量> weclone/train/train_sft.py
   ```


训练完成后，微调好的 LoRA 适配器权重会保存在你 `settings.jsonc` 中指定的 `output_dir`。



## **启用 QLoRA（可选配置）**

如果你希望进一步减少显存消耗，可以开启 **QLoRA 量化训练**。

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
>   uv pip install bitsandbytes>=0.39.0
>   ```