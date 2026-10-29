# Upgrading from 0.3

Version 0.4 adds the life portrait, assistant access and encrypted storage. The original fine-tuning workflow remains fully supported. The changes below affect users of 0.3.

## Configuration file

The configuration version is now `0.4.01`, and the command line warns at startup when your file doesn't match. Copy the template again and move your settings over one by one:

```bash
cp settings.jsonc settings.old.jsonc
cp settings.template.jsonc settings.jsonc
```

New sections:

| Section | Purpose |
|---|---|
| `security_args` | Storage mode, see [Security](../security/data-security.md) |
| `codex_exec_args` | Model, reasoning effort and concurrency when models are called through the Codex CLI |
| `agent_distill_args` | Model backend and windowing for portrait extraction |

Other changes:

- QLoRA settings now go in `train_sft_args.quantization`, see [Enable QLoRA](../deploy/model_finetuning.md#enable-qlora-optional-configuration).
- On older GPUs without bfloat16, set `vllm_args.dtype` instead of passing a command line flag.
- The `examples/` directory has been removed. See [Model Download](../deploy/model_download.md#multimodal-models) for multimodal settings.

Every section is described in [Configuration File](../config/weclone-config.md).

## Installation

The base install is now `uv pip install -e .`, which is enough for the life portrait and assistants. Fine-tuning still needs `uv pip install --group main -e .`, see [Installation](../deploy/environment.md).

## Server and port

`weclone-cli server` now serves the web UI and the APIs together, on port 5175 by default, without loading a model. Add `--inference` for the inference API, and keep the old port 8005 with:

```bash
weclone-cli server --inference --port 8005
```

## Chat bots need a token

Bot platforms calling `/v1` must use the token generated on the Bots page of the web UI as their API key. Any other key gets a 401. See [Server and Bot Token](../chatbot/bot-token.md).

`weclone-cli test-model` also connects to `http://127.0.0.1:8005/v1` and asks for the shared password.

## Storage mode and password

- Old configurations without `security_args` keep plaintext storage, so existing data and models work as before.
- The new template sets `"storage_mode": "encrypted"`. In encrypted mode, old plaintext training data and models can't be used. Build the training data again from the original chats and retrain.
- The web UI asks you to set a shared password first. In encrypted mode, command line jobs unlock your data with the same password.
