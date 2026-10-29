---
pageClass: wide-page
---
# Preparing Data

## Supported platforms

Telegram chats are supported today. Chats from other platforms can be converted to the [generic CSV format](#generic-csv-format), and more data sources are coming. Contributions for other platforms are welcome.

The life portrait reads text messages only. The fine-tuned clone supports these message types:

| Platform | Text | Images | Voice | Video | Animated Emojis/Stickers | Links (Sharing) | Quote | Forward | Location | Files |
|----------|------|--------|-------|-------|-----------------|-----------------|-------|---------|----------|-------|
| Telegram | ✅ | ✅ | ❌ | ❌ | ⚠️ Converted to Emoji | ❌ | ❌ | ✅ | ✅ | ❌ |
| WhatsApp | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 |
| Discord | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 |
| Slack | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 |

## Telegram

1. Export your chats with [Telegram Desktop](https://desktop.telegram.org/): open a chat, click the menu in the top right, choose Export chat history, select Photos as the message type and JSON as the format. You can export several contacts. Group chats are not recommended.
2. Put every exported `ChatExport_*` folder in `dataset/telegram/`, one folder per contact.
3. In `make_dataset_args` of `settings.jsonc`, set:
   - `platform`: `telegram`
   - `telegram_args.my_id`: your own Telegram user ID, the `from_id` of the messages you sent in `result.json`
   - `language`: the main language of your chats, `zh` or `en`
   - `include_type`: message types used for fine-tuning, `["text"]` by default. Add `"image"` for multimodal models

```
dataset/
└── telegram/
    ├── ChatExport_2025-01-01/
    │   ├── result.json
    │   └── photos/
    └── ChatExport_2025-01-02/
        ├── result.json
        └── photos/
```

## Generic CSV format

Chats from other platforms can be converted to WeClone's generic CSV format. `make-dataset` and `build-profile` read the same files.

1. Put the CSV files in `dataset/csv/`, one folder per chat partner.
2. Keep `make_dataset_args.platform` set to `chat`.

### Folder layout

```
dataset/
├── csv/
│   ├── friend_a/
│   │   ├── friend_a_0_5000.csv
│   │   ├── friend_a_5000_10000.csv
│   │   └── users.json          # optional
│   └── friend_b/
│       └── friend_b_0_3000.csv
└── media/
    └── images/
        ├── 01c177d8ad98969ba048455b54eef.jpg
        └── 13d6d8a81fa7d09238c81fe314e85.png
```

- A folder holds one chat, which can be split into several CSV files by message count. File names end in `_<start>_<end>.csv` and are read in order of the start number.
- Name the folder after the partner's `talker`. WeClone decides who the partner is in this order: the folder name if it appears as the `talker` of received messages, otherwise the only `talker` of received messages, otherwise the folder name. The life portrait numbers contacts by partner, so keep folder names and `talker` values unchanged in later exports to keep each person's number.

### Columns

CSV files are UTF-8 with a header row:

| Column | Required | Description |
|---|---|---|
| `id` | Yes | Sequential number |
| `MsgSvrID` | Yes | Message ID on the original platform |
| `type_name` | Yes | Message type, see below |
| `is_sender` | Yes | `1` for messages you sent, `0` for messages you received |
| `talker` | Yes | ID of the sender |
| `msg` | Yes | Message content. Non-text messages can hold the type name |
| `src` | Yes | Media file path or extra information, empty when unused |
| `CreateTime` | Yes | Send time, such as `2024-10-04 11:42:00` |
| `room_name` | No | ID of the chat partner or group |
| `is_forward` | No | Whether the message is forwarded. Messages you forwarded are left out of training and the portrait |

`make-dataset` accepts no columns beyond these, and extra columns make reading fail.

| Sample | | | | | | | | |
|---|---|---|---|---|---|---|---|---|
| **id** | **MsgSvrID** | **type_name** | **is_sender** | **talker** | **room_name** | **msg** | **src** | **CreateTime** |
| 1 | 7437267147299592543 | 图片 | 0 | friend_a | friend_a | 图片 | images/01c177d8ad98969ba048455b54eef.jpg | 2024-10-04 11:42:00 |
| 2 | 4073926741244663531 | 文本 | 1 | me | friend_a | Little Maldives |  | 2024-10-04 11:43:00 |
| 3 | 706358374822797422 | 文本 | 1 | me | friend_a | Lives up to its name |  | 2024-10-04 11:43:10 |

### Message types

`type_name` uses the Chinese type names:

| Type | Handling |
|---|---|
| `文本` (text) | Used for the life portrait and training data |
| `图片` (image) | Used for multimodal training when `include_type` contains `"image"`, otherwise treated as a cut |
| `视频` (video), `语音` (voice), `合并转发的聊天记录` (merged forward), `(分享)卡片式链接` (shared link) and similar | Cut the conversation, so messages before and after don't form one Q&A pair |
| `动画表情` (sticker), `位置` (location), `文件` (file), `引用回复` (quote), `转账` (transfer), `系统通知` (system notice), `消息撤回` (recall) and similar | Skipped |

Images are looked up in `dataset/media/images/` by the file name in `src`, with any extension. Only images you received are used, and missing files count as a cut.

### users.json

Each chat folder can hold a `users.json` with the relationship and the partner's display name:

```json
{
    "relation": "college classmate",
    "friend_a": { "remark": "Alex" }
}
```

- `relation`: your relationship with the partner, written into the training data when `make_dataset_args.add_relation` is `true`.
- `<talker>.remark`: the partner's display name, used for them in the life portrait and the training data.

## Other chat apps

Write a converter to the generic CSV format, and feel free to contribute it to WeClone as a pull request.

::: tip
Don't open chat CSV files in Excel, which can garble them. Use an editor such as VS Code.
:::
