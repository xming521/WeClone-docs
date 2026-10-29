# Model Inference and Testing

After fine-tuning, you can talk to your clone in the following ways. Inference parameters (`temperature`, `top_p` and so on) are set in `infer_args` of `settings.jsonc`.

## Browser demo

```bash
weclone-cli webchat-demo
```

This starts LLaMA Factory's Gradio page (port 7860) and opens it in your browser. Write the best inference parameters you find back to `infer_args` for later use.

The demo listens only on this machine and works in plaintext mode only. In encrypted mode, test with the API below and `test-model`.

## Inference through the API

WeClone serves an OpenAI-compatible `/v1` API for chat bot platforms and other applications.

1. **Start the server with the model loaded**

   ```bash
   weclone-cli server --inference --port 8005
   ```

   Without `--inference` the server only serves the web UI and loads no model. The API is at `http://127.0.0.1:8005/v1`. http://127.0.0.1:8005 on the same port is the WeClone web UI, and `/docs` holds the API documentation.

2. **Call the API**

   Requests without a signed-in session must use the token generated on the Bots page of the web UI as their API key (`Authorization: Bearer <token>`), see [Server and Bot Token](../chatbot/bot-token.md).

   ```bash
   curl http://127.0.0.1:8005/v1/chat/completions \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"model": "gpt-3.5-turbo", "messages": [{"role": "system", "content": "请你扮演一名人类，不要说自己是人工智能"}, {"role": "user", "content": "What are you up to?"}]}'
   ```

   The system prompt must match the `default_system` used in training.

## Testing with common chat questions

WeClone ships a set of everyday chat questions (none of them ask for personal information) to test the model in bulk. `test_model_args.test_data_path` selects the file: `dataset/eval/test_data-zh.json` for Chinese chats by default, `dataset/eval/test_data-en.json` for English chats.

1. Start the server with the command above, on port 8005.
2. Open a new terminal (with the virtual environment activated) and run:

   ```bash
   weclone-cli test-model
   ```

   It asks for the shared password. Results are written to `test_result-my.txt`.
