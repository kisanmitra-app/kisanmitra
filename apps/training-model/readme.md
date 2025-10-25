# Plant Disease Classification with CNN

A CNN model to identify plant diseases

### Setup Python Environment

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Download Dataset

1. Go to [Kaggle Plant Village Dataset](https://www.kaggle.com/datasets/emmarex/plantdisease)
2. Download and extract to `../dataset/plant_disease/`

### Train the Model

```bash
# Start training
python src/app.py
```

**Training Process:**

- **Phase 1**: Initial training with frozen base (10 epochs) - ~15-20 mins
- **Phase 2**: Fine-tuning (10 epochs) - ~15-20 mins
- **Total Time**: ~30-40 minutes on M2 Mac

**Expected Results:**

- Validation Accuracy: 90-95%
- Model Size: ~15-20 MB

## Model Architecture

**Transfer Learning (Default)**

- Base: MobileNetV2 (α=0.75)
- Custom classifier with dropout
- Data augmentation layers
- Total params: ~2.5M

## Configuration

Edit `CONFIG` in `src/app.py`:

```python
CONFIG = {
    'batch_size': 16,        # Reduce if out of memory
    'epochs_initial': 10,    # Increase for better accuracy
    'epochs_finetune': 10,
    'img_size': (224, 224),  # Don't change (optimized)
}
```
