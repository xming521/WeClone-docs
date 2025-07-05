# 模型下载

WeClone 默认使用 Qwen2.5-7B-Instruct 模型，你也可以选择其他你想要使用的模型（不推荐使用思考模型）。

::: tip
7B模型一般效果较差(也有反馈还可以的，这可能和数据有关)，14B勉强及格，32B效果较好。
:::

如果你选择了其他模型、将模型下载到了其他目录，请在 `settings.jsonc` 中修改：

```json
"common_args": {
    "model_name_or_path": "你的模型路径",
    "template": "你的模型模板",
    ...
},
"train_sft_args": {
    "lora_target": "需要微调的模型的模块名称", // 例如："q_proj", "k_proj", "v_proj", "o_proj"
    ...
},
```

## 方法一：使用 `ModelScope` 命令行工具下载（国内推荐使用）

首先安装 `modelscope` 库：

```bash
uv pip install modelscope
```

在项目根目录执行下面的命令：

```bash
modelscope download --model Qwen/Qwen2.5-7B-Instruct --local_dir ./models/Qwen2.5-7B-Instruct
```
> ⚠️ 模型文件较大，下载时间可能较长，请确保磁盘空间充足（建议至少 20GB）。<br>
下载过程较长，连接可能中断，增量下载重试即可。


## 方法二：使用`Git`安装

```bash
git lfs install
git clone https://www.modelscope.cn/Qwen/Qwen2.5-7B-Instruct.git models/Qwen2.5-7B-Instruct
```


