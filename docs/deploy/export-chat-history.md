---
pageClass: wide-page
---
# 聊天平台适配

| 平台 | 文字 | 图片 | 语音 | 视频 | 动画表情 | 链接(分享) | 引用 | 转发 | 位置 | 文件 |
|------|------|------|------|------|----------|-----------|------|------|------|------|
| 微信 | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Telegram | ✅ | ✅ | ❌ | ❌ | ⚠️转为Emjoy | ❌ | ❌ | ✅ | ✅ | ❌ |

 

<br>

# 聊天记录导出

## 微信

- 使用[PyWxDump](https://github.com/xaoyaoo/PyWxDump)，或其他开源工具导出微信聊天记录。其他工具需要格式转换为PyWxDump的导出格式。  
- 可以先将手机的聊天记录迁移（备份）到电脑，数据量更多一些。  
- 导出类型为CSV，可以导出多个联系人（不建议使用人多的群聊记录）  
- 和一个聊天对象的聊天记录存放在一个单独的文件夹中，文件夹下可以有多个CSV文件。  
- 将同多个人聊天的多个文件夹复制到WeClone项目的`./dataset/csv`文件夹下  
- 媒体文件可以通过[微信图片解密工具](https://github.com/Evil0ctal/WeChat-image-decryption)或其他工具解密图片数据，解密后的图片存放在`./dataset/media/images`文件夹下

#### 推荐的目录结构

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

> **说明**：
> - 每个人的聊天记录存放在独立的文件夹中
> - CSV文件可按消息数量分片：`person_起始序号_结束序号.csv`


### WeClone需要的数据样例格式如下：

| id | MsgSvrID | type_name | is_sender | talker | room_name | msg | src | CreateTime |
|---|---|---|---|---|---|---|---|---|
| 1 | 7437267147299592543 | 图片 | 0 | wxid_12345iru2zsmo22 | wxid_6789z5qlxzfj22 | 图片 | FileStorage\MsgAttach\dd0e62b6eb67d1953454354350301d6c\Image\2024-10\01c177d8ad90af8969b455b54eef.dat | 2024/10/4 11:42 |
| 2 | 637529293739295664 | 图片 | 0 | wxid_12345iru2zsmo22 | wxid_6789z5qlxzfj22 | 图片 | FileStorage\MsgAttach\dd0e62b6eb67d1953454354350301d6c\Image\2024-10\d8a8936ca622823452e80a53a6.dat | 2024/10/4 11:42 |
| 3 | 4073926741244663531 | 文本 | 1 | wxid_12345iru2zsmo22 | wxid_6789z5qlxzfj22 | 小马尔代夫 |  | 2024/10/4 11:43 |
| 4 | 706358374822797422 | 文本 | 1 | wxid_12345iru2zsmo22 | wxid_6789z5qlxzfj22 | 名不虚传 |  | 2024/10/4 11:43 |

```python
class ChatMessage:
    id: int  # 顺序id
    MsgSvrID: str  # 消息平台原始id
    type_name: str  # 消息类型 参考cut_type_data和skip_type_data
    is_sender: int  # 0: 对方发送 1: 自己发送
    talker: str  # 消息发送者id
    msg: str  # 消息内容
    src: str  # 媒体文件路径、额外信息字段
    CreateTime: Timestamp  # 消息发送时间
    room_name: Optional[str] = None  # 消息接收者或群聊id
    is_forward: bool = False  # 是否是转发消息
```

## Telegram
- 请使用 [Telegram Desktop](https://desktop.telegram.org/) 导出聊天记录。
- 消息类型选择“照片”，格式选择“JSON”。
- 可以导出多个联系人（不建议导出群聊记录），然后将导出的 `ChatExport_*` 文件夹放入 `./dataset/telegram` 目录中，即把不同人的聊天记录文件夹一起放在 `./dataset/telegram` 下。

#### 目录结构

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

## 其他聊天软件数据导出
可以参考`ChatMessage`类进行适配，适配后欢迎向WeClone提交PR。