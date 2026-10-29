# Server and Bot Token

Chat bot platforms call the [fine-tuned clone](../deploy/model_finetuning.md) through the OpenAI-compatible API under `/v1`.

| Platform | Deployment Support |
|----------|--------------------|
| Telegram | ✅ |
| WhatsApp | 🚧 |
| WeChat (Personal Account) | ✅ (Based on **openclaw-weixin**) |
| Discord | ✅ |
| Slack | ✅ |

## Start the server

```bash
weclone-cli server --inference --port 8005
```

- `--inference` loads the clone model. Without it, bots can't call the clone.
- The server listens only on 127.0.0.1 by default. If the bot platform runs in Docker on Linux, add `--host 172.17.0.1` (the host's address on the Docker network) so the container can reach the server, and use `http://172.17.0.1:8005/v1` as the address on the platform.
- If the bot platform runs on Docker Desktop (macOS, Windows), keep the default address and use `http://host.docker.internal:8005/v1` on the platform.

## Generate the token

Open the Bots page (`#/bots`) in the web UI and click **Create token**. The token is shown only this once, together with the API base URL and API key:

| Platform setting | Value |
|---|---|
| Provider type | OpenAI |
| API base URL | `http://127.0.0.1:8005/v1`. In Docker on Linux, `http://172.17.0.1:8005/v1`. On Docker Desktop, `http://host.docker.internal:8005/v1` |
| API key | The generated token |
| Model name | Anything, for example `gpt-3.5-turbo` |

- All bots share this one token, and it keeps working across server restarts. **Regenerate** or **Revoke** stops the old token at once.
- In encrypted mode the data key is encrypted with the token and stored on this machine in `.weclone/bots.sqlite3`. Bot requests open it with the token, so nobody has to be signed in.
- The token together with `bots.sqlite3` decrypts all data, so keep the token as safe as the password. A password change doesn't affect it, and a password reset requires a new one.
- `/v1` refuses requests with an `Origin` header, so web pages can't use the token.

## Common platform settings

- The fine-tuned model doesn't call tools. Turn off tools and plugins on the platform, or you won't see the fine-tuning effect.
- The system prompt must match `default_system` in `settings.jsonc` used for fine-tuning exactly.
- Check the server log to keep the request parameters the platform sends close to those used in fine-tuning and testing.

See [AstrBot](./AstrBot.md), [LangBot](./LangBot.md) and [Dify](./Dify.md) for platform steps.
