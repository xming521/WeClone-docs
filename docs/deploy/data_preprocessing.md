# 数据预处理

原始的聊天记录需要经过预处理才能用于模型训练。

* **默认处理：** WeClone 项目默认会去除数据中的手机号、身份证号、邮箱和网址。
* **自定义过滤（可选）：** 项目提供了一个禁用词词库 ，在最新的代码中这个词库被移动到了`settings.jsonc`的`blocked_words`。你可以向其中添加不希望出现在训练数据中的词句（包含禁用词的整句会被过滤掉）。

## **执行预处理脚本：**

在激活虚拟环境的命令行中，进入 WeClone 项目根目录，运行：

```bash
weclone-cli make-dataset  #在WeClone根目录下执行该命令
```

* `WeClone` 默认启用了 `clean_dataset` 配置中的 `enable_clean` 选项，会对原始数据进行清洗，以提升后续处理效果。当前系统支持使用 `llm judge` 对聊天记录进行打分，提供 **vllm 离线推理** 和 **API 在线推理** 两种方式。你可以通过将 `settings.jsonc` 文件中的 `"online_llm_clear": false` 修改为 `true` 来启用 API 在线推理模式，并配置相应的 `base_url`、`llm_api_key`、`model_name` 等参数。所有兼容 OpenAI 接口的模型均可接入，但需注意使用 API 可能带来额外成本。

* 在获得 `llm 打分分数分布情况` 后，可通过设置 `accept_score` 参数筛选可接受的分数区间，同时可适当降低 `train_sft_args` 中的 `lora_dropout` 参数，以提升模型的拟合效果。请注意，**纯 Windows 平台的用户无法使用 vllm 离线推理功能**。

* 预处理完成后，数据通常会保存在 `\WeClone\dataset\res_csv\sft` 目录或其子目录下的 `sft-my.json` 文件中。

  

## 💡 使用 vLLM 时的注意事项

如果你选择使用**vllm进行离线推理**，且显存有限，需要启用**vLLM的`bitsandbytes`量化加载**，否则这一步也可能会爆显存。进一步调整、优化`vllm`参数请查询[ vLLM 引擎参数 ](https://docs.vllm.com.cn/en/latest/serving/engine_args.html#engine-args)

```python
# 在下面代码中的engine_args新增参数
# weclone/core/inference/vllm_infer.py

engine_args = {
    "model": model_args.model_name_or_path,
    "trust_remote_code": True,
    "dtype": model_args.infer_dtype
    "max_model_len": cutoff_len + max_new_tokens,
    "enable_lora": model_args.adapter_name_or_path is not None,
    "enable_prefix_caching": True,

    # ↓ 新增内容 ↓
    "quantization": "bitsandbytes",
    "load_format": "bitsandbytes",
}
```
>[!TIP]
> 如果遇到报错`ImportError: Please install bitsandbytes>=0.45.3`，可以尝试重新安装`bitsandbytes`：
> ```bash
> #使用uv安装 bitsandbytes，建议科学上网
> uv pip install bitsandbytes>=0.39.0
> ```

* 此外如果你使用了型号比较老的GPU（例如，计算能力 Compute Capability 低于 8.0 的NVIDIA GPU，如Tesla T4, V100, GTX 10xx/20xx系列等）可能会遇到下面报错：

  ```bash
  ValueError: Bfloat16 is only supported on GPUs with compute capability of at least 8.0. Your xxx GPU has compute capability xx. You can use float16 instead by explicitly setting the idtype flag in CLI, for ecample: --dtype=half.
  ```

  这是因为： `bfloat16` (BF16) 是一种较新的浮点数格式，需要GPU硬件达到一定的计算能力（通常是NVIDIA Ampere架构及更新的GPU，计算能力 >= 8.0）才能原生支持。如果模型默认尝试以 `bfloat16` 加载，而你的GPU不支持，就会出现这个错误。这时候你可以尝试在原本的`CLI`后加上`--dtype=half`然后重新执行：

  ```bash
  weclone-cli make-dataset --dtype=half
  ```

  或者在`settings.jsonc`中增加以下参数，然后重新执行`weclone-cli make-dataset`，看问题是否解决。

  ```json
  "infer_args": {
      "repetition_penalty": 1.2,
      "temperature": 0.5,
      "max_length": 50,
      "top_p": 0.65,
      "infer_dtype": "float16"  // 添加这一行
  }
  ```