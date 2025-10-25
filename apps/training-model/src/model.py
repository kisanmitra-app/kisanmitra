import tensorflow as tf
from tensorflow import keras
from keras import layers, models

def create_efficient_model(input_shape=(224, 224, 3), num_classes=38):
    """
    Create a lightweight CNN model
    Uses MobileNetV2 as base - efficient for low GPU resources
    """
    
    # Load pre-trained MobileNetV2 (smaller, efficient model)
    base_model = keras.applications.MobileNetV2(
        input_shape=input_shape,
        include_top=False,
        weights='imagenet',
        alpha=0.75  # Reduced width multiplier for efficiency
    )
    
    # Freeze base model initially
    base_model.trainable = False
    
    # Build model
    model = models.Sequential([
        layers.Input(shape=input_shape),
        
        # Data augmentation layer (applied during training only)
        layers.RandomFlip('horizontal'),
        layers.RandomRotation(0.1),
        layers.RandomZoom(0.1),
        
        # Preprocessing - Use Lambda layer instead of direct function
        layers.Lambda(keras.applications.mobilenet_v2.preprocess_input),
        
        # Pre-trained base
        base_model,
        
        # Custom classifier
        layers.GlobalAveragePooling2D(),
        layers.BatchNormalization(),
        layers.Dropout(0.3),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.2),
        layers.Dense(num_classes, activation='softmax')
    ])
    
    return model, base_model


def create_simple_cnn(input_shape=(224, 224, 3), num_classes=38):
    """
    Alternative: Simple CNN from scratch (if you prefer custom architecture)
    """
    model = models.Sequential([
        layers.Input(shape=input_shape),
        
        # Data augmentation
        layers.RandomFlip('horizontal'),
        layers.RandomRotation(0.1),
        
        # Normalization
        layers.Rescaling(1./255),
        
        # Conv Block 1
        layers.Conv2D(32, 3, padding='same', activation='relu'),
        layers.BatchNormalization(),
        layers.MaxPooling2D(2),
        
        # Conv Block 2
        layers.Conv2D(64, 3, padding='same', activation='relu'),
        layers.BatchNormalization(),
        layers.MaxPooling2D(2),
        
        # Conv Block 3
        layers.Conv2D(128, 3, padding='same', activation='relu'),
        layers.BatchNormalization(),
        layers.MaxPooling2D(2),
        
        # Classifier
        layers.GlobalAveragePooling2D(),
        layers.Dropout(0.3),
        layers.Dense(256, activation='relu'),
        layers.Dropout(0.2),
        layers.Dense(num_classes, activation='softmax')
    ])
    
    return model


def unfreeze_base_model(base_model, num_layers=30):
    """
    Fine-tune the last few layers of base model
    """
    base_model.trainable = True
    
    # Freeze all layers except the last num_layers
    for layer in base_model.layers[:-num_layers]:
        layer.trainable = False
    
    print(f"Unfrozen last {num_layers} layers of base model")