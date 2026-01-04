# Environment Setup

## Linux

1. Install CUDA (skip if already installed, **version 12.6 or higher required**): [LLaMA Factory Environment Installation Documentation](https://llamafactory.readthedocs.io/en/latest/getting_started/installation.html#cuda)

2. It is recommended to use [uv](https://docs.astral.sh/uv/) to install dependencies. This is a very fast Python environment manager. To install uv, refer to the [official uv documentation](https://docs.astral.sh/uv/getting-started/installation/).

3. After installing uv, use the following commands to create a new Python environment and install the dependencies:
```bash
git clone https://github.com/xming521/WeClone.git && cd WeClone
uv venv .venv --python=3.12
source .venv/bin/activate # On Windows, run .venv\Scripts\activate
uv pip install --group main -e . 
```

4. Copy the configuration file template and rename it to `settings.jsonc`. Subsequent configuration changes will be made in this file:
```bash
cp settings.template.jsonc settings.jsonc
```

> [!NOTE]
> All configurations for training, inference, etc., are unified in the `settings.jsonc` file.

5. Use the following command to test if the CUDA environment is correctly configured and can be recognized by PyTorch (for NVIDIA GPU users):
```bash
python -c "import torch; print('CUDA available:', torch.cuda.is_available());"
```

6. (Optional) Install **FlashAttention** to accelerate training and inference:
```bash
uv pip install flash-attn --no-build-isolation
```
> [!NOTE]
> For version issues, you can use the pre-built wheels from **FlashAttention**'s [prebuild-wheels](https://github.com/mjun0812/flash-attention-prebuild-wheels/releases).

## Windows

Running WeClone in a Windows environment has not been rigorously tested, and you cannot use local models to clean data. It is recommended to use WSL2 (with a GPU performance loss of about 5%). Please refer to the [WSL2 installation guide](https://learn.microsoft.com/en-us/windows/wsl/install).




**Congratulations, you have now completed the entire environment setup!**