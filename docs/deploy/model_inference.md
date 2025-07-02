# 模型推理与测试

微调完成后，你可以通过以下几种方式与你的数字分身进行交互。

## 使用浏览器 Demo 简单推理

```bash
weclone-cli webchat-demo
```

脚本会启动一个本地 Web 服务 (通常在 `http://127.0.0.1:7860`)，你可以在浏览器中打开它进行对话。在这里测试出的最佳推理参数（如 `temperature`, `top_p`）可以更新回 `settings.jsonc` 的 `infer_args` 部分，供后续使用。

## 使用 API 接口进行推理

WeClone 提供了一个 API 服务，可以供其他应用程序调用。

1. **启动 API 服务：**

   ```bash
   weclone-cli server
   ```

   服务启动后，通常会监听在 `http://127.0.0.1:8005/v1` 。

2. **通过 API 调用：**
   你可以使用任何 HTTP客户端向该 API 发送请求。API 兼容 OpenAI 的格式。

## 使用常见聊天问题测试

项目还提供了一个脚本，可以使用预设的问题列表来测试模型。修改`test_model_args`参数，可以修改测试问题文件。

1. 确保 API 服务 (`weclone-cli server`) 正在运行。

2. 打开一个新的命令行窗口 (并激活虚拟环境)，然后运行：

   ```bash
   weclone-cli test-model
   ```
   测试结果会输出到 `test_result-my.txt`。