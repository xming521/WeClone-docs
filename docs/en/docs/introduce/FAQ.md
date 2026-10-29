# FAQ

::: tip
When you run into a problem, try the following step by step:
- ##### Pull the latest code and update the environment: `uv pip install -e .` for the life portrait, `uv pip install --group main -e .` for fine-tuning.
- ##### If you upgraded from 0.3, check your configuration against [Upgrading from 0.3](./upgrade.md).
- ##### Check the [Issues](https://github.com/xming521/WeClone/issues) and [Discussions](https://github.com/xming521/WeClone/discussions) of the WeClone repository for similar problems.
- ##### Use [DeepWiki](https://deepwiki.com/xming521/WeClone) to ask questions about the source code.

If the problem remains, open an [issue](https://github.com/xming521/WeClone/issues).
:::

## Life portrait and assistants

### `specify --max-context-tokens explicitly`
With the API backend (`agent_distill_args.llm_provider` set to `api`), WeClone can't know the model's context length. Add `--max-context-tokens <input limit>` to `build-profile`. The Codex backend asks for it too when it can't read the context length.

### "结果目录非空" (the result directory is not empty)
`--output-dir` must be a new directory. Rerun into a new one, and content already extracted is read from `dataset/res_csv/agent/llm_cache.sqlite` instead of being requested again.

### The clone purpose asks for ltp
Speaking style extraction needs the `ltp` package and the LTP model, see [Installation](../deploy/environment.md#speaking-style-dependencies). For a personal assistant only, choose `--purpose assistant`, which doesn't need them.

### The Codex backend fails
Make sure `codex` runs in your terminal and is signed in, and that `codex_exec_args.model` is a model your Codex supports. With several Codex versions installed, set `codex_exec_args.command` to the absolute path of the right one.

### Can I use English chats?
The portrait's extraction prompts are currently in Chinese, and English chats have not been tested yet.

### Assistants can't read the portrait
- Make sure `weclone-cli server` is still running.
- In encrypted mode, turn on **Allow assistants to read** on the Assistants page. Turn it on again when the time is up or after the server restarts.
- Assistants only get summaries approved on the Summaries page. After the portrait changes, the affected summaries have to be regenerated and approved.
- Regenerating the token stops the old one at once, so every assistant has to be set up again with the new command.

### I forgot my password
Run `weclone-cli server-reset-password`. The old encrypted data can't be recovered and has to be built again from the original chats in a new output directory, see [Security](../security/data-security.md#password).

## Fine-tuned clone

### Out of GPU memory
- Adjust the training parameters
    1. Reduce the batch size: `per_device_train_batch_size: 1`
    2. Reduce the maximum sequence length: `cutoff_len: 512`
    3. Replace model operators: `enable_liger_kernel: true` and `use_unsloth_gc: true`
    4. Use DeepSpeed ZeRO-3 or FSDP to split model weights across devices, or CPU offloading (encrypted mode doesn't support distributed training yet)
    5. Fine-tune a quantized model (the weights can't be merged into the original model)
    6. Set `quantization_bit: 4` under `train_sft_args.quantization` to use QLoRA (LoRA only), see [Enable QLoRA](../deploy/model_finetuning.md#enable-qlora-optional-configuration)
- Rent a cloud GPU for fine-tuning, then download the `model_output` folder and run inference locally.
- For multimodal models, reduce `image_max_pixels` and `max_image_num`.

### The fine-tuned clone doesn't sound like me
- Adjust fine-tuning parameters such as `lora_rank` and `lora_dropout`.
- Use a larger model and more chat data.
    - **7B models give average results, 14B is acceptable and 32B is better**.
- Fine-tune a multimodal model so fewer conversations are cut.
- Enable data cleaning.

### "安全模式不能加载旧明文个人模型或 adapter" (encrypted mode can't load an old plaintext model)
Encrypted mode only loads models saved encrypted. After switching from plaintext mode, build the training data again and retrain.

### LLaMA-Factory questions
- [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/hiyouga/LLaMA-Factory)
- [LLaMA-Factory | FAQs](https://github.com/hiyouga/LLaMA-Factory/issues/4614)

### Windows
- Set `"dataloader_num_workers": 0` in `train_sft_args` to avoid `Can't pickle local object` on Windows.

## Chat bots

### Bot requests return 401
The API key must be the token generated on the Bots page of the web UI. Regenerating or revoking it stops the old token at once, and a password reset requires a new token too.

### Bot requests return 403
The `/v1` API refuses requests that carry an `Origin` header, which browsers send. Call it from the bot platform's server.

### A bot platform in Docker can't reach the server
The server listens only on 127.0.0.1 by default. On Linux, start it with `--host 172.17.0.1` and use `http://172.17.0.1:8005/v1` on the platform. On Docker Desktop (macOS, Windows), use `http://host.docker.internal:8005/v1` on the platform. See [Server and Bot Token](../chatbot/bot-token.md).

## Data

### The chat CSV file shows garbled characters
Don't open it in Excel. Use an editor such as VS Code. In encrypted mode, export `.enc` files to plaintext with `weclone-cli decrypt` first.
