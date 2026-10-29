# 数据预处理

本页生成微调分身使用的训练数据。人生画像不读取这里的结果，直接从原始聊天抽取。

- 先按[准备数据](export-chat-history.md)放好聊天记录，并在 `make_dataset_args` 中设置 `platform`、`language`、`include_type`。
- 需要先安装[微调依赖](environment.md#微调依赖)，包括隐私过滤使用的 spaCy 模型。

## 隐私过滤

生成训练数据时，WeClone 使用 Microsoft Presidio 过滤个人隐私信息：

* **默认过滤：** 去除电话号码、电子邮件地址、信用卡号码（12–19 位数字）、IP 地址、地理位置名称、国际银行账户号码、加密货币钱包地址、年龄信息和通用身份证号码，但不能保证 100% 识别。
* **自定义过滤：** 在 `blocked_words` 中添加禁用词，包含禁用词的整句会被过滤掉，不再出现在训练数据中。

## 执行预处理脚本

激活虚拟环境，在 WeClone 项目根目录运行：

```bash
weclone-cli make-dataset
```

训练数据写入 `train_sft_args.dataset_dir`（默认 `./dataset/res_csv/sft`）。加密模式下训练数据加密保存。

## 相关参数

📌 **聊天习惯** <br>
目前使用时间窗口策略：同一个人在 `single_combine_time_window` 分钟内的连续消息合并为一句，用换行连接；`qa_match_time_window` 分钟内的问答组成一个问答对。可以根据自己的回复频率修改这两个参数。`combine_msg_max_length` 和 `messages_max_length` 限制合并后一句和一个问答对的长度，需要配合 `cutoff_len` 使用。

📌 **时间与关系** <br>
`add_time` 为 `true` 时，在每条训练数据的系统提示词后加上消息时间。`add_relation` 为 `true` 时，加上聊天文件夹 `users.json` 中的 `relation`，见[通用 CSV 格式](export-chat-history.md#users-json)。开启后，部署时的系统提示词也要按同样的方式填写。

📌 **训练多模态大模型** <br>
在 `include_type` 中添加 `"image"` 启用，并通过 `common_args.image_max_pixels` 和 `max_image_num` 控制图片大小和数量，以减少显存占用。模型和模板的改法见[多模态模型](model_download.md#多模态模型)。

📌 **图片转文字** <br>
在 `include_type` 中添加 `"image"`，并把 `vision_api.enable` 设为 `true`、填写 `api_key`、`api_url`、`model_name`，将使用外部多模态模型把图片转为文字，最终生成的数据集**仍用于训练纯文本语言模型**。图片会发送给配置的 API。

📌 **数据清洗** <br>
把 `clean_dataset.enable_clean` 设为 `true`，用 LLM 给每个问答对打分，低于 `accept_score`（1 分最差，5 分最好）的数据不用于训练。多模态数据暂不支持。

- 默认使用 vLLM 离线推理，用本地模型打分，只支持 Linux。
- 把 `online_llm_clear` 设为 `true` 改用 API 在线推理，并填写 `base_url`、`llm_api_key`、`model_name`，所有兼容 OpenAI 接口的模型均可接入。聊天内容会发送给该 API。`clean_batch_size` 控制每批打分的数量。

## 💡 使用 vLLM 时的注意事项

使用 vLLM 离线推理且显存有限时，可以启用 vLLM 的 `bitsandbytes` 量化加载，否则这一步也可能显存溢出。进一步调整 vLLM 参数请查询 [vLLM 引擎参数](https://docs.vllm.ai/en/v0.10.0/configuration/engine_args.html)。

```json
"vllm_args": {
    "gpu_memory_utilization": 0.9,
    "quantization": "bitsandbytes", // 启用 bitsandbytes 量化加载
    "load_format": "bitsandbytes"
},
```

>[!TIP]
> 如果遇到报错`ImportError: Please install bitsandbytes>=0.45.3`，可以尝试重新安装`bitsandbytes`：
> ```bash
> uv pip install "bitsandbytes>=0.45.3"
> ```

计算能力低于 8.0 的 NVIDIA GPU（例如 Tesla T4、V100、GTX 10xx/20xx 系列）不支持 bfloat16，可能遇到下面的报错：

```bash
ValueError: Bfloat16 is only supported on GPUs with compute capability of at least 8.0.
```

这时在 `vllm_args` 中设置 `dtype` 后重新执行：

```json
"vllm_args": {
    "dtype": "float16",
    ...
},
```
