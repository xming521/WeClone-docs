# 环境配置 （Windows 系统）

要在 `Windows` 上顺利运行 WeClone，我们需要先搭建好相应的环境。由于现在的`数据清洗`使用`vllm`加速推理，而`vllm`目前仅支持`Linux`系统，所以对`Windows`用户而言，要么使用虚拟机/WSL2，要么选择卸载`vllm`，并舍弃掉`数据清洗`功能。具体操作步骤如下：

##  **Git 版本控制**

你需要 `Git` 来克隆 WeClone 项目仓库。
从 [Git for Windows](https://gitforwindows.org/) 下载并安装。你可以参考下面这篇教程：

- [windows安装git（全网最详细，保姆教程）-CSDN博客](https://blog.csdn.net/weixin_42242910/article/details/136297201)

## **安装 uv (推荐的包管理器)**
`uv`是一个由 Astral 开发的快速 Python 包管理器。推荐使用 `uv` 创建虚拟环境并安装项目依赖，可以避免包版本冲突。

  打开命令提示符 (CMD) 或 PowerShell，使用 pip 安装 uv：

  ```bash
  pip install uv
  ```
  
> 注：项目尚未提供 `requirements.txt`，使用其他命令（如 `conda`）易导致依赖版本冲突。

## 虚拟环境搭建

1. **cuda安装**(已安装可跳过，**要求版本12.4及以上**)：[LLaMA Factory](https://llamafactory.readthedocs.io/zh-cn/latest/getting_started/installation.html#cuda)
   - **参考教程：**[CUDA与CUDNN在Windows下的安装与配置（超级详细版）_windows安装cudnn-CSDN博客](https://blog.csdn.net/YYDS_WV/article/details/137825313)


2. **克隆 WeClone 项目：**
   打开 CMD 或 PowerShell，导航到你希望存放项目的目录，然后克隆仓库：

   ```bash
   git clone https://github.com/xming521/WeClone.git
   cd WeClone
   ```

3. **创建并激活虚拟环境 (使用 uv)：**
   在 `WeClone` 项目根目录下执行：

   ```bash
   uv venv .venv --python=3.10  # 你可以指定已安装的 Python 3.10+ 版本
   .venv\Scripts\activate
   ```

   激活成功后，你的命令行提示符前通常会显示 `(.venv)`。

4. **（直接跳过）手动安装 `pytorch`**（现在已经不需要了，WeClone的pyproject.toml默认使用了清华源）

   <details>
     <summary>手动安装 PyTorch 参考教程</summary>
     <p>由于国内环境，和其他包一起安装 PyTorch 大概率会出错，所以最好先在环境内安装好 PyTorch。推荐从一些国内镜像源下载好 PyTorch 安装包后在本地离线安装。可以参考下面的教程，但是注意教程中使用的是下载官方包的链接，需要替换成国内镜像源的对应网站。</p>
     <p><strong>参考教程：</strong><a href="https://blog.csdn.net/weixin_44956153/article/details/142303905" target="_blank">PyTorch 离线版本安装教程</a></p>
   </details>

5. **安装项目主要依赖：**

   ```bash
   uv pip install --group main -e .
   ```

   此命令将读取项目中依赖配置并安装所有库。~~（如果项目担心重复安装torch，你可以考虑临时将其注释掉或在安装时用 pip 避免重复安装）。~~

6. **测试 CUDA 环境 (NVIDIA GPU 用户)：**
   安装完依赖后（特别是 PyTorch），运行以下命令测试 CUDA 是否配置正确并能被 PyTorch 识别：

   ```bash
   python -c "import torch; print('CUDA是否可用:', torch.cuda.is_available()); print('CUDA版本:', torch.version.cuda); print('PyTorch版本:', torch.__version__)"
   ```

   如果 `CUDA是否可用:` 显示 `True`，则表示配置成功。

7. **复制配置文件模板**

   将配置文件模板复制一份并重命名为`settings.jsonc`，后续配置修改在此文件进行：

   ```cmd
   copy settings.template.jsonc settings.jsonc 
   ```

8. **(可选) 安装 FlashAttention**
   为了加速训练和推理（如果你的硬件支持），可以尝试安装 FlashAttention。

   参考教程：[Windows环境下flash-attention安装_flashattention2 windows 安装-CSDN博客](https://blog.csdn.net/qq_21491605/article/details/136109125)

   > [!NOTE] FlashAttention 在 Windows 上安装较复杂，且并非所有显卡支持，如遇失败可跳过，项目仍可运行，只是推理速度稍慢。

9. **（适用于 0.2.1 ~ 0.2.2 版本）禁用 vLLM 功能模块**

   从 **0.2.1** 版本开始，WeClone 项目引入了 `vLLM` 模块，但由于 `vLLM` **不支持 Windows 环境**，为避免报错，需要手动禁用相关功能。

   > ✅ **0.2.21 及以上版本**已在 `pyproject.toml` 中添加自动环境检测，无需手动操作，**可忽略本指南**。

   如果你当前使用的是 **0.2.1 \~ 0.2.2** 的旧版本，可选择以下任一方法：

   

   **方法一（推荐，最简单）：**

   ```bash
   git pull https://github.com/xming521/WeClone.git  # 拉取最新代码
   uv pip uninstall vllm                             # 卸载 vLLM 模块
   ```

   <details>
   <summary><strong>方法二（不再推荐）</strong></summary>


   - 注释掉 vLLM 引用

   打开 `WeClone/weclone/data/clean/strategies.py`，将 `vLLM` 的导入语句注释掉：

   ```python
   # from weclone.core.inference.vllm_infer import infer as infer  # 注释此行
   ```

   完整的导入部分如下（供参考）：

   ```python
   import json
   import pandas as pd
   from abc import ABC, abstractmethod
   from dataclasses import dataclass
   from typing import Any, Dict, List, Union
   from langchain_core.prompts import PromptTemplate
   from weclone.data.models import QaPair, CutMessage, QaPairScore
   from weclone.prompts.clean_data import CLEAN_PROMPT
   # from weclone.core.inference.vllm_infer import infer as infer
   from weclone.utils.log import logger
   ```

   - **禁用数据清洗功能**

   打开配置文件 `settings.jsonc`，修改 `clean_dataset` 配置项：

   ```json
   "clean_dataset": {
       "enable_clean": false,  // 将 true 改为 false，禁用数据清洗
       "clean_strategy": "llm",
       "llm": {
           "accept_score": 2  // 可接受的 LLM 打分阈值（1分最差，5分最好）
       }
   }
   ```

   - **屏蔽 llamafactory 自动加载 vLLM**

   `llamafactory` 导入时可能尝试加载 `vllm_engine`，在 Windows 上会报错。为避免问题，在以下文件最顶部添加 mock 脚本：

   * `WeClone/weclone/eval/web_demo.py`
   * `WeClone/weclone/server/api_service.py`

   插入如下代码（必须放在文件开头、其他导入语句之前）：

   ```python
   import sys
   import types
   from unittest.mock import MagicMock
   
   fake_vllm_engine = types.ModuleType('vllm_engine')
   fake_vllm_engine.VllmEngine = MagicMock
   sys.modules['llamafactory.chat.vllm_engine'] = fake_vllm_engine
   
   # 以下为原始文件的其他代码
   ```

   </details>

---

**到这里，恭喜你完成了全部的环境配置。你已经完成了整个项目部署最难的部分！！！**