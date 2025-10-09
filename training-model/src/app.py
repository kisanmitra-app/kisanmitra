import tensorflow as tf
from tensorflow import keras
from keras import layers
import tensorflowjs as tfjs
import json

print("TensorFlow version:", tf.__version__)
print("Num GPUs Available:", len(tf.config.list_physical_devices('GPU')))

# Configuration
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 16
EPOCHS = 1 
DATA_DIR = './data/PlantVillage'

# Load dataset
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
print(f"Found {num_classes} classes")

# CRITICAL FIX: Apply augmentation to dataset, NOT in model
data_augmentation = keras.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.1),
    layers.RandomZoom(0.1),
])

def augment(image, label):
    return data_augmentation(image, training=True), label

# Apply augmentation to training data only
train_ds = train_ds.map(augment, num_parallel_calls=tf.data.AUTOTUNE)
train_ds = train_ds.cache().prefetch(buffer_size=tf.data.AUTOTUNE)
val_ds = val_ds.cache().prefetch(buffer_size=tf.data.AUTOTUNE)

# FIXED MODEL: Remove augmentation layers from model
def create_model(num_classes, input_shape=(224, 224, 3)):
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

model = create_model(num_classes)

model.compile(
    optimizer=keras.optimizers.Adam(0.001),  # Increased learning rate
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

model.summary()

# Callbacks
# callbacks = [
#     keras.callbacks.EarlyStopping(
#         monitor='val_loss',
#         patience=10,
#         restore_best_weights=True
#     ),
#     keras.callbacks.ReduceLROnPlateau(
#         monitor='val_loss',
#         factor=0.5,
#         patience=5,
#         min_lr=1e-7
#     ),
#     keras.callbacks.ModelCheckpoint(
#         './models/best_model.keras',
#         monitor='val_accuracy',
#         save_best_only=True
#     )
# ]

# Also update in ModelCheckpoint callback:
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
        './models/best_model.h5',  # Changed from .keras to .h5
        monitor='val_accuracy',
        save_best_only=True
    )
]

# Train
print("\n🚀 Starting training...")
history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS,
    callbacks=callbacks
)

# Save in native Keras format first
print("\nSaving model in Keras format...")
# model.save('./models/best_model.keras')
model.save('./models/last_model.h5')

# Load the best model for conversion
# model = keras.models.load_model('./models/best_model.keras')

# Convert to TensorFlow.js format
# print("\nConverting to TensorFlow.js format...")
# tfjs.converters.save_keras_model(model, './models/crop-disease-detector')

# Save class names
with open('./models/disease-classes.json', 'w') as f:
    json.dump(class_names, f, indent=2)

# Save metadata
metadata = {
    'num_classes': num_classes,
    'image_size': IMAGE_SIZE,
    'model_type': 'crop_disease_classifier',
    'class_names': class_names
}
with open('./models/metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)

print("\n✅ Model trained and converted successfully!")
print(f"📊 Final validation accuracy: {max(history.history['val_accuracy']):.2%}")
