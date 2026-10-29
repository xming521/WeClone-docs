# Build Your Portrait

The life portrait gathers your identity, goals, circumstances, preferences and plans from your chat history, organized into domains such as work, family and health and into topics within them. Every fact traces back to the original chat. This route needs no GPU, since extraction runs on the API model you configure.

First complete [installation](../deploy/environment.md), the [model backend](../deploy/environment.md#model-backend) and [data preparation](../deploy/export-chat-history.md).

## Run

From the project root:

```bash
weclone-cli build-profile
```

Choose the purpose when asked, or pass it directly:

- `--purpose assistant`: for a personal assistant. Extracts the portrait and events.
- `--purpose clone`: for a clone. Also extracts your speaking style and needs the [speaking style dependencies](../deploy/environment.md#speaking-style-dependencies).

Before it starts, the command line shows the result directory, what will be extracted and the model backend, and asks you to confirm. After you confirm, chat content is sent to that model service.

| Option | Description |
|---|---|
| `--purpose assistant\|clone` | The purpose. Asked interactively when omitted |
| `--output-dir <dir>` | Result directory, which must be new. Defaults to a new timestamped directory under `dataset/res_csv/agent/profile_runs/` |
| `--max-context-tokens <limit>` | Input token limit for memory organization and the hierarchy. The Codex backend reads the model's context length by default. The API backend requires it |

## Stages

| Stage | What happens |
|---|---|
| 1. Prepare chat data | Text messages are grouped by contact and cut into conversations, written to `people/` |
| 2. Extract memories | Profile memories and event memories are extracted from each conversation, written to `distill/` |
| 3. Organize memories | Domains are induced, memories are classified, grouped into topics and summarized, and every fact gets a privacy level and a time scope, written to `memory_organization/` |
| 4. Build the hierarchy | The portrait shown and reviewed in the web UI, written to `profile_hierarchy/` |
| 5. Domain summaries | One summary per domain, see [Domain Summaries](./summary.md) |
| 6. Speaking style | `--purpose clone` only, written to `style/`, see [Speaking Style](./style.md) |

While chat data is prepared, one sender's messages less than two minutes apart become one message, and a silence of more than ten minutes starts a new conversation. Very short conversations are skipped to save model calls.

## What the portrait holds

Each fact belongs to a dimension and carries:

| Field | Description |
|---|---|
| Dimension | Demographics and identity, needs motives and goals, resources and constraints, key plans and commitments, interests and preferences |
| Domain and topic | Induced by the model from your chats, such as work, family and health |
| Privacy level | Public, normal, private or sensitive. Decides what assistants can be given |
| Time scope | Long-term, current, outdated, or an event at a given time |
| Sources | The conversations backing the fact, viewable in the web UI |
| Confidence and importance | Averages of the source scores |

No fact is dropped for privacy during extraction. Every fact is kept with a privacy level, and you decide who gets what when you [review](./review.md) and [connect assistants](./assistant.md).

## Cache and reruns

Model answers are cached by input content in `dataset/res_csv/agent/llm_cache.sqlite`. If a run fails partway, rerun it into a new result directory and only the missing parts are requested. Delete the file to request everything again.

Contact numbers are kept in `dataset/res_csv/agent/contacts.json`, which only grows. A contact keeps its number across new exports and reruns.

## Result directory

```
dataset/res_csv/agent/profile_runs/<time>/
├── people/                # chat snapshot
├── distill/               # extracted profile and event memories
├── memory_organization/   # memories with domains, classes and summaries
├── profile_hierarchy/     # the portrait and your review in the web UI
└── style/                 # speaking style (--purpose clone only)
```

In encrypted mode these files end in `.enc`. When the run is done, open the web UI with `weclone-cli server` to [review the portrait](./review.md).

## Running a single stage

For debugging or catching up, run a stage on its own:

```bash
weclone-cli organize-memories --help                    # domains, classes, topics and summaries
weclone-cli distill-style --input-dir <result-dir>/people  # speaking style
```

## Request settings

| Setting | Description |
|---|---|
| `codex_exec_args.model`, `effort` | Model and reasoning effort for the Codex backend |
| `codex_exec_args.batch_size` | Concurrent requests for the Codex backend |
| `codex_exec_args.request_interval_seconds`, `capacity_cooldown_seconds` | Interval between requests, and the wait when the model is busy |
| `agent_distill_args.batch_size`, `timeout`, `max_tokens` | Concurrency, timeout and output limit for the API backend |
| `agent_distill_args.max_samples_per_window`, `max_content_chars` | Short conversations are packed into one request, up to this many conversations and this many characters of content. Longer conversations go in a request of their own |

Every request to a model service is logged in `logs/llm_audit/`, see [Security](../security/data-security.md#request-logs).
