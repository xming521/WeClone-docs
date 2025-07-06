# Model Inference and Testing

After fine-tuning is complete, you can interact with your digital avatar in the following ways.

## Simple Inference with a Browser Demo

```bash
weclone-cli webchat-demo
```

The script will start a local web service (usually at `http://127.0.0.1:7860`), which you can open in your browser to have a conversation. The optimal inference parameters (such as `temperature`, `top_p`) found here can be updated back to the `infer_args` section of `settings.jsonc` for future use.

## Inference using the API Interface

WeClone provides an API service that can be called by other applications, such as chatbot platforms.

1. **Start the API service**

   ```bash
   weclone-cli server
   ```

   After the service starts, it will usually listen on `http://127.0.0.1:8005/v1`.

2. **Call via API**
   <br>
   You can use any HTTP client to send requests to this API.<br>
   The API is compatible with the OpenAI format.

## Testing with Common Chat Questions

The project also provides a script to test the model with a preset list of questions. You can modify the test question file by changing the `test_model_args` parameter.

1. Make sure the API service (`weclone-cli server`) is running.

2. Open a new command line window (and activate the virtual environment), then run:

   ```bash
   weclone-cli test-model
   ```
   The test results will be output to `test_result-my.txt`.