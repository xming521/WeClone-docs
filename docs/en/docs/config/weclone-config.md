# Configuration File (`settings.jsonc`)

WeClone reads `settings.jsonc` in the project root by default. Start from a copy of `settings.template.jsonc`:

```bash
cp settings.template.jsonc settings.jsonc
```

To use another file, run `weclone-cli --config-path <path> <command>` or set the `WECLONE_CONFIG_PATH` environment variable. The file may contain comments. If `version` differs from the config version the project expects, WeClone prints a warning at startup. Update your config against the template in that case, and see [Upgrading from 0.3](../introduce/upgrade.md) for older versions.

Only the common settings are listed below. Defaults in the tables are the template values.

## security_args

How data is stored. See [Security](../security/data-security.md#storage-mode).

| Setting | Default | Description |
|---|---|---|
| `storage_mode` | `"encrypted"` | `encrypted` stores chat data and derived files encrypted, `plaintext` stores them as plain files. Fixed after first initialization. Changing it means processing all data again. Treated as `plaintext` when missing |
| `state_dir` | `".weclone"` | Directory for keys, tokens and assistant settings |
| `runtime_dir` | System temp directory | Where decrypted temporary files go in encrypted mode |

## common_args

Settings shared across features, mainly for fine-tuning and inference.

| Setting | Default | Description |
|---|---|---|
| `model_name_or_path` | `"./models/Qwen2.5-7B-Instruct"` | Base model path. See [Model Download](../deploy/model_download.md) |
| `adapter_name_or_path` | `"./model_output"` | LoRA weights directory. Training writes to it and inference loads from it |
| `template` | `"qwen"` | LLaMA Factory chat template. Must match the model |
| `default_system` | `"请你扮演一名人类，不要说自己是人工智能"` | System prompt for training and inference. The system prompt on chat bot platforms must match it exactly |
| `media_dir` | `"dataset/media"` | Directory for images and other media |
| `image_max_pixels` | `409920` | Maximum image pixels in multimodal training. 409920 is about 720P |
| `finetuning_type` | `"lora"` | Fine-tuning method. Only LoRA is supported |
| `enable_thinking` | `false` | Whether to enable the model's thinking mode |
| `trust_remote_code` | `true` | Whether to trust code in the model repository when loading |

## cli_args

| Setting | Default | Description |
|---|---|---|
| `log_level` | `"INFO"` | Terminal log level: `DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`. `logs/weclone.log` always records `DEBUG` and above |
| `full_log` | `false` | Also write the terminal output of third-party libraries to `logs/weclone.log`. Plaintext mode only |

## codex_exec_args

Settings for the Codex CLI backend, used by [Build Your Portrait](../profile/build-profile.md) and [Speaking Style](../profile/style.md).

| Setting | Default | Description |
|---|---|---|
| `model` | `"gpt-6.1-sol"` | Model to use. Pick one at least as capable as gpt-6-sol medium |
| `effort` | `"medium"` | Reasoning effort |
| `batch_size` | `30` | Concurrent requests |
| `request_interval_seconds` | `0.5` | Interval between request launches (seconds) |
| `capacity_cooldown_seconds` | `20.0` | Pause before new requests when the model is busy or rate-limited (seconds) |
| `timeout` | `300` | Timeout per request (seconds) |
| `command` | `"codex"` | Codex executable. With several versions installed, give the absolute path of one that supports the model |
| `sandbox` | `"read-only"` | Codex sandbox mode |

## agent_distill_args

Settings for building the life portrait. See [Build Your Portrait](../profile/build-profile.md#request-settings).

| Setting | Default | Description |
|---|---|---|
| `llm_provider` | `"codex_exec"` | Model backend. `codex_exec` reads `codex_exec_args`. `api` uses `base_url`, `llm_api_key` and `model_name` in `make_dataset_args`. See [Model backend](../deploy/environment.md#model-backend) |
| `batch_size` | `10` | Concurrent requests for the API backend |
| `timeout` | `120` | Timeout per request for the API backend (seconds) |
| `max_tokens` | No limit | Output limit per request for the API backend |
| `max_samples_per_window` | `8` | Short conversation segments are combined into one request. This is the most segments per request |
| `max_content_chars` | `400` | Most message characters per request, not counting IDs, times and role labels. Longer segments get a request of their own |

Extraction and organizing results are cached by input in `dataset/res_csv/agent/llm_cache.sqlite`, so reruns only request what is missing. Delete the file to request everything again.

## harness_args

Settings for the model-driven clone. This feature is in development. No changes are needed for now.

## make_dataset_args

Settings for data processing and the fine-tuning dataset. See [Data Preprocessing](../deploy/data_preprocessing.md) for `make-dataset`.

| Setting | Default | Description |
|---|---|---|
| `platform` | `"chat"` | Data source: `chat` (generic CSV) or `telegram`. See [Preparing Data](../deploy/export-chat-history.md) |
| `language` | `"zh"` | Main chat language, `zh` or `en`. Selects the recognizer used for privacy filtering |
| `telegram_args.my_id` | `"user1234567890"` | Required for Telegram data: your own ID, the `from_id` of messages you sent in `result.json` |
| `include_type` | `["text"]` | Message types in the training data. Add `"image"` to train a multimodal model |
| `max_image_num` | `2` | Most images per training example |
| `blocked_words` | Example values | Blocked words. Messages containing one are left out of the training data. Words in `dataset/blocked_words.json` are used too |
| `add_time` | `false` | Add message times to the training data |
| `add_relation` | `false` | Add your relationship with the other person to the training data, taken from [users.json](../deploy/export-chat-history.md#users-json) |
| `single_combine_time_window` | `2` | Consecutive messages from one person within this many minutes are combined into one |
| `qa_match_time_window` | `5` | The other person's message and your reply within this many minutes form a QA pair |
| `combine_msg_max_length` | `2048` | Maximum length of a combined message. Used with `cutoff_len` |
| `messages_max_length` | `2048` | Maximum characters per training example. Used with `cutoff_len` |
| `prompt_with_history` | `false` | Whether to include conversation history in the prompt. Has no effect on multimodal data |
| `clean_dataset` | Off | Score training data with an LLM and filter it. See [Data Preprocessing](../deploy/data_preprocessing.md#related-parameters) |
| `online_llm_clear` | `false` | Clean with an online API instead of local vLLM |
| `base_url`, `llm_api_key`, `model_name` | Example values | Address, key and model name of an OpenAI-compatible API. Used by online cleaning and by the API backend of the life portrait |
| `clean_batch_size` | `50` | Batch size for online cleaning |
| `vision_api` | Off | Turn images into text descriptions with a multimodal API. See [Data Preprocessing](../deploy/data_preprocessing.md#related-parameters) |

## train_sft_args

Fine-tuning parameters. See [Model Fine-tuning](../deploy/model_finetuning.md). Any LLaMA Factory parameter can go here, see [LLaMA Factory arguments](https://llamafactory.readthedocs.io/en/latest/advanced/arguments.html). WeClone adds these:

| Setting | Description |
|---|---|
| `quantization` | QLoRA settings, also used for inference. See [Enable QLoRA](../deploy/model_finetuning.md#enable-qlora-optional-configuration) |
| `resume_adapter_name_or_path` | Continue training from existing LoRA weights. Output still goes to `common_args.adapter_name_or_path` |
| `deepspeed` | DeepSpeed config file for multi-GPU training, such as `"ds_config.json"` |

## infer_args

Sampling parameters for inference, used by the web demo, the API server and testing.

| Setting | Default | Description |
|---|---|---|
| `repetition_penalty` | `1.2` | Repetition penalty |
| `temperature` | `0.5` | Temperature |
| `max_length` | `256` | Maximum generation length |
| `top_p` | `0.65` | Top-p sampling |

## vllm_args

vLLM parameters for offline data cleaning. See [Notes on using vLLM](../deploy/data_preprocessing.md#💡-notes-on-using-vllm).

| Setting | Default | Description |
|---|---|---|
| `gpu_memory_utilization` | `0.9` | Share of GPU memory vLLM may use |
| `dtype` | Auto | Compute precision. Use `"float16"` on GPUs without bfloat16 support, such as Tesla T4 and V100 |
| `quantization`, `load_format` | Not set | Quantized loading, such as `"bitsandbytes"` |

## test_model_args

| Setting | Default | Description |
|---|---|---|
| `test_data_path` | `"dataset/eval/test_data-zh.json"` | Test questions for `test-model`. See [Model Inference and Testing](../deploy/model_inference.md#testing-with-common-chat-questions) |

## embedding_service_args

Used by features in development. No changes are needed for now.
