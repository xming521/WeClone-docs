# 模型下载

WeClone 默认使用 Qwen2.5-7B-Instruct 模型，你也可以选择其他你想要使用的模型（不推荐使用深度思考模型）。

## **方法一：使用`Git`安装**

### **安装 Git LFS：**

在 CMD 或 PowerShell 窗口，运行：

```bash
git lfs install
```

对于`wsl2`用户，你在终端运行以下命令来安装：

```bash
apt update # 更新包列表
apt install git-lfs # 安装 git-lfs(ubuntu)
git lfs install # 验证是否安装成功
```

若显示：`Git LFS initialized`则安装成功。

> 每个用户只需执行一次此命令。

### **克隆模型仓库：**

推荐使用 [魔搭社区（ModelScope）](https://www.modelscope.cn/models) 的模型资源，默认下载 `Qwen2.5-7B-Instruct` 模型。你也可以根据自己的情况和喜好选择该平台的其他模型。

在项目根目录下执行以下命令：

```bash
git clone https://www.modelscope.cn/Qwen/Qwen2.5-7B-Instruct.git
```

> ⚠️ 模型文件较大，下载时间可能较长，请确保磁盘空间充足（建议至少 20GB）。

## 方法二：使用`ModelScope` 命令行工具下载（推荐使用）

首先安装`modelscope`库：

```bash
uv pip install modelscope
```

在项目根目录执行下面的命令：

```bash
modelscope download --model Qwen/Qwen2.5-7B-Instruct --local_dir ./Qwen2.5-7B-Instruct
```

等待下载完成即可。

## 修改模型路径或模板

如果你选择了其他模型、将模型下载到了不同目录或者是使用`ModelScope SDK`下载的模型，请在 `settings.jsonc` 中修改路径：

```json
"common_args": {
    "model_name_or_path": "你的模型路径",
     "template": "你的模型模板",
}
```