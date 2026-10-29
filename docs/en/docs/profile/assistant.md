# Connect AI Assistants

Claude Code, Codex and other assistants with MCP support can read your life portrait and use it as long-term memory. You set in the web UI which domains they can read and up to which privacy level.

## Before you start

1. [Build your portrait](./build-profile.md) and open the web UI with `weclone-cli server`.
2. Approve the [summaries](./summary.md) you want to share on the Summaries page. Assistants only get approved summaries.

## Choose what to share

On the Assistants page (`#/assistant`), choose the privacy level and the domains:

| Privacy level | Entries assistants can read |
|---|---|
| All | Every entry, private and sensitive ones included |
| Normal | Public and normal entries |
| Public | Public entries only |

- All domains are shared by default, including domains that appear later. Unchecked domains share neither their summary nor their entries. When only some domains are shared, new or renamed domains aren't.
- Changes to the level and domains apply from the assistant's next call, without setting it up again.
- These choices and the token are kept in `.weclone/`, so they outlive portrait rebuilds.

> [!WARNING]
> At the **All** level, private and sensitive entries also go to the cloud model behind the assistant.

## Create the token and set up assistants

Click **Create token**. The token is shown only this once, together with the setup command for each assistant. Run it on the machine where the assistant runs, and its new sessions can call WeClone.

Claude Code:

```bash
claude mcp add -s user --transport http weclone http://127.0.0.1:5175/mcp --header "Authorization: Bearer <token>"
```

Codex: add to `~/.codex/config.toml`

```toml
[mcp_servers.weclone]
url = "http://127.0.0.1:5175/mcp"
http_headers = { Authorization = "Bearer <token>" }
```

Other MCP clients: use the address `http://127.0.0.1:5175/mcp` and add the header `Authorization: Bearer <token>`.

All assistants share this one token. **Regenerate** stops the old token at once, and every assistant has to be set up again with the new command. **Revoke** cuts off all assistants.

## Tools

| Tool | Returns |
|---|---|
| `weclone_profile` | Approved domain summaries for the chosen level and domains, each marked with its domain ID |
| `weclone_search` | Portrait entries found by keyword or domain ID, up to 50. Includes entries pending review and excludes rejected ones |

WeClone tells assistants that the portrait may be wrong or out of date, that what they find is for reference, and that they should check with you before important decisions.

## Keep the server running

Keep `weclone-cli server` running while assistants use it.

- In encrypted mode, assistants can read only during the time you allow. Under **Allow assistants to read**, choose 1 hour, 8 hours, 24 hours or 7 days. Meanwhile the server keeps a key in memory, cleared when the time is up or the server restarts, and you turn it on again. **Close now** ends it early.
- In plaintext mode, assistants can read whenever the token is valid.

Every call is recorded in the review database with the calling client, the tool, its arguments and what it returned.

## Assistants without MCP

Copy the export text on the Summaries page and paste it into the assistant's "About me", custom instructions or USER.md, see [Domain Summaries](./summary.md#copy-for-assistants-without-mcp).
