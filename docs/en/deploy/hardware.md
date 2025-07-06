---
pageClass: wide-page
---
# Required Hardware Configuration

Running WeClone (especially during the model fine-tuning phase) has high requirements for video memory. It is recommended to use a dedicated GPU device or a cloud GPU rental service. Running on integrated graphics or with only a CPU is not recommended.

The project uses the [`Qwen2.5-7B-Instruct`](https://www.modelscope.cn/models/Qwen/Qwen2.5-7B-Instruct) model by default and employs the **LoRA** method for fine-tuning, which requires approximately **16GB** of video memory.<br>
Additionally, please reserve **more than 20GB of hard disk space** to store model files, intermediate results, and cached data.

The following table lists the estimated video memory requirements for different model sizes and fine-tuning methods. Multimodal models will occupy more video memory depending on the size and number of images:

| Fine-tuning Method | Precision (bits) | 7B Model | 14B Model | 30B Model | 70B Model | `x`B Model |
|---|---|---|---|---|---|---|
| Full (`bf16` / `fp16`) | 32 | 120GB | 240GB | 600GB | 1200GB | `18x` GB |
| Full (`pure_bf16`) | 16 | 60GB | 120GB | 300GB | 600GB | `8x` GB |
| Freeze / LoRA / GaLore / APOLLO | 16 | 16GB | 32GB | 64GB | 160GB | `2x` GB |
| QLoRA | 8 | 10GB | 20GB | 40GB | 80GB | `x` GB |
| QLoRA | 4 | 6GB | 12GB | 24GB | 48GB | `x/2` GB |
| QLoRA | 2 | 4GB | 8GB | 16GB | 24GB | `x/4` GB |


If you wish to enable the QLoRA fine-tuning method, please refer to the subsequent chapter "[Override Settings](override-settings.md)" to learn how to switch the fine-tuning strategy.

::: tip
Video Memory ≥16GB: The default LoRA fine-tuning scheme is recommended.
Video Memory <16GB: Consider switching to QLoRA or choosing a model with a smaller number of parameters.
:::