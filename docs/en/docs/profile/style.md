# Speaking Style

Speaking style analysis reads only the messages you sent and covers 179 style features in ten categories. The result is shown on the Style page (`#/style`) of the web UI and will also drive the agent clone.

## Run

Install the [speaking style dependencies](../deploy/environment.md#speaking-style-dependencies), then choose the clone purpose:

```bash
weclone-cli build-profile --purpose clone
```

Style extraction is the last stage of `build-profile`. It writes to the run's `style/` directory, which the Style page reads.

## What is analyzed

| Category | Examples |
|---|---|
| Lexical choice | Frequent words, modal particles, catchphrases, internet slang, abbreviations |
| Grammatical and syntactic style | Sentence length, part-of-speech mix, intensifiers |
| Orthographic and paralinguistic style | Punctuation, repeated punctuation, no punctuation at all |
| Register | Written versus chat language, how online the language is |
| Pragmatic tone and stance | Certainty, politeness and pleasantries, softening a refusal |
| Affective style | Share of emotion words, intensity, venting |
| Rhetorical devices | Metaphor, exaggeration, irony, parallelism |
| Discourse organization | Elaboration, cause, contrast |
| Interactional style | Bursts of messages, follow-up questions, how topics grow and end |
| Contextual style | Private chats versus work groups, family versus friends, day versus late night |

Some features are counted locally over all your messages. Others are judged by the model on sampled conversations, and the page says which.

## The Style page

The page groups your most distinctive traits into typing habits, word choice, emotional expression and manner of speaking, with bubble size showing how often each appears. Only traits common enough are listed. Click a trait to see:

- how often it appears, such as most of the time, often, sometimes or rarely
- common ways you write it
- how it differs with the people you chat with, with each person's numbers adjusted for message length

## Run it on its own

With an existing result directory, extract the style again with:

```bash
weclone-cli distill-style --input-dir <result-dir>/people
```

| Option | Description |
|---|---|
| `--input-dir` | Chat snapshot directory or a single file |
| `--output-dir` | New output directory, by default a new one under `dataset/res_csv/agent/distill/style/` |
| `--ltp-model` | LTP model directory, `models/LTPbase` by default |
| `--window-days` | Only chats within this many days before the latest record, 365 by default, `0` for all |
| `--llm-samples` | Conversations judged by the model, 2000 by default, `0` for all |
| `--no-llm` | Local statistics only, no model calls |
| `--limit` | Only the first N conversations, for a trial run |
