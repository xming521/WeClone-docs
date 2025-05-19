# 数据预处理

原始的聊天记录需要经过预处理才能用于模型训练。

* **默认处理：** WeClone 项目默认会去除数据中的手机号、身份证号、邮箱和网址。
* **自定义过滤（可选）：** 项目提供了一个禁用词词库 ，在最新的代码中这个词库被移动到了`settings.jsonc`的`blocked_words`。你可以向其中添加不希望出现在训练数据中的词句（包含禁用词的整句会被过滤掉）。

## **执行预处理脚本：**

在激活虚拟环境的命令行中，进入 WeClone 项目根目录，运行：

```bash
weclone-cli make-dataset  #在WeClone根目录下执行该命令
```

* `WeClone`默认启用了`clean_dataset`中的`enable_clean`选项，对数据进行清洗，以达到更好效果。当前使用`llm judge`对聊天记录进行打分，使用vllm进行离线推理。在得到`llm打分分数分布情况`后，调整`accept_score`选择可以接受的分数，再适当降低`train_sft_args`的`lora_dropout`参数提升拟合效果。纯`Windows`平台部署的用户无法使用该功能。

* 如果你启用了`clean_dataset`中的`enable_clean`，且显存有限，需要启用**vLLM的`bitsandbytes`量化加载**，否则这一步也可能会爆显存。进一步调整、优化`vllm`参数请查询[ vLLM 引擎参数 ](https://docs.vllm.com.cn/en/latest/serving/engine_args.html#engine-args)

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

  

* 预处理后的数据通常会保存在 `\WeClone\dataset\res_csv\sft` 或类似目录下的`sft-my.json`文件中。