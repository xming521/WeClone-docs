# 数据预处理

WeClone 需将导出的原始聊天记录预处理为模型训练格式，且将过滤个人隐私信息，并提供默认和自定义两种模式。
> 使用 Microsoft Presidio 进行 PII（个人身份信息）数据脱敏。

* **默认过滤：** 默认会去除数据中的`电话号码、电子邮件地址、信用卡号码、IP地址、地理位置名称、国际银行账户号码、加密货币钱包地址、年龄信息、通用身份证号码`等PII,但是不能保证100%识别。
* **自定义过滤：** 项目提供一个禁用词词库参数 `blocked_words`，你可以自定义禁止词句（包含禁用词的整句会被过滤掉，不再出现在训练数据中）。

### **执行预处理脚本**

激活虚拟环境，在 WeClone 项目根目录，运行：
```bash
weclone-cli make-dataset  
```
### 相关参数   
📌 **聊天习惯** <br>
可以根据自己的回复消息频率修改 `single_combine_time_window` 和 `qa_match_time_window` 参数。目前支持时间窗口策略，根据 `single_combine_time_window` 参数将单人连续消息通过符号（中文为`，`，英文为`|`）连接合并为一句，根据 `qa_match_time_window` 参数匹配问答对。

📌 **训练多模态大模型** <br>
在`include_type`中添加`images`启用，并通过`image_max_pixels`和`max_image_num`参数控制图片数量和大小，以减少显存占用。

📌 **Image to Text** <br>
在`include_type`中添加`images`并配置 `vision_api` 参数，将使用外部多模态模型将图片转为文本，最终生成的数据集**仍用于训练纯文本语言模型**。

📌 **数据清洗** <br>
可以启用`clean_dataset`中的`enable_clean`选项，对数据进行清洗，以达到更好效果（多模态数据暂不支持）。
当前支持使用 `llm judge` 对聊天记录进行打分，提供 **vllm 离线推理** 和 **API 在线推理** 两种方式。默认离线推理，可通过将 `settings.jsonc` 文件中的 `"online_llm_clear": false` 修改为 `true` 来启用 API 在线推理模式，并配置相应的 `base_url`、`llm_api_key`、`model_name` 等参数。所有兼容 OpenAI 接口的模型均可接入。

  
## 💡 使用 vLLM 时的注意事项

如果你选择使用**vllm进行离线推理**，且显存有限，需要启用**vLLM的`bitsandbytes`量化加载**，否则这一步也可能会显存溢出。进一步调整、优化`vllm`参数请查询[ vLLM 引擎参数 ](https://docs.vllm.com.cn/en/latest/serving/engine_args.html#engine-args)

配置文件vLLM 引擎参数`vllm_args`：
```json
...
"vllm_args": {
    "gpu_memory_utilization": 0.9,
    "quantization": "bitsandbytes", // 是否启用vllm的 bitsandbytes 的量化加载
    "load_format": "bitsandbytes"
    ...
    },
...
```
>[!TIP]
> 如果遇到报错`ImportError: Please install bitsandbytes>=0.45.3`，可以尝试重新安装`bitsandbytes`：
> ```bash
> uv pip install bitsandbytes>=0.39.0
> ```

* 如果你使用了型号比较老的GPU（例如，计算能力 Compute Capability 低于 8.0 的NVIDIA GPU，如Tesla T4, V100, GTX 10xx/20xx系列等）可能会遇到下面报错：

  ```bash
  ValueError: Bfloat16 is only supported on GPUs with compute capability of at least 8.0. Your xxx GPU has compute capability xx. You can use float16 instead by explicitly setting the idtype flag in CLI, for ecample: --dtype=half.
  ```

  这时候你可以尝试在原本的`CLI`后加上`--dtype=half`然后重新执行：

  ```bash
  weclone-cli make-dataset --dtype=half
  ```