# 微调模型

配置完成后，就可以开始训练了。

## 单卡训练

在激活虚拟环境的命令行中，运行：

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

   > [!WARNING]
   > Deepspeed 在 Windows 上的原生支持可能有限或配置复杂。官方主要支持 Linux。如果遇到安装或运行问题，可能需要查阅 Deepspeed 官方文档或社区寻求 Windows 解决方案，或者考虑在 WSL2 环境下使用 Deepspeed。

2. **配置 Deepspeed：**
   在 `settings.jsonc` 中，找到 `deepspeed` 配置项，并取消其注释或根据需要填写 Deepspeed 的 JSON 配置文件路径。

3. **启动多卡训练：**

   ```bash
   deepspeed --num_gpus=<使用显卡数量> weclone/train/train_sft.py
   ```

   例如，使用2张显卡：`deepspeed --num_gpus=2 weclone/train/train_sft.py`

训练完成后，微调好的 LoRA 适配器权重会保存在你 `settings.jsonc` 中指定的 `output_dir`。