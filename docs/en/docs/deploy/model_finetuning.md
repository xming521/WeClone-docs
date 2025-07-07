# Fine-tuning the Model


## Single-Card Training


```bash
weclone-cli train-sft
```

> For single-card training in a multi-card environment, you first need to run `export CUDA_VISIBLE_DEVICES=0`

The training script will read the configuration from `settings.jsonc` and start fine-tuning. Pay attention to the terminal output to see if the loss is decreasing normally.

## Multi-Card Training

If you have multiple NVIDIA GPUs and want to perform multi-card training:

1. **Install Deepspeed:**

   ```bash
   uv pip install deepspeed
   ```

2. **Configure Deepspeed** <br>
   In `settings.jsonc`, find the `deepspeed` configuration item and uncomment it or fill in the path to the Deepspeed JSON configuration file as needed.

3. **Start multi-card training:**

   ```bash
   deepspeed --num_gpus=<number_of_gpus_to_use> weclone/train/train_sft.py
   ```


After the training is complete, the fine-tuned LoRA adapter weights will be saved in the `output_dir` you specified in `settings.jsonc`.



## **Enable QLoRA (Optional Configuration)**

If you want to further reduce video memory consumption, you can enable **QLoRA quantized training**.

> [!Warning]
> 
> The weights fine-tuned using the quantized model cannot be merged back into the original model.

Add the following configuration to the `common_args` field in `settings.jsonc`:

```json
"quantization_bit": 4,
"quantization_type": "nf4",
"double_quantization": true,
"quantization_method": "bitsandbytes"
```

> [!NOTE]
>
> - `quantization_bit` supports values: 2 / 4 / 8. The lower the value, the more video memory is saved, but the inference speed and effect may be slightly reduced.
>
> - If you encounter the error `ImportError: Please install bitsandbytes>=0.45.3`, you can try reinstalling `bitsandbytes`:
>
>   ```bash
>   uv pip install bitsandbytes>=0.39.0
>   ```