# Review in the Web UI

## Open the web UI

```bash
weclone-cli server                    # serve the newest run
weclone-cli server --run <result-dir> # serve a specific run
```

Open http://127.0.0.1:5175 in your browser. At startup the server picks the newest complete run under `dataset/res_csv/agent/profile_runs/` and skips unfinished ones.

- Set the shared password the first time, then sign in with it, see [Security](../security/data-security.md#password). You stay signed in for 2 hours. Use it on your own device.
- The server listens only on this machine by default. `--host` and `--port` change the address and port, and the port can also be set with the `API_PORT` environment variable.
- The web UI follows your browser's language, English or Chinese. The 中/EN switch in the top bar changes it.

| Page | Purpose |
|---|---|
| Portrait (`#/`) | Browse the portrait by domain and topic and review it entry by entry |
| Style (`#/style`) | View the [speaking style](./style.md) extracted with `--purpose clone` |
| Summaries (`#/summary`) | Generate and approve [domain summaries](./summary.md) |
| Assistants (`#/assistant`) | Choose what assistants can read and generate their token, see [Connect AI Assistants](./assistant.md) |
| Bots (`#/bots`) | Generate the token chat bots call the clone with, see [Server and Bot Token](../chatbot/bot-token.md) |

## Browse the portrait

The portrait is shown as a map. Hover to light up a path, click to expand and focus, click again to collapse, and drag a node to pull the map. The search box at the top finds topics, attributes and content.

The left panel groups the portrait by **Dimension** or by **Domain**, and your browser remembers the choice. In the domain view, a topic's attributes from different dimensions are merged, and each review card names its dimension.

The right panel has two tabs:

- **Overview** shows counts, review progress, the privacy level distribution and navigation to the next level.
- **Review** lists the entries in the current scope, filtered by review status.

## Review entries

Every entry is pending review, adopted or rejected.

- **Adopt** or **Reject**: one by one, or **Select all** first to act on many. If the selection includes entries not shown in the list yet, you are asked to confirm the count.
- **Edit**: change the attribute, location and content. **Save** moves the entry back to pending review, **Save and adopt** adopts it. Saving without changes keeps its status.
- **Move back to pending**: undo a decision.
- **Add entry**: add an entry by hand. It is marked **Added by hand** and has no scores.
- **Show edit history**: the review, create and edit records of each entry.

Adopted entries make up the clone's portrait. Rejected entries are kept and can be restored at any time.

## Privacy levels and sources

Every entry and every piece of evidence carries a privacy level:

| Level | Meaning |
|---|---|
| Public | Fine to tell a stranger |
| Normal | Comes up with people you know |
| Private | Only for people close to you |
| Sensitive | Stays in the chat it came from |

In the **Review** tab you can filter by privacy level. With none selected, all are shown. Cards also show confidence, importance (averages of the source scores, not recalculated after edits) and search tags.

**View chat** opens the chat excerpt the entry was extracted from, next to the review panel. It is read from this run's extraction files, so it can't be shown once those files are deleted or changed.

## Export

**Export this view** downloads a JSON file with the portrait hierarchy and linked sources under the current review status filter, each entry carrying its review status. Selecting a node on the map doesn't narrow the export.

## Review records

Your review is saved in the run's `profile_hierarchy/profile_review.sqlite3` (`.sqlite3.enc` in encrypted mode) and belongs to that run only. Once the database exists, later starts read it and don't import the portrait file again. Keep it in your backups.
