import tensorflow as tf
from pathlib import Path
import matplotlib.pyplot as plt
import warnings
from urllib3.exceptions import NotOpenSSLWarning
from model import create_efficient_model, unfreeze_base_model
from data_loader import (
    create_datasets, 
    create_test_dataset, 
    save_class_names, 
    get_dataset_info
)

warnings.filterwarnings('ignore', category=NotOpenSSLWarning)


# Enable GPU acceleration
print("TensorFlow version:", tf.__version__)
print("GPU Available:", len(tf.config.list_physical_devices('GPU')) > 0)

# Configuration
CONFIG = {
    'data_dir': './dataset/plant_disease',  # Updated path
    'img_size': (224, 224),
    'batch_size': 16,  # Smaller batch 
    'epochs_initial': 1,  # Initial training with frozen base
    'epochs_finetune': 1,  # Fine-tuning epochs
    'learning_rate_initial': 0.001,
    'learning_rate_finetune': 0.0001,
    'model_save_path': '../models/saved_model',
    'use_transfer_learning': True  # Set False for simple CNN
}


def plot_training_history(history, save_path='models/training_history.png'):
    """
    Plot training metrics
    """
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
    
    # Accuracy
    ax1.plot(history.history['accuracy'], label='Train Accuracy')
    ax1.plot(history.history['val_accuracy'], label='Val Accuracy')
    ax1.set_title('Model Accuracy')
    ax1.set_xlabel('Epoch')
    ax1.set_ylabel('Accuracy')
    ax1.legend()
    ax1.grid(True)
    
    # Loss
    ax2.plot(history.history['loss'], label='Train Loss')
    ax2.plot(history.history['val_loss'], label='Val Loss')
    ax2.set_title('Model Loss')
    ax2.set_xlabel('Epoch')
    ax2.set_ylabel('Loss')
    ax2.legend()
    ax2.grid(True)
    
    plt.tight_layout()
    plt.savefig(save_path, dpi=150, bbox_inches='tight')
    print(f"Training history plot saved to {save_path}")


def train_model():
    """
    Main training function
    """
    
    # Step 1: Load Data
    print("\n" + "="*50)
    print("STEP 1: Loading Data")
    print("="*50)
    
    train_ds, val_ds, class_names = create_datasets(
        CONFIG['data_dir'],
        img_size=CONFIG['img_size'],
        batch_size=CONFIG['batch_size']
    )
    
    num_classes = get_dataset_info(train_ds, val_ds)
    save_class_names(class_names)
    
    # Step 2: Create Model
    print("\n" + "="*50)
    print("STEP 2: Creating Model")
    print("="*50)
    
    if CONFIG['use_transfer_learning']:
        model, base_model = create_efficient_model(
            input_shape=(*CONFIG['img_size'], 3),
            num_classes=num_classes
        )
        print("Using MobileNetV2 transfer learning")
    else:
        from model import create_simple_cnn
        model = create_simple_cnn(
            input_shape=(*CONFIG['img_size'], 3),
            num_classes=num_classes
        )
        base_model = None
        print("Using simple CNN architecture")
    
    model.summary()
    
    # Step 3: Initial Training
    print("\n" + "="*50)
    print("STEP 3: Initial Training")
    print("="*50)
    
    model.compile(
        optimizer=tf.keras.optimizers.Adam(CONFIG['learning_rate_initial']),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    # Callbacks
    callbacks = [
        tf.keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=5,
            restore_best_weights=True,
            verbose=1
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=3,
            min_lr=1e-7,
            verbose=1
        ),
        tf.keras.callbacks.ModelCheckpoint(
            'models/checkpoint.keras',
            monitor='val_accuracy',
            save_best_only=True,
            verbose=1
        )
    ]
    
    history_initial = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=CONFIG['epochs_initial'],
        callbacks=callbacks,
        verbose=1
    )
    
    # Step 4: Fine-tuning (if using transfer learning)
    if CONFIG['use_transfer_learning'] and base_model is not None:
        print("\n" + "="*50)
        print("STEP 4: Fine-tuning")
        print("="*50)
        
        unfreeze_base_model(base_model, num_layers=30)
        
        model.compile(
            optimizer=tf.keras.optimizers.Adam(CONFIG['learning_rate_finetune']),
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        history_finetune = model.fit(
            train_ds,
            validation_data=val_ds,
            epochs=CONFIG['epochs_finetune'],
            callbacks=callbacks,
            verbose=1
        )
        
        # Combine histories
        for key in history_initial.history:
            history_initial.history[key].extend(history_finetune.history[key])
    
    # Step 5: Evaluate
    print("\n" + "="*50)
    print("STEP 5: Final Evaluation")
    print("="*50)
    
    val_loss, val_acc = model.evaluate(val_ds)
    print(f"\nFinal Validation Accuracy: {val_acc:.4f}")
    print(f"Final Validation Loss: {val_loss:.4f}")
    
    # Test on test set if available
    test_ds = create_test_dataset(CONFIG['data_dir'], CONFIG['img_size'], CONFIG['batch_size'])
    if test_ds is not None:
        test_loss, test_acc = model.evaluate(test_ds)
        print(f"\nTest Accuracy: {test_acc:.4f}")
        print(f"Test Loss: {test_loss:.4f}")
    
    # Step 6: Save Model
    print("\n" + "="*50)
    print("STEP 6: Saving Model")
    print("="*50)
    
    # Save in TensorFlow SavedModel format
    model.export(CONFIG['model_save_path'])
    print(f"Model saved to {CONFIG['model_save_path']}")
    
    # Also save as .keras format (newer format)
    model.save('models/plant_disease_model.keras')
    print("Model also saved as plant_disease_model.keras")
    
    # Plot training history
    plot_training_history(history_initial)
    
    print("\n" + "="*50)
    print("Training Complete!")
    print("="*50)
    print("\nNext steps:")
    print("1. Run: python src/convert_model.py")
    print("2. Use the converted model in Node.js with TensorFlow.js")
    
    return model, history_initial


if __name__ == '__main__':
    # Create necessary directories
    Path('models').mkdir(exist_ok=True)
    
    # Train model
    model, history = train_model()