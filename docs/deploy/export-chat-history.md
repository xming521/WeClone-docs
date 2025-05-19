# 使用 PyWxDump 提取微信聊天记录

要微调模型，首先你需要你的微信聊天数据。

## **下载并安装PyWxDump**

`PyWxDump`是一个用于提取微信聊天记录的工具。由于`PyWxDump`目前仅确认在Windows环境下正常运行，所有无论使用`WSL2`还是纯Windows环境部署的`WeClone`，这里都切换到**Windows环境**。

**在Windows环境下**访问 [PyWxDump GitHub 仓库](https://github.com/xaoyaoo/PyWxDump) 获取最新版本安装包。安装教程可直接参考[PyWxDump官方教程](https://github.com/xaoyaoo/PyWxDump/blob/master/doc/UserGuide.md)

## **导出数据**

* 根据 PyWxDump 的指南，运行软件并解密你的微信数据库
* 在 PyWxDump 中选择“聊天备份”功能
* 导出类型选择 CSV
* 你可以选择导出与多个联系人或群聊的聊天记录（当前版本不建议使用群聊记录）

## **整理数据**

* PyWxDump 导出的 CSV 文件通常位于其运行目录下的 `wxdump_tmp/export` 文件夹中。

* 将整个 `csv` 文件夹 (其中可能包含多个代表不同聊天对象的子文件夹，每个子文件夹里是对应的聊天记录CSV文件) **移动或复制**到 WeClone 项目的 `./dataset/` 目录下。

* 因为`WSL2`和`Windows`环境实际上是互通的，对于使用`WSL2`部署的用户可使用以下命令将`Windows`环境下的文件复制到`WSL2`的项目目录下：

  ```bash
  cp -r /mnt/你的PyWxDump/csv ./dataset/ #在WeClone根目录下执行该命令
  #例如：
  cp -r /mnt/d/Desktop/Just_for_fun/wxdump_work/export/wxid_wk5iejbp9ma322/csv ./dataset/
  ```

* 最终的目录结构应类似于：`WeClone/dataset/csv/张三/聊天记录.csv` 等。

  

<details><summary><strong>PyWxDump操作流程图解</strong></summary><br>
<p align="center">
  <img src="https://blog-img.051088.xyz/pywxdump%E6%95%99%E7%A8%8B0.png" width="90%"/>
</p>
<p align="center">
  <img src="https://blog-img.051088.xyz/pywxdump%E6%95%99%E7%A8%8B1.png" width="90%"/>
</p>
<p align="center">
  <img src="https://blog-img.051088.xyz/pywxdump%E6%95%99%E7%A8%8B3.png" width="90%"/>
</p>
<p align="center">
  <img src="https://blog-img.051088.xyz/pywxdump%E6%95%99%E7%A8%8B4.png" width="90%"/>
</p>
<p align="center">
  <img src="https://blog-img.051088.xyz/pywxdump%E6%95%99%E7%A8%8B002.png" width="90%"/>
</p>
<p align="center">
  <img src="https://blog-img.051088.xyz/pywxdump%E6%95%99%E7%A8%8B001.png" width="90%"/>
</p>
</details>