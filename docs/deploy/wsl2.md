# 环境配置 （WSL2）

 WSL2（Windows Subsystem for Linux 2）是 Windows 提供的一种轻量级 Linux 运行环境，具备完整的 Linux 内核，并支持更好的文件系统性能和兼容性。它允许用户在 Windows 系统中运行 Linux 命令行工具和应用程序，而无需安装虚拟机或双系统。

## **安装`WSL2`**

`WSL2`的安装教程互联网上有很多，这里推荐两个讲解比较详细的，可以参考：

- [windows11 安装WSL2全流程](https://blog.csdn.net/u011119817/article/details/130745551)（不需要安装图形界面）
- [Win10/11系统下WSL2+Ubuntu20.04的全流程安装指南](https://blog.csdn.net/Natsuago/article/details/145594631)

##  **Git 版本控制**

你需要 `Git`来克隆 WeClone 项目仓库。
不同的Linux平台可以选择不同的安装方式，你可以直接参考下面的这篇教程，选择适合你的方法

- [Git 安装配置 | 菜鸟教程](https://www.runoob.com/git/git-install-setup.html)

## **安装 uv (推荐的包管理器)**
`uv`是一个由 Astral 开发的快速 Python 包管理器。推荐使用 `uv` 创建虚拟环境并安装项目依赖，可以避免包版本冲突。

  在`WSL2`命令行或 `VSCode` 终端，使用 pip 安装 uv：

  ```bash
  pip install uv
  ```

> 注：项目尚未提供 `requirements.txt`，使用其他命令（如 `conda`）易导致依赖版本冲突。

## 虚拟环境搭建

1. **cuda安装**(已安装可跳过，**要求版本12.4及以上**)：[LLaMA Factory](https://llamafactory.readthedocs.io/zh-cn/latest/getting_started/installation.html#cuda)
   - **参考教程：**[WLS2安装CUDA保姆级教程_wsl2 cuda-CSDN博客](https://blog.csdn.net/qq_46472656/article/details/138624468)


2. **克隆 WeClone 项目：**
   打开 CMD 或 PowerShell，导航到你希望存放项目的目录，然后克隆仓库：

   ```bash
   git clone https://github.com/xming521/WeClone.git
   cd WeClone
   ```

   这里直接`git clone`可能会请求超时，例如`Failed to connect to github.com port 443 after 132282 ms: Connection timed out`。这是因为国内访问Github网络环境不稳定，需要科学上网。而`WSL2`的默认无法使用你Windows环境下的代理，因此

   这里需要单独为`WSL2 `设置代理。下面是一篇参考教程：

   - [为 WSL2 一键设置代理 - 知乎](https://zhuanlan.zhihu.com/p/153124468)

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


   <summary>如果失败在用下面方法：</summary>

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

   

9. **Linux编辑文件操作教程**（如果你不熟悉Linux的基本操作这可能会帮到你）

   在后续涉及到修改文件时候，可以采用以下两种方法：

   **方法1：VS Code（推荐）**

   通过**VS Code**连接你的`WSL`，让你在`IDE`下轻松修改和运行项目文件

   [开始通过 WSL 使用 VS Code | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/tutorials/wsl-vscode)

   **方法2：**

   如果你不想`VS Code`，可以直接采用`Linux`默认预装的命令行文本编辑器`nano`。在这个项目的使用中，你只需要记住下面几个命令就可用了。

   1. 在根目录下运行`nano`编辑器

      ```bash
      nano settings.jsonc 
      ```

   2. 移动光标到你要修改的位置，进行对应修改操作。

      `Ctrl + ^` 是标记开始（英文叫 "set mark"）；

      `Alt + 6` 是复制（保留内容），`Ctrl + K` 是剪切（删除原内容）；`Ctrl + U` 是粘贴(仅粘贴内部复制或剪切内容)；

      `鼠标右键`是粘贴外部内容。

   3. 修改后按 `Ctrl + O` 保存，按 `Enter` 确认；再按 `Ctrl + X` 退出。
---

**到这里，恭喜你完成了全部的环境配置。你已经完成了整个项目部署最难的部分！！！**