---
pageClass: wide-page
---
# Chat Platform Adapters

WeClone currently supports chat history from the following platforms as data sources. Contributions to adapt more platforms are welcome.

| Platform | Text | Images | Voice | Video | Animated Emojis | Links (Shared) | Quoted | Forwarded | Location | Files |
|---|---|---|---|---|---|---|---|---|---|---|
| Telegram | ✅ | ✅ | ❌ | ❌ | ⚠️Converted to Emoji | ❌ | ❌ | ✅ | ✅ | ❌ |
| WhatsApp | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 |
| Discord | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 |
| Slack | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 |

<br>

# Exporting Chat History

## Telegram
- Please use [Telegram Desktop](https://desktop.telegram.org/) to export your chat history.
- Select "Photos" for the message type and "JSON" for the format.
- You can export from multiple contacts (exporting group chat history is not recommended). Then, place the exported `ChatExport_*` folders into the `./dataset/telegram` directory. This means putting the chat history folders from different people together under `./dataset/telegram`.
- Please change `telegram_args.my_id` in the configuration file to your own Telegram User ID. The `from_id` in `result.json` is your User ID.

#### Directory Structure

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

### The data sample format required by WeClone is as follows:

| id | MsgSvrID | type_name | is_sender | talker | room_name | msg | src | CreateTime |
|---|---|---|---|---|---|---|---|---|
| 1 | 7437267147299592543 | Image | 0 | 12345iru2zsmo22 | 6789z5qlxzfj22 | Image | File\dd0e62b6eb67d1953454354350301d6c\Image\2024-10\01c177d8ad90af8969b455b54eef.dat | 2024/10/4 11:42 |
| 2 | 637529293739295664 | Image | 0 | 12345iru2zsmo22 | 6789z5qlxzfj22 | Image | File\dd0e62b6eb67d1953454354350301d6c\Image\2024-10\d8a8936ca622823452e80a53a6.dat | 2024/10/4 11:42 |
| 3 | 4073926741244663531 | Text | 1 | 12345iru2zsmo22 | 6789z5qlxzfj22 | Little Maldives |  | 2024/10/4 11:43 |
| 4 | 706358374822797422 | Text | 1 | 12345iru2zsmo22 | 6789z5qlxzfj22 | Worthy of the name |  | 2024/10/4 11:43 |

```python
class ChatMessage:
    id: int  # Sequential ID
    MsgSvrID: str  # Original message platform ID
    type_name: str  # Message type, see cut_type_data and skip_type_data
    is_sender: int  # 0: Sent by the other person, 1: Sent by you
    talker: str  # Message sender ID
    msg: str  # Message content
    src: str  # Media file path, additional information field
    CreateTime: Timestamp  # Message sending time
    room_name: Optional[str] = None  # Message receiver or group chat ID
    is_forward: bool = False  # Whether the message is forwarded
```

#### Recommended Directory Structure

```
dataset/
├── csv/
│   ├── person1-personal_chat-1234567890/
│   │   ├── person1_0_5000.csv
│   │   └── person1_5000_10000.csv
│   └── person2-personal_chat-2345678901/
│       ├── person2_0_5000.csv
│       └── person2_5000_10000.csv
└── media/ 
    └── images/
        ├── 01c177d8ad98969ba048455b54eef.jpg
        └── 13d6d8a81fa7d09238c81fe314e85.png
```

> **Note**:
> - Each person's chat history is stored in a separate folder.
> - CSV files can be split by the number of messages: `person_start_index_end_index.csv`

## Exporting Data from Other Chat Software
You can refer to the `ChatMessage` class for adaptation. After adapting, you are welcome to submit a PR to WeClone.
