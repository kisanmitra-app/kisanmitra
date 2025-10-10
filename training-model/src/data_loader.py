import tensorflow as tf
from pathlib import Path
import json

def create_datasets(data_dir, img_size=(224, 224), batch_size=32, validation_split=0.2):
    """
    Create train and validation datasets from directory
    Optimized for M2 Mac with efficient data loading
    
    Expects structure:
    data_dir/
        class1/
            image1.jpg
            image2.jpg
        class2/
            ...
    """
    data_path = Path(data_dir)
    
    # Check if data_dir exists
    if not data_path.exists():
        raise FileNotFoundError(f"Data directory not found: {data_dir}")
    
    # Load training data (will split from all data)
    train_ds = tf.keras.utils.image_dataset_from_directory(
        data_path,
        validation_split=validation_split,
        subset='training',
        seed=123,
        image_size=img_size,
        batch_size=batch_size,
        label_mode='categorical'
    )
    
    # Load validation data
    val_ds = tf.keras.utils.image_dataset_from_directory(
        data_path,
        validation_split=validation_split,
        subset='validation',
        seed=123,
        image_size=img_size,
        batch_size=batch_size,
        label_mode='categorical'
    )
    
    # Get class names
    class_names = train_ds.class_names
    
    # Performance optimization for M2
    AUTOTUNE = tf.data.AUTOTUNE
    
    train_ds = train_ds.cache().prefetch(buffer_size=AUTOTUNE)
    val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)
    
    return train_ds, val_ds, class_names


def create_test_dataset(data_dir, img_size=(224, 224), batch_size=32):
    """
    Create test dataset if separate test folder exists
    """
    test_path = Path(data_dir) / 'test'
    
    if not test_path.exists():
        print("No test directory found, skipping test dataset creation")
        return None
    
    test_ds = tf.keras.utils.image_dataset_from_directory(
        test_path,
        image_size=img_size,
        batch_size=batch_size,
        label_mode='categorical',
        shuffle=False
    )
    
    AUTOTUNE = tf.data.AUTOTUNE
    test_ds = test_ds.cache().prefetch(buffer_size=AUTOTUNE)
    
    return test_ds


def save_class_names(class_names, save_path='models/class_names.json'):
    """
    Save class names for later use in Node.js
    """
    Path(save_path).parent.mkdir(parents=True, exist_ok=True)
    
    class_mapping = {i: name for i, name in enumerate(class_names)}
    
    with open(save_path, 'w') as f:
        json.dump(class_mapping, f, indent=2)
    
    print(f"Class names saved to {save_path}")


def get_dataset_info(train_ds, val_ds):
    """
    Print dataset information
    """
    train_batches = tf.data.experimental.cardinality(train_ds).numpy()
    val_batches = tf.data.experimental.cardinality(val_ds).numpy()
    
    batch_size = None
    num_classes = None
    
    for images, labels in train_ds.take(1):
        batch_size = images.shape[0]
        num_classes = labels.shape[1]
    
    print(f"\nDataset Information:")
    print(f"Training batches: {train_batches}")
    print(f"Validation batches: {val_batches}")
    print(f"Batch size: {batch_size}")
    print(f"Number of classes: {num_classes}")
    print(f"Approx. training samples: {train_batches * batch_size}")
    print(f"Approx. validation samples: {val_batches * batch_size}")
    
    return num_classes