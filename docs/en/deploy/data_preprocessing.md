# Data Preprocessing

- First, modify the `language`, `platform`, and `include_type` in the configuration file as needed.
- WeClone first filters personal privacy information and uses Microsoft Presidio for PII (Personally Identifiable Information) data anonymization.

* **Default Filtering:** By default, PII such as `phone numbers, email addresses, credit card numbers, IP addresses, geographic location names, international bank account numbers, cryptocurrency wallet addresses, age information, and universal ID numbers` are removed from the data, but 100% identification is not guaranteed.
* **Custom Filtering:** The project provides a `blocked_words` parameter. You can customize a list of forbidden words and phrases (entire sentences containing forbidden words will be filtered out and will not appear in the training data).

### **Execute the preprocessing script**

Activate the virtual environment and run the following command in the WeClone project root directory:
```bash
weclone-cli make-dataset
```
### Related Parameters
📌 **Chat Habits** <br>
You can modify the `single_combine_time_window` and `qa_match_time_window` parameters based on your message reply frequency. Currently, a time window strategy is supported. Consecutive single-person messages are combined into one sentence using a symbol (`,` for Chinese, `|` for English) based on the `single_combine_time_window` parameter, and question-answer pairs are matched based on the `qa_match_time_window` parameter.

📌 **Training Multimodal Large Models** <br>
Enable this by adding `images` to `include_type`, and control the number and size of images with the `image_max_pixels` and `max_image_num` parameters to reduce memory usage.

📌 **Image to Text** <br>
Add `images` to `include_type` and configure the `vision_api` parameter to use an external multimodal model to convert images to text. The final generated dataset **is still used to train a text-only language model**.

📌 **Data Cleaning** <br>
You can enable the `enable_clean` option in `clean_dataset` to clean the data for better results (multimodal data is not yet supported).
Currently, it supports scoring chat records using `llm judge`, providing both **vllm offline inference** and **API online inference**. Offline inference is the default. You can enable API online inference mode by changing `"online_llm_clear": false` to `true` in the `settings.jsonc` file and configuring the corresponding `base_url`, `llm_api_key`, `model_name`, and other parameters. All models compatible with the OpenAI interface can be connected.


## 💡 Notes on using vLLM

If you choose to use **vLLM for offline inference** and have limited video memory, you need to enable **vLLM's `bitsandbytes` quantization loading**, otherwise this step may also cause an out-of-memory error. For further adjustments and optimization of `vllm` parameters, please refer to the [vLLM Engine Arguments](https://docs.vllm.ai/en/latest/serving/engine_args.html#engine-args)

Configure the vLLM engine parameter `vllm_args` in the configuration file:
```json
...
"vllm_args": {
    "gpu_memory_utilization": 0.9,
    "quantization": "bitsandbytes", // Whether to enable vLLM's bitsandbytes quantization loading
    "load_format": "bitsandbytes"
    ...
    },
...
```
>[!TIP]
> If you encounter the error `ImportError: Please install bitsandbytes>=0.45.3`, you can try reinstalling `bitsandbytes`:
> ```bash
> uv pip install bitsandbytes>=0.39.0
> ```

* If you are using an older GPU (for example, an NVIDIA GPU with a Compute Capability below 8.0, such as the Tesla T4, V100, GTX 10xx/20xx series, etc.), you may encounter the following error:

  ```bash
  ValueError: Bfloat16 is only supported on GPUs with compute capability of at least 8.0. Your xxx GPU has compute capability xx. You can use float16 instead by explicitly setting the idtype flag in CLI, for ecample: --dtype=half.
  ```

  In this case, you can try adding `--dtype=half` to your original `CLI` command and re-executing it:

  ```bash
  weclone-cli make-dataset --dtype=half
  ```