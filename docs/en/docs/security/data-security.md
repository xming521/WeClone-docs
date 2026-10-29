# Security

## What leaves your machine

| Feature | What is sent | Sent to |
|---|---|---|
| Building the portrait | Chat content and portrait entries during extraction, organization and summaries | The model service you configured (Codex or API). You are told and asked to confirm first. Content already extracted is read from a local cache and not sent again |
| Assistants | The summaries and entries assistants read | The model service behind the assistant. At the **All** level, private and sensitive entries are included |
| Copying the export text | The summaries and entries you copy | Wherever you paste them |
| Fine-tuned clone | Training and inference run on your machine | With online LLM data cleaning (`online_llm_clear`) or image-to-text (`vision_api`) on, the related content goes to the configured API |

## Storage mode

In `settings.jsonc`:

```json
"security_args": {
    "storage_mode": "encrypted"
}
```

| Setting | Description |
|---|---|
| `storage_mode` | `encrypted`: the template default. Chat data and everything derived from it is stored encrypted, in files ending in `.enc`. `plaintext`: stored as plain files. Old configurations without `security_args` use plaintext |
| `state_dir` | Directory for keys and token records, `.weclone` by default |
| `runtime_dir` | In encrypted mode, steps that need plain files, such as training and inference, put decrypted temporary files here and delete them afterwards. Defaults to the system temporary directory |

Encryption covers the chat snapshot, the portrait, review records, training data and fine-tuned models. Encrypted mode doesn't support distributed training yet.

The storage mode is fixed after the first initialization. Switching modes means building all data again from the original chats in a new output directory, and encrypted mode can't load old plaintext models. Original chats and plaintext files you export by hand are not managed by WeClone, so keep them safe yourself.

## Password

One password signs you in to the web UI and unlocks encrypted data. Set it the first time you open the web UI or run a job, or run `weclone-cli security-init` beforehand to fix the storage mode from `settings.jsonc` and set the password. The password is never stored in plain text and can't be put in the configuration file.

```bash
weclone-cli security-init                                       # fix the storage mode and set the password
weclone-cli security-change-password                            # change it with the old password, data kept
weclone-cli server-reset-password                               # reset a forgotten password
weclone-cli decrypt --input <encrypted-file> --output <new-plain-file>  # export plaintext
```

- After a password change, existing data is kept and old web sessions end.
- A forgotten password can't recover old encrypted data. After a reset the old files remain, but data has to be built again from the original chats in a new output directory, and the bot token has to be generated again.
- Web sessions last 2 hours.

## Keys and tokens

The `.weclone/` directory holds the data key encrypted with your password (`manifest.json`) and the token records for assistants and bots (`assistant.sqlite3`, `bots.sqlite3`). Encrypted data can't be read without it, so keep and back it up.

- Both tokens are stored only as hashes and shown once when generated. If you lose one, generate a new one.
- In encrypted mode, the assistant token only works during the time you allow, see [Connect AI Assistants](../profile/assistant.md#keep-the-server-running).
- In encrypted mode the bot token is stored with the data key: the key is encrypted with the token and kept in `bots.sqlite3`, and bot requests open it with the token, so nobody has to be signed in. The token together with that file decrypts all data, so keep it as safe as the password. It survives a password change and has to be generated again after a reset.
- `/v1` and `/mcp` refuse requests with an `Origin` header, so web pages can't use a token even if they learn it.

## Server address

`weclone-cli server` listens only on 127.0.0.1 by default. With `--host 172.17.0.1` for bot platforms in Docker on Linux, other programs on that network can reach the port too. Do this only on a machine you trust, and don't expose it directly to the internet.

## Request logs

Requests WeClone sends to model services are logged in `logs/llm_audit/`. Encrypted mode logs metadata only, plaintext mode logs full requests and replies. Every assistant call over MCP is recorded in the review database.
