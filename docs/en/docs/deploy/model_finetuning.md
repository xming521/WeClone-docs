# Fine-tuning the Model

Complete [Data Preprocessing](data_preprocessing.md) first.

## Training parameters

- Adjust `per_device_train_batch_size` and `gradient_accumulation_steps` to fit your VRAM.
- Tune `num_train_epochs`, `lora_rank`, `lora_dropout` and other settings in `train_sft_args` to the amount and quality of your data.
- `train_sft_args` accepts every LLaMA Factory argument, see [Arguments - LLaMA Factory](https://llamafactory.readthedocs.io/en/latest/advanced/arguments.html).

## Single-GPU training

```bash
weclone-cli train-sft
```

> To train on one GPU of a multi-GPU machine, run `export CUDA_VISIBLE_DEVICES=0` first.

The training script reads `settings.jsonc` and starts fine-tuning. Watch the terminal output to check that the loss goes down.

When training finishes, the LoRA adapter weights are saved in `common_args.adapter_name_or_path` (`./model_output` by default), which is also the training output directory. In encrypted mode the weights are stored encrypted.

## Multi-GPU training

With several NVIDIA GPUs:

1. **Install DeepSpeed:**

   ```bash
   uv pip install "deepspeed<=0.16.9"
   ```

2. **Configure DeepSpeed:** uncomment the `"deepspeed": "ds_config.json"` line in `settings.jsonc`, or point it to your own DeepSpeed configuration file.

3. **Start multi-GPU training:**

   ```bash
   deepspeed --num_gpus=<number_of_gpus> weclone/train/train_sft.py
   ```

> [!WARNING]
> Encrypted mode doesn't support distributed training yet.

## Enable QLoRA (Optional Configuration)

To save more VRAM, enable **QLoRA quantized training**.

> [!Warning]
>
> After fine-tuning a quantized model, the weights can't be merged into the original model.

Add `quantization` to `train_sft_args` in `settings.jsonc`:

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
> - `quantization_bit` accepts 2, 4 or 8. Lower values save more VRAM but may slow inference and lower quality slightly.
> - Inference (`webchat-demo`, `server --inference`) uses the same quantization settings.
> - If you see `ImportError: Please install bitsandbytes>=0.45.3`, reinstall `bitsandbytes`:
>
>   ```bash
>   uv pip install "bitsandbytes>=0.45.3"
>   ```
