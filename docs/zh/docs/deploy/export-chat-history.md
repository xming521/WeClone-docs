---
pageClass: wide-page
---
# 准备数据

## 支持的平台

目前支持 Telegram 聊天记录，其他平台可以转换成[通用 CSV 格式](#通用-csv-格式)导入，更多数据源持续接入中，欢迎贡献者适配更多平台。

人生画像只读取文字消息。微调分身支持的消息类型如下：

| 平台 | 文字 | 图片 | 语音 | 视频 | 动画表情 | 链接（分享） | 引用 | 转发 | 位置 | 文件 |
|------|------|------|------|------|----------|-----------|------|------|------|------|
| Telegram | ✅ | ✅ | ❌ | ❌ | ⚠️ 转为 Emoji | ❌ | ❌ | ✅ | ✅ | ❌ |
| WhatsApp | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 |
| Discord | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 |
| Slack | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 | 🚧 |

## Telegram

1. 使用 [Telegram Desktop](https://desktop.telegram.org/) 导出聊天记录：在聊天界面点击右上角，选择导出聊天记录，消息类型选择照片，格式选择 JSON。可以导出多个联系人，不建议使用群聊记录。
2. 把导出的 `ChatExport_*` 文件夹都放进 `dataset/telegram/`，每个联系人一个文件夹。
3. 在 `settings.jsonc` 的 `make_dataset_args` 中设置：
   - `platform`：改为 `telegram`
   - `telegram_args.my_id`：你自己的 Telegram 用户 ID，即 `result.json` 中你发出的消息的 `from_id`
   - `language`：聊天常用语言，`zh` 或 `en`
   - `include_type`：微调使用的消息类型，默认 `["text"]`，微调多模态模型时加上 `"image"`

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

## 通用 CSV 格式

其他平台的聊天记录可以转换成 WeClone 的通用 CSV 格式。`make-dataset` 和 `build-profile` 读取同一份文件。

1. 把 CSV 放进 `dataset/csv/`，每个聊天对象一个文件夹。
2. 保持 `make_dataset_args.platform` 为 `chat`。

### 目录结构

```
dataset/
├── csv/
│   ├── friend_a/
│   │   ├── friend_a_0_5000.csv
│   │   ├── friend_a_5000_10000.csv
│   │   └── users.json          # 可选
│   └── friend_b/
│       └── friend_b_0_3000.csv
└── media/
    └── images/
        ├── 01c177d8ad98969ba048455b54eef.jpg
        └── 13d6d8a81fa7d09238c81fe314e85.png
```

- 一个文件夹是一段聊天，可以按消息数量分成多个 CSV，文件名以 `_起始序号_结束序号.csv` 结尾，读取时按起始序号排序。
- 文件夹名建议使用对方的 `talker`。WeClone 按以下顺序确定对方是谁：文件夹名出现在对方发来消息的 `talker` 中时使用文件夹名，否则使用唯一的对方 `talker`，都不满足时使用文件夹名。人生画像按对方身份给联系人编号，导出新记录时请保持文件夹名和 `talker` 不变，同一个人才能沿用原来的编号。

### 列

CSV 使用 UTF-8 编码，第一行是列名：

| 列 | 必填 | 说明 |
|---|---|---|
| `id` | 是 | 顺序编号 |
| `MsgSvrID` | 是 | 消息在原平台的 ID |
| `type_name` | 是 | 消息类型，见下表 |
| `is_sender` | 是 | `1` 是自己发出的，`0` 是对方发来的 |
| `talker` | 是 | 消息发送者的 ID |
| `msg` | 是 | 消息内容，非文字消息可以填类型名 |
| `src` | 是 | 媒体文件路径或附加信息，没有时留空 |
| `CreateTime` | 是 | 发送时间，例如 `2024-10-04 11:42:00` |
| `room_name` | 否 | 聊天对象或群聊的 ID |
| `is_forward` | 否 | 是否为转发消息，自己转发的消息不参与训练和画像 |

`make-dataset` 不接受上表以外的列，多出的列会导致读取失败。

| 数据样例 | | | | | | | | |
|---|---|---|---|---|---|---|---|---|
| **id** | **MsgSvrID** | **type_name** | **is_sender** | **talker** | **room_name** | **msg** | **src** | **CreateTime** |
| 1 | 7437267147299592543 | 图片 | 0 | friend_a | friend_a | 图片 | images/01c177d8ad98969ba048455b54eef.jpg | 2024-10-04 11:42:00 |
| 2 | 4073926741244663531 | 文本 | 1 | me | friend_a | 小马尔代夫 |  | 2024-10-04 11:43:00 |
| 3 | 706358374822797422 | 文本 | 1 | me | friend_a | 名不虚传 |  | 2024-10-04 11:43:10 |

### 消息类型

`type_name` 使用中文类型名：

| 类型 | 处理方式 |
|---|---|
| `文本` | 用于人生画像和训练数据 |
| `图片` | `include_type` 含 `"image"` 时用于多模态训练，否则视为切断 |
| `视频`、`语音`、`合并转发的聊天记录`、`(分享)卡片式链接` 等 | 切断对话，前后的消息不会组成同一个问答对 |
| `动画表情`、`位置`、`文件`、`引用回复`、`转账`、`系统通知`、`消息撤回` 等 | 直接跳过 |

图片按 `src` 的文件名到 `dataset/media/images/` 中查找，扩展名可以不同。只使用对方发来的图片，找不到文件时视为切断。

### users.json

每个聊天文件夹可以放一个 `users.json`，补充关系和备注名：

```json
{
    "relation": "大学同学",
    "friend_a": { "remark": "小王" }
}
```

- `relation`：你和对方的关系。`make_dataset_args.add_relation` 为 `true` 时写进训练数据。
- `<talker>.remark`：对方的备注名。人生画像和训练数据都用它称呼对方。

## 其他聊天软件

可以按通用 CSV 格式编写转换脚本，适配后欢迎向 WeClone 提交 PR。

::: tip
聊天记录 CSV 不要用 Excel 打开，以免乱码，可以使用 VS Code 等编辑器。
:::
