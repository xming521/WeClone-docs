# Installation

## What to install

| Use | Install | Also needs |
|---|---|---|
| Life portrait, web UI, assistants | `uv pip install -e .` | Codex CLI or any OpenAI-compatible API. No GPU |
| Speaking style (`build-profile --purpose clone`) | `uv pip install --group style --torch-backend cpu -e .` | The LTP model, runs on CPU |
| Fine-tuned clone | `uv pip install --group main -e .` | NVIDIA GPU, CUDA 12.6 or later, a spaCy model |

## Base install

Python 3.12 is required. [uv](https://docs.astral.sh/uv/) is recommended for the environment, see the [uv documentation](https://docs.astral.sh/uv/getting-started/installation/) to install it.

```bash
git clone https://github.com/xming521/WeClone.git && cd WeClone
uv venv .venv --python=3.12
source .venv/bin/activate   # Windows: .venv\Scripts\activate
uv pip install -e .
cp settings.template.jsonc settings.jsonc
```

> [!NOTE]
> All settings live in `settings.jsonc`, described in [Configuration File](../config/weclone-config.md). Use `weclone-cli --config-path <file>` or the `WECLONE_CONFIG_PATH` environment variable to point to another file.

## Model backend

Portrait extraction, memory organization and domain summaries call API models. `agent_distill_args.llm_provider` selects the backend:

- `codex_exec` (default): calls models through the local [Codex CLI](https://github.com/openai/codex), which must be installed and signed in. Set the model, reasoning effort and concurrency in `codex_exec_args`.
- `api`: any OpenAI-compatible API. Put the URL, key and model name in `base_url`, `llm_api_key` and `model_name` of `make_dataset_args`, and concurrency, timeout and output limit in `batch_size`, `timeout` and `max_tokens` of `agent_distill_args`. `build-profile` then needs `--max-context-tokens` with the model's input limit.

```json
"agent_distill_args": {
    "llm_provider": "api",
    "batch_size": 10,
    "timeout": 120
},
"make_dataset_args": {
    "base_url": "https://xxx/v1",
    "llm_api_key": "xxxxx",
    "model_name": "xxx",
    ...
}
```

> [!WARNING]
> While your portrait is built, chat content is sent to the chosen model service. The command line shows the backend and asks you to confirm first.

## Speaking style dependencies

Needed only for the clone purpose (`build-profile --purpose clone`):

```bash
uv pip install --group style --torch-backend cpu -e .
hf download LTP/base --local-dir models/LTPbase
```

[LTP](https://github.com/HIT-SCIR/ltp) handles Chinese word segmentation and parsing and runs on CPU by default. `--torch-backend cpu` installs the CPU build of PyTorch, so CUDA isn't needed.

## Fine-tuning dependencies

1. Install CUDA 12.6 or later (skip if already installed), see the [LLaMA Factory installation guide](https://llamafactory.readthedocs.io/en/latest/getting_started/installation.html#cuda).
2. Install the fine-tuning dependencies and the spaCy model used for privacy filtering (`en_core_web_sm` for English chats):
   ```bash
   uv pip install --group main -e .
   uv pip install https://github.com/explosion/spacy-models/releases/download/zh_core_web_sm-3.8.0/zh_core_web_sm-3.8.0-py3-none-any.whl
   ```
3. Check that PyTorch sees CUDA (NVIDIA GPU users):
   ```bash
   python -c "import torch; print('CUDA available:', torch.cuda.is_available())"
   ```
4. (Optional) Install **FlashAttention** to speed up training and inference:
   ```bash
   uv pip install flash-attn --no-build-isolation
   ```
   For version mismatches, use the [prebuild-wheels](https://github.com/mjun0812/flash-attention-prebuild-wheels/releases).

## Windows

Windows has not been rigorously tested. vLLM supports Linux only, so training data can't be cleaned with a local model on Windows. WSL2 is recommended (about 5% GPU performance loss), see the [WSL2 installation guide](https://learn.microsoft.com/en-us/windows/wsl/install).
