# 模型推理与测试

微调完成后，你可以通过以下几种方式与你的数字分身对话。推理参数（`temperature`、`top_p` 等）在 `settings.jsonc` 的 `infer_args` 中设置。

## 使用浏览器 Demo 简单推理

```bash
weclone-cli webchat-demo
```

脚本会启动 LLaMA Factory 的 Gradio 网页（端口 7860）并自动在浏览器中打开。在这里测试出的最佳推理参数可以写回 `infer_args`，供后续使用。

这个 Demo 只监听本机，只能在明文模式下使用。加密模式下请改用下面的 API 接口和 `test-model` 测试。

## 使用 API 接口进行推理

WeClone 提供 OpenAI 兼容的 `/v1` 接口，供聊天机器人平台等其他应用调用。

1. **启动服务并加载模型**

   ```bash
   weclone-cli server --inference --port 8005
   ```

   不加 `--inference` 时服务只提供网页，不加载模型。接口地址为 `http://127.0.0.1:8005/v1`，同一端口上的 http://127.0.0.1:8005 也是 WeClone 网页，`/docs` 是接口文档。

2. **调用接口**

   不带登录状态的请求必须使用网页「机器人接入」页生成的令牌作为 API Key（`Authorization: Bearer <令牌>`），见[启动服务与令牌](../chatbot/bot-token.md)。

   ```bash
   curl http://127.0.0.1:8005/v1/chat/completions \
     -H "Authorization: Bearer <令牌>" \
     -H "Content-Type: application/json" \
     -d '{"model": "gpt-3.5-turbo", "messages": [{"role": "system", "content": "请你扮演一名人类，不要说自己是人工智能"}, {"role": "user", "content": "在干嘛"}]}'
   ```

   系统提示词要与训练时的 `default_system` 一致。

## 使用常见聊天问题测试

项目提供了一组常见的日常聊天问题（不包含询问个人信息的问题），用来批量测试模型。问题文件由 `test_model_args.test_data_path` 指定，中文聊天默认 `dataset/eval/test_data-zh.json`，英文聊天可以改为 `dataset/eval/test_data-en.json`。

1. 用上面的命令启动服务，端口必须是 8005。
2. 打开一个新的终端（并激活虚拟环境），运行：

   ```bash
   weclone-cli test-model
   ```

   运行时需要输入共用密码。测试结果写入 `test_result-my.txt`。
