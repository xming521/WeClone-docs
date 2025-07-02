
# 环境配置

## Linux

1. cuda安装(已安装可跳过，**要求版本12.6及以上**)：[LLaMA Factory](https://llamafactory.readthedocs.io/zh-cn/latest/getting_started/installation.html#cuda) 

2. 建议使用 [uv](https://docs.astral.sh/uv/) 安装依赖，这是一个非常快速的 Python 环境管理器，[官方安装方式](https://docs.astral.sh/uv/getting-started/installation/)。

3. 安装uv后，您可以使用以下命令创建一个新的Python环境并安装依赖项：
```bash
git clone https://github.com/xming521/WeClone.git && cd WeClone
uv venv .venv --python=3.10
source .venv/bin/activate # windows下执行 .venv\Scripts\activate
uv pip install --group main -e . -i https://pypi.tuna.tsinghua.edu.cn/simple/ 
```

4. 将配置文件模板复制一份并重命名为`settings.jsonc`，后续配置修改在此文件进行：
```bash
cp settings.template.jsonc settings.jsonc
```
- 微调**多模态模型**时，请使用[examples/mllm.template.jsonc](https://github.com/xming521/WeClone/blob/master/examples/mllm.template.jsonc)作为配置文件。

> [!NOTE]
> 训练以及推理相关配置统一在文件`settings.jsonc`

5.使用以下命令测试CUDA环境是否正确配置并可被PyTorch识别(NVIDIA GPU 用户)：
```bash
python -c "import torch; print('CUDA是否可用:', torch.cuda.is_available());"
```

6.（可选）安装 **FlashAttention**，加速训练和推理：
```bash
uv pip install flash-attn --no-build-isolation
```
> [!NOTE]
> 版本问题可以使用 **FlashAttention** 的[prebuild-wheels](https://github.com/mjun0812/flash-attention-prebuild-wheels/releases)的预编译包安装。

## Windows

Windows环境下运行WeClone未进行严格测试，并且不能使用本地模型清洗数据，建议使用WSL2（GPU性能损耗约5%），请参考[WSL2](https://learn.microsoft.com/zh-cn/windows/wsl/install)安装。




**到这里，恭喜你完成了全部的环境配置！！！**