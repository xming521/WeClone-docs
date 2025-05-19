## 模型下载

WeClone 默认使用 Qwen2.5-7B-Instruct 模型，你也可以选择其他你想要使用的模型（不推荐使用深度思考模型）。

### **安装 Git LFS：**

在 CMD 或 PowerShell 窗口，运行：

```bash
git lfs install
```

每个用户只需执行一次此命令。

### **克隆模型仓库：**

推荐使用 [魔搭社区（ModelScope）](https://www.modelscope.cn/models) 的模型资源，默认下载 `Qwen2.5-7B-Instruct` 模型。你也可以根据自己的情况和喜好选择该平台的其他模型。

在项目根目录下执行以下命令：

```bash
git clone https://www.modelscope.cn/Qwen/Qwen2.5-7B-Instruct.git
```

::: tip
模型文件较大，下载时间可能较长，请确保磁盘空间充足（建议至少 20GB）。
:::

如果你选择了其他模型，或将模型下载到了不同目录，请在 `settings.jsonc` 中修改路径：

```json
"common_args": {
    "model_name_or_path": "你的模型路径",
     "template": "你的模型模板",
}
```