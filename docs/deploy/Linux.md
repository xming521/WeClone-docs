# 环境配置（Linux 系统）

本项目在 **Linux 系统** 下的环境配置可以基本按照项目的 `README` 中的步骤完成。如果你具备一定的 Linux 使用基础，建议直接参考 `README` 或者参考本教程进行部署。

如果你是初次接触 Linux，或者希望通过云服务器部署本项目，也不必担心。你可以参考以下保姆级教程，逐步完成部署过程：

* [WeClone：基于 Linux 的部署指南【保姆级教程】](https://blog.051088.xyz/posts/weclone-linux-tutorial/)

## Git 版本控制工具

WeClone 项目的代码托管在 GitHub 上，因此你需要预先安装 **Git** 工具来克隆项目仓库。

如果你使用的是基于 Ubuntu 的系统，可直接运行以下命令进行安装：

```bash
apt-get update && apt-get install git
```

对于其他 Linux 发行版或安装方式，请参考：
 [Git 安装与配置教程 - 菜鸟教程](https://www.runoob.com/git/git-install-setup.html)

## **安装 uv (推荐的包管理器)**
`uv`是一个由 Astral 开发的快速 Python 包管理器。推荐使用 `uv` 创建虚拟环境并安装项目依赖，可以避免包版本冲突。

  打开系统终端,使用 pip 安装 uv：

  ```bash
  pip install uv
  ```

> 注：项目尚未提供 `requirements.txt`，使用其他命令（如 `conda`）易导致依赖版本冲突。

## 虚拟环境搭建

1. **cuda安装**：（如已安装，请直接跳过）

2. **克隆 WeClone 项目：**
   打开系统终端，导航到你希望存放项目的目录，然后克隆仓库：

   ```bash
   git clone https://github.com/xming521/WeClone.git
   cd WeClone
   ```

3. **创建并激活虚拟环境 (使用 uv)：**

   在 `WeClone` 项目根目录下执行：

   ```bash
   uv venv .venv --python=3.10  # 你可以指定已安装的 Python 3.10+ 版本
   source .venv/bin/activate
   ```

   激活成功后，你的命令行提示符前通常会显示 `(.venv)`。

4. **安装项目主要依赖：**

   ```bash
   uv pip install --group main -e .
   ```

   此命令将读取项目中依赖配置并安装所有库。

5. **（ `pytorch`安装失败再看）手动安装 `pytorch`**

    <details>
      <summary>手动安装 PyTorch 参考教程</summary>
      <p> 网络环境不稳定的情况下安装PyTorch有一定概率会出错，所以可以在环境内安装好 PyTorch。推荐从一些国内镜像源下载好 PyTorch 安装包后在本地离线安装。可以参考下面的教程，但是注意教程中使用的是下载官方包的链接，需要替换成国内镜像源的对应网站。</p>
      <p><strong>参考教程：</strong><a href="https://blog.csdn.net/weixin_44956153/article/details/142303905" target="_blank">PyTorch 离线版本安装教程</a></p>
      安装完后记得重新跑一下`uv pip install --group main -e .`把漏掉的包重新安装上
    </details>

6. **测试 CUDA 环境 (NVIDIA GPU 用户)：**
   安装完依赖后（特别是 PyTorch），运行以下命令测试 CUDA 是否配置正确并能被 PyTorch 识别：

   ```bash
   python -c "import torch; print('CUDA是否可用:', torch.cuda.is_available()); print('CUDA版本:', torch.version.cuda); print('PyTorch版本:', torch.__version__)"
   ```

   如果 `CUDA是否可用:` 显示 `True`，则表示配置成功。

7. **复制配置文件模板**

   将配置文件模板复制一份并重命名为`settings.jsonc`，后续配置修改在此文件进行：

   ```bash
   cp settings.template.jsonc settings.jsonc
   ```

8. **(可选) 安装 FlashAttention：**
   为了加速训练和推理（如果你的硬件支持），可以尝试安装 FlashAttention。

   可以直接尝试：

   ```bash
   uv pip install flash-attn --no-build-isolation
   ```

   > ⚠️Flash Attention 仅适用于 Turing、Ampere、Ada 和 Hopper 架构的 NVIDIA GPU（如 A100、H100、T4、RTX 2080、RTX 3090 等），不支持 Volta 架构的 V100。

   <details>

   <summary>如果失败再用下面方法：</summary>

   **再次检查本地python、torch、cuda的版本**（如果你很清楚你当前的配置可以不用检查）

   ```bash
   python --version &&
   python -c "import torch; print(torch.__version__); print(torch.cuda.is_available())" &&
   nvcc -V
   ```

   执行以上命令，得到你的`python`、`torch`和`cuda`版本。正常来讲你会得到下面的结果：

   ```bash
   Python 3.10.12 #python版本，应该是3.10
   2.6.0+cu124 #你的torch版本，安教程来安装的应该是2.6.0
   True #CUDA可用
   nvcc: NVIDIA (R) Cuda compiler driver
   Copyright (c) 2005-2024 NVIDIA Corporation
   Built on Thu_Sep_12_02:18:05_PDT_2024
   Cuda compilation tools, release 12.6, V12.6.77
   Build cuda_12.6.r12.6/compiler.34841621_0 #cuda版本，应该大于12.4
   ```

   确定自己的相关版本后，在[Flash-attention下载地址](https://github.com/Dao-AILab/flash-attention/releases)选择对应的`whl`文件用`pip install`来安装，例如：

   ```bash
   wget https://github.com/Dao-AILab/flash-attention/releases/download/v2.7.4.post1/flash_attn-2.7.4.post1+cu12torch2.6cxx11abiTRUE-cp310-cp310-linux_x86_64.whl
   pip install flash_attn-2.7.4.post1+cu12torch2.6cxx11abiTRUE-cp310-cp310-linux_x86_64.whl
   ```

   </details>
---

**到这里，恭喜你完成了全部的环境配置。你已经完成了整个项目部署最难的部分！！！**