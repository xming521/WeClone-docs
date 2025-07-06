# Model Download

WeClone uses the Qwen2.5-VL-7B model by default, but you can choose other models you want to use (thinking models are not recommended).

::: tip
7B models generally have poor results (although some feedback suggests they can be acceptable, which may be related to the data), 14B is barely acceptable, and 32B is better.
:::

If you have chosen another model or downloaded the model to a different directory, please modify it in `settings.jsonc`:

```json
"common_args": {
    "model_name_or_path": "your_model_path",
    "template": "your_model_template",
    ...
},
"train_sft_args": {
    "lora_target": "module_names_of_the_model_to_be_fine-tuned", // e.g., "q_proj", "k_proj", "v_proj", "o_proj"
    ...
},
```

## Method 1: Download using the `Hugging Face` command-line tool

```bash
huggingface-cli download Qwen/Qwen2.5-7B-Instruct --local-dir ./models/Qwen2.5-7B-Instruct --local-dir-use-symlinks False
```
> ⚠️ The model file is large, and the download may take a long time. Please ensure you have sufficient disk space (at least 20GB is recommended).<br>
The download process is long, and the connection may be interrupted. You can resume with an incremental download.


## Method 2: Install using `Git`

```bash
git lfs install
git clone https://huggingface.co/Qwen/Qwen2.5-VL-7B-Instruct models/Qwen2.5-VL-7B-Instruct
```