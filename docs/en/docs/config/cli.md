# Command Line

Run every command from the project root:

```bash
weclone-cli [--config-path <config file>] <command> [options]
```

`--config-path` selects the configuration file. The default is `./settings.jsonc`, and the `WECLONE_CONFIG_PATH` environment variable works too. Add `--help` to any command to see its options.

## Life portrait

| Command | Description |
|---|---|
| `build-profile` | Runs data preparation, memory extraction, organizing and portrait generation on your chats, plus speaking style for a clone. See [Build Your Portrait](../profile/build-profile.md) |
| `organize-memories` | Runs domain induction, classification, topic grouping and summaries on their own, for debugging or reruns |
| `distill-style` | Extracts speaking style on its own. See [Speaking Style](../profile/style.md#run-it-on-its-own) |

`build-profile` options:

| Option | Description |
|---|---|
| `--purpose assistant\|clone` | `assistant` extracts the portrait and events for personal assistants. `clone` also extracts speaking style for a clone. Asked interactively when omitted |
| `--output-dir <dir>` | Result directory, which must be new. Defaults to a new timestamped directory under `dataset/res_csv/agent/profile_runs` |
| `--max-context-tokens <n>` | Input token limit for organizing and portrait generation. Read from Codex by default. Required for the API backend |

## Web UI and server

| Command | Description |
|---|---|
| `server` | Starts the web UI and API server |

| Option | Default | Description |
|---|---|---|
| `--host` | `127.0.0.1` | Listen address. See [Security](../security/data-security.md#server-address) |
| `--port` | `5175` | Port |
| `--run <dir>` | Newest result | `build-profile` result directory to open |
| `--inference` | Off | Loads the fine-tuned model and enables the `/v1` inference API for [chat bots](../chatbot/bot-token.md) |

See [Review in the Web UI](../profile/review.md) for the web UI and [Connect AI Assistants](../profile/assistant.md) for assistants.

## Password and encryption

For encrypted mode. See [Security](../security/data-security.md#password).

| Command | Description |
|---|---|
| `security-init` | Fixes the storage mode from `settings.jsonc` and sets the password shared by the web UI and file access |
| `security-change-password` | Changes the password using the old one. Existing encrypted data is kept |
| `server-reset-password` | Sets a new password when you forgot the old one. Old encrypted files can no longer be read, and all data must be generated again from the original chats |
| `decrypt --input <encrypted file> --output <plain file>` | Asks for the password and exports an encrypted file to a new plain file |

## Fine-tuned clone

| Command | Description |
|---|---|
| `make-dataset` | Turns chat history into a fine-tuning dataset. See [Data Preprocessing](../deploy/data_preprocessing.md) |
| `train-sft` | Fine-tunes the model. See [Model Fine-tuning](../deploy/model_finetuning.md) |
| `webchat-demo` | Chat with the fine-tuned model in the browser. Plaintext mode only. See [Model Inference and Testing](../deploy/model_inference.md) |
| `test-model` | Tests the model with common chat questions. Needs a server started with `--inference`. See [Model Inference and Testing](../deploy/model_inference.md#testing-with-common-chat-questions) |

## Other

| Command | Description |
|---|---|
| `version` | Shows the WeClone version |
| `dev` | Starts the backend and frontend development servers together, for web UI development |
