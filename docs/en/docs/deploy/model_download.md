# Model Download

WeClone uses Qwen2.5-7B-Instruct by default. Other models supported by [LLaMA Factory](https://github.com/hiyouga/LLaMA-Factory/tree/main#supported-models) also work (thinking models are not recommended).

::: tip
7B models generally give weak results (some users report acceptable results, which may depend on the data), 14B is barely acceptable, and 32B is better.
:::

## Method 1: Hugging Face

```bash
hf download Qwen/Qwen2.5-7B-Instruct --local-dir models/Qwen2.5-7B-Instruct
```

## Method 2: ModelScope (recommended in mainland China)

```bash
uv pip install modelscope
modelscope download --model Qwen/Qwen2.5-7B-Instruct --local_dir ./models/Qwen2.5-7B-Instruct
```

> ⚠️ The model files are large and the download may take a while. Make sure you have enough disk space (at least 20GB is recommended).<br>
If the connection drops, run the command again to resume.

## Using another model

If you chose another model or downloaded it to another directory, change `settings.jsonc`:

```json
"common_args": {
    "model_name_or_path": "your_model_path",
    "template": "your_model_template",
    ...
},
"train_sft_args": {
    "lora_target": "module_names_to_fine_tune", // e.g. "q_proj,v_proj"
    ...
},
```

## Multimodal models

To fine-tune a multimodal model, change `settings.jsonc`:

- set `model_name_or_path` to a vision-language model such as `./models/Qwen2.5-VL-7B-Instruct`
- set `template` to `qwen2_vl`
- add `"image"` to `include_type`
- append `,visual.merger.mlp.0,visual.merger.mlp.2` to `lora_target`

## English chats

For chats mainly in English, translate `default_system` and set `test_model_args.test_data_path` to `dataset/eval/test_data-en.json`.
