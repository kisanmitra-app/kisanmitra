import os
import sys
import tensorflow as tf
from tensorflow import keras
from keras import layers
import tensorflowjs as tfjs
import json


def check_dataset_exists(data_dir):
    """Check if dataset directory exists and contains subdirectories"""
    if not os.path.exists(data_dir):
        print(f"Error: Dataset directory '{data_dir}' does not exist!")
        return False
    
    if not os.path.isdir(data_dir):
        print(f"Error: '{data_dir}' is not a directory!")
        return False
    
    # Check if directory has subdirectories (classes)
    subdirs = [d for d in os.listdir(data_dir) 
               if os.path.isdir(os.path.join(data_dir, d))]
    
    if len(subdirs) == 0:
        print(f"Error: No class subdirectories found in '{data_dir}'!")
        return False
    
    print(f"Dataset directory found with {len(subdirs)} classes")
    return True


def create_model(num_classes, input_shape=(224, 224, 3)):
    """Create CNN model for crop disease classification"""
    inputs = keras.Input(shape=input_shape)
    
    # Only include rescaling in the model
    x = layers.Rescaling(1./255)(inputs)
    
    # Convolutional blocks
    x = layers.Conv2D(32, 3, padding='same', activation='relu')(x)
    x = layers.BatchNormalization()(x)
    x = layers.Conv2D(32, 3, padding='same', activation='relu')(x)
    x = layers.MaxPooling2D()(x)
    x = layers.Dropout(0.25)(x)
    
    x = layers.Conv2D(64, 3, padding='same', activation='relu')(x)
    x = layers.BatchNormalization()(x)
    x = layers.Conv2D(64, 3, padding='same', activation='relu')(x)
    x = layers.MaxPooling2D()(x)
    x = layers.Dropout(0.25)(x)
    
    x = layers.Conv2D(128, 3, padding='same', activation='relu')(x)
    x = layers.BatchNormalization()(x)
    x = layers.Conv2D(128, 3, padding='same', activation='relu')(x)
    x = layers.MaxPooling2D()(x)
    x = layers.Dropout(0.3)(x)
    
    x = layers.Conv2D(256, 3, padding='same', activation='relu')(x)
    x = layers.BatchNormalization()(x)
    x = layers.MaxPooling2D()(x)
    x = layers.Dropout(0.3)(x)
    
    # Dense layers
    x = layers.Flatten()(x)
    x = layers.Dense(512, activation='relu', kernel_regularizer=keras.regularizers.l2(0.001))(x)
    x = layers.Dropout(0.5)(x)
    x = layers.Dense(256, activation='relu', kernel_regularizer=keras.regularizers.l2(0.001))(x)
    x = layers.Dropout(0.5)(x)
    outputs = layers.Dense(num_classes, activation='softmax')(x)
    
    return keras.Model(inputs=inputs, outputs=outputs)


def augment(image, label, data_augmentation):
    """Apply data augmentation"""
    return data_augmentation(image, training=True), label


def main():
    """Main training function"""
    # Configuration
    IMAGE_SIZE = (224, 224)
    BATCH_SIZE = 16
    EPOCHS = 1
    DATA_DIR = './data/PlantVillage'
    MODEL_DIR = './models'
    
    print("TensorFlow version:", tf.__version__)
    print("Num GPUs Available:", len(tf.config.list_physical_devices('GPU')))
    
    # Check if dataset exists
    if not check_dataset_exists(DATA_DIR):
        print("\n💡 Tip: Make sure your dataset is organized as:")
        print("   ./data/PlantVillage/")
        print("   ├── class1/")
        print("   │   ├── image1.jpg")
        print("   │   └── image2.jpg")
        print("   └── class2/")
        print("       ├── image1.jpg")
        print("       └── image2.jpg")
        sys.exit(1)
    
    # Create models directory if it doesn't exist
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    # Load dataset
    print("\nLoading datasets...")
    train_ds = tf.keras.utils.image_dataset_from_directory(
        DATA_DIR,
        validation_split=0.2,
        subset="training",
        seed=123,
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE
    )
    
    val_ds = tf.keras.utils.image_dataset_from_directory(
        DATA_DIR,
        validation_split=0.2,
        subset="validation",
        seed=123,
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE
    )
    
    class_names = train_ds.class_names
    num_classes = len(class_names)
    print(f"Found {num_classes} classes: {class_names[:5]}..." if len(class_names) > 5 else f"Found {num_classes} classes: {class_names}")
    
    # Data augmentation
    data_augmentation = keras.Sequential([
        layers.RandomFlip("horizontal"),
        layers.RandomRotation(0.1),
        layers.RandomZoom(0.1),
    ])
    
    # Apply augmentation to training data only
    train_ds = train_ds.map(
        lambda x, y: augment(x, y, data_augmentation), 
        num_parallel_calls=tf.data.AUTOTUNE
    )
    train_ds = train_ds.cache().prefetch(buffer_size=tf.data.AUTOTUNE)
    val_ds = val_ds.cache().prefetch(buffer_size=tf.data.AUTOTUNE)
    
    # Create model
    print("\nBuilding model...")
    model = create_model(num_classes)
    
    model.compile(
        optimizer=keras.optimizers.Adam(0.001),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    model.summary()
    
    # Callbacks
    callbacks = [
        keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=10,
            restore_best_weights=True
        ),
        keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=5,
            min_lr=1e-7
        ),
        keras.callbacks.ModelCheckpoint(
            f'{MODEL_DIR}/best_model.h5',
            monitor='val_accuracy',
            save_best_only=True
        )
    ]
    
    # Train
    print("\nStarting training...")
    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=EPOCHS,
        callbacks=callbacks
    )
    
    # Save model
    print("\nSaving model in Keras format...")
    model.save(f'{MODEL_DIR}/last_model.h5')
    
    # Convert to TensorFlow.js format (commented out by default)
    # print("\n🔄 Converting to TensorFlow.js format...")
    # tfjs.converters.save_keras_model(model, f'{MODEL_DIR}/crop-disease-detector')
    
    # Save class names
    print("Saving class names and metadata...")
    with open(f'{MODEL_DIR}/disease-classes.json', 'w') as f:
        json.dump(class_names, f, indent=2)
    
    # Save metadata
    metadata = {
        'num_classes': num_classes,
        'image_size': IMAGE_SIZE,
        'model_type': 'crop_disease_classifier',
        'class_names': class_names
    }
    with open(f'{MODEL_DIR}/metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print("\nModel trained and saved successfully!")
    print(f"Final validation accuracy: {max(history.history['val_accuracy']):.2%}")
    print(f"Models saved in: {MODEL_DIR}/")


if __name__ == "__main__":
    main()
