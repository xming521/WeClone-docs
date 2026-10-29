# Data Preprocessing

This page builds the training data for the fine-tuned clone. The life portrait doesn't read it and extracts from the original chats instead.

- Prepare your chats as described in [Preparing Data](export-chat-history.md), and set `platform`, `language` and `include_type` in `make_dataset_args`.
- Install the [fine-tuning dependencies](environment.md#fine-tuning-dependencies) first, including the spaCy model used for privacy filtering.

## Privacy filtering

While the training data is built, WeClone filters personal information with Microsoft Presidio:

* **Default filtering:** removes phone numbers, email addresses, credit card numbers (12–19 digits), IP addresses, location names, IBANs, crypto wallet addresses, age information and generic ID numbers, though 100% detection is not guaranteed.
* **Custom filtering:** add words to `blocked_words`. Whole sentences containing a blocked word are left out of the training data.

## Execute the preprocessing script

Activate the virtual environment and run from the WeClone project root:

```bash
weclone-cli make-dataset
```

The training data is written to `train_sft_args.dataset_dir` (`./dataset/res_csv/sft` by default), encrypted in encrypted mode.

## Related Parameters

📌 **Chat habits** <br>
A time window strategy is used: one person's consecutive messages within `single_combine_time_window` minutes are combined into one, joined by line breaks, and messages within `qa_match_time_window` minutes form a Q&A pair. Adjust both to how quickly you reply. `combine_msg_max_length` and `messages_max_length` limit the length of a combined message and of a Q&A pair, and work together with `cutoff_len`.

📌 **Time and relationship** <br>
With `add_time` set to `true`, the message time is appended to the system prompt of each training sample. With `add_relation` set to `true`, the `relation` from the chat folder's `users.json` is appended, see [Generic CSV format](export-chat-history.md#users-json). If you turn these on, fill in the system prompt the same way when you deploy.

📌 **Training multimodal models** <br>
Add `"image"` to `include_type`, and limit image size and count with `common_args.image_max_pixels` and `max_image_num` to save VRAM. See [Multimodal models](model_download.md#multimodal-models) for the model and template settings.

📌 **Image to text** <br>
Add `"image"` to `include_type`, set `vision_api.enable` to `true` and fill in `api_key`, `api_url` and `model_name`. An external multimodal model turns images into text, and the dataset **is still used to train a text-only model**. Images are sent to the configured API.

📌 **Data cleaning** <br>
Set `clean_dataset.enable_clean` to `true` to have an LLM score each Q&A pair. Pairs below `accept_score` (1 is worst, 5 is best) are left out of training. Multimodal data is not supported yet.

- By default a local model scores the data through vLLM offline inference, which runs on Linux only.
- Set `online_llm_clear` to `true` to score through an API instead, and fill in `base_url`, `llm_api_key` and `model_name`. Any OpenAI-compatible model works. Chat content is sent to that API. `clean_batch_size` sets how many pairs are scored per batch.

## 💡 Notes on using vLLM

With vLLM offline inference and limited VRAM, enable vLLM's `bitsandbytes` quantized loading, or this step may run out of memory too. See the [vLLM engine arguments](https://docs.vllm.ai/en/v0.10.0/configuration/engine_args.html) for further tuning.

```json
"vllm_args": {
    "gpu_memory_utilization": 0.9,
    "quantization": "bitsandbytes", // enable bitsandbytes quantized loading
    "load_format": "bitsandbytes"
},
```

>[!TIP]
> If you see `ImportError: Please install bitsandbytes>=0.45.3`, reinstall `bitsandbytes`:
> ```bash
> uv pip install "bitsandbytes>=0.45.3"
> ```

NVIDIA GPUs with compute capability below 8.0 (such as Tesla T4, V100 and GTX 10xx/20xx) don't support bfloat16 and may show:

```bash
ValueError: Bfloat16 is only supported on GPUs with compute capability of at least 8.0.
```

Set `dtype` in `vllm_args` and run again:

```json
"vllm_args": {
    "dtype": "float16",
    ...
},
```
