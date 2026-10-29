# 模型下载

WeClone 默认使用 Qwen2.5-7B-Instruct 模型，你也可以选择 [LLaMA Factory](https://github.com/hiyouga/LLaMA-Factory/blob/main/README_zh.md#%E6%A8%A1%E5%9E%8B) 支持的其他模型（不推荐使用思考模型）。

::: tip
7B模型一般效果较差(也有反馈还可以的，这可能和数据有关)，14B勉强及格，32B效果较好。
:::

## 方法一：使用 ModelScope 下载（国内推荐）

```bash
uv pip install modelscope
modelscope download --model Qwen/Qwen2.5-7B-Instruct --local_dir ./models/Qwen2.5-7B-Instruct
```

## 方法二：使用 Hugging Face 下载

```bash
hf download Qwen/Qwen2.5-7B-Instruct --local-dir models/Qwen2.5-7B-Instruct
```

> ⚠️ 模型文件较大，下载时间可能较长，请确保磁盘空间充足（建议至少 20GB）。<br>
下载过程中连接可能中断，重新执行命令即可继续下载。

## 换用其他模型

选择了其他模型，或将模型下载到了其他目录时，请在 `settings.jsonc` 中修改：

```json
"common_args": {
    "model_name_or_path": "你的模型路径",
    "template": "你的模型模板",
    ...
},
"train_sft_args": {
    "lora_target": "需要微调的模型的模块名称", // 例如："q_proj,v_proj"
    ...
},
```

## 多模态模型

微调多模态模型时，在 `settings.jsonc` 中修改：

- `model_name_or_path` 换成视觉语言模型，例如 `./models/Qwen2.5-VL-7B-Instruct`
- `template` 改为 `qwen2_vl`
- `include_type` 加上 `"image"`
- `lora_target` 末尾加上 `,visual.merger.mlp.0,visual.merger.mlp.2`

## 英文聊天

聊天以英文为主时，把 `default_system` 改成英文，`test_model_args.test_data_path` 改为 `dataset/eval/test_data-en.json`。
