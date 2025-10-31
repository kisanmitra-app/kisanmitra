# Kisan Mitra - Trained Models & Datasets

This directory contains trained machine learning models, datasets, and prediction outputs for plant disease classification.

## Overview

The models directory stores the trained CNN models, class mappings, training artifacts, and datasets used for plant disease identification. These files are used by the workers service to perform real-time disease detection.

## Directory Structure

```
models/
├── plant_disease_model.keras      # Main trained model (final)
├── checkpoint.keras               # Best checkpoint during training
├── class_names.json               # Disease class mappings
├── training_history.png           # Training metrics visualization
├── dataset/                       # Training dataset
│   ├── readme.md
│   ├── plant_disease/            # PlantVillage dataset
│   │   ├── Pepper__bell___Bacterial_spot/
│   │   ├── Tomato__Target_Spot/
│   │   ├── Tomato__Tomato_mosaic_virus/
│   │   └── ... (38 classes total)
│   └── samples/                  # Sample test images
└── predictions/                  # Prediction outputs
    └── pred_test-1.png          # Example predictions
```

## Model Files

### plant_disease_model.keras

**Description**: The final trained model ready for production use.

**Details:**

- **Architecture**: MobileNetV2 (transfer learning)
- **Input Size**: 224×224×3 (RGB images)
- **Output**: 38 disease classes
- **File Size**: ~15-20 MB
- **Format**: Keras 3.0 format
- **Accuracy**: 90-95% on validation set

**Usage:**

```python
import tensorflow as tf

# Load model
model = tf.keras.models.load_model('models/plant_disease_model.keras')

# Make prediction
prediction = model.predict(image_array)
```

### checkpoint.keras

**Description**: Best model checkpoint saved during training.

**Details:**

- Saved based on validation accuracy
- Used as a backup/rollback point
- Can be used if final model has issues

### class_names.json

**Description**: Mapping of class indices to disease names.

**Format:**

```json
[
  "Pepper__bell___Bacterial_spot",
  "Potato___Late_blight",
  "Tomato__Target_Spot",
  ...
]
```

**Usage:**

```python
import json

with open('models/class_names.json', 'r') as f:
    class_names = json.load(f)

# Get disease name from prediction
predicted_class = class_names[prediction_index]
```

## Dataset

### PlantVillage Dataset

**Source**: [Kaggle PlantVillage Dataset](https://www.kaggle.com/datasets/emmarex/plantdisease)

**Details:**

- **Total Images**: ~54,000+
- **Number of Classes**: 38
- **Image Format**: JPG
- **Image Size**: Variable (resized to 224×224 for training)
- **Plants Covered**: Tomato, Potato, Pepper/Bell Pepper

### Retraining the Model

To retrain with new data or improved parameters:

```bash
cd apps/training-model

# Activate virtual environment
source venv/bin/activate

# Update CONFIG in src/app.py if needed

# Start training
python src/app.py
```

The new model will be saved in the `models/` directory.
