# FAQ

::: tip
When you encounter a problem, you can try the following methods step by step and check if the problem is resolved:
- ##### Pull the latest code and update the environment with `uv pip install --group main -e .`.
- ##### Check if the model is downloaded completely and re-run the model download command.
- ##### Issues: Check the [Issues](https://github.com/xming521/WeClone/issues) and [Discussions](https://github.com/xming521/WeClone/discussions) of the WeClone GitHub repository for similar problems.
- ##### Use [DeepWiki](https://deepwiki.com/xming521/WeClone) to talk directly to the source code.
Also, you can refer to the common questions on this page.<br>
If the problem is not resolved, please raise it in [Issues](https://github.com/xming521/WeClone/issues).
:::

### What to do if the device memory is insufficient/Out-of-memory?
- Adjust training parameters
    1. Reduce the batch size: `per_device_train_batch_size: 1`
    2. Reduce the maximum sequence length: `cutoff_len: 512`
    3. Replace model operators: `enable_liger_kernel: true` and `use_unsloth_gc: true`
    4. Use DeepSpeed ZeRO-3 or FSDP to split model weights across multiple devices or use CPU Offloading
    5. Fine-tune with a quantized model (weights cannot be merged into the original model)
    6. Set `quantization_bit: 4` to quantize model parameters (only for the LoRA method)
- You can first rent a GPU on an online cloud platform for fine-tuning, then download the fine-tuned `model_output` folder to your local machine for deployment and inference.
- For multimodal models, reduce `image_max_pixels` and `max_image_num`.
---

### What to do if the fine-tuning effect is not ideal?
- Use a model with a larger parameter scale and more chat history data for fine-tuning.
    - **7B models generally have poor results, 14B is barely acceptable, and 32B is better**.
- Use a multimodal model for fine-tuning to reduce the number of dataset cuts.
- Enable data cleaning.
---


### LLaMA-Factory fine-tuning related questions:
- [![Ask DeepWiki for more convenience](https://deepwiki.com/badge.svg)](https://deepwiki.com/hiyouga/LLaMA-Factory)
- [LLaMA-Factory| FAQs | Common Questions](https://github.com/hiyouga/LLaMA-Factory/issues/4614)

### The chat history CSV file opens with garbled characters
Do not use Excel to open it. Use an IDE such as VS Code.

### Windows Environment Issues
- Set the `"dataloader_num_workers": 0` parameter in `train_sft_args` to solve the `Can't pickle local object` problem in the Windows environment.