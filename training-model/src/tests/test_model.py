import tensorflow as tf
import numpy as np
import json
import os
from pathlib import Path
import matplotlib.pyplot as plt
from keras.applications.mobilenet_v2 import preprocess_input

def load_model_with_lambda(model_path):
    """
    Load model with Lambda layer containing preprocess_input
    """
    custom_objects = {
        'preprocess_input': preprocess_input,
    }
    
    try:
        model = tf.keras.models.load_model(model_path, custom_objects=custom_objects)
        return model
    except Exception as e:
        print(f"Error loading model: {e}")
        print("\nTrying alternative loading method...")
        
        # Alternative: try loading without compiling
        model = tf.keras.models.load_model(
            model_path, 
            custom_objects=custom_objects,
            compile=False
        )
        
        # Recompile the model
        model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        return model

def load_class_names(path='models/class_names.json'):
    """
    Load class names from JSON file
    Handles both list and dict formats
    """
    with open(path, 'r') as f:
        data = json.load(f)
    
    # If it's a list, return as is
    if isinstance(data, list):
        return data
    
    # If it's a dict, convert to list (sorted by key)
    if isinstance(data, dict):
        # Try to convert keys to int and sort
        try:
            sorted_items = sorted([(int(k), v) for k, v in data.items()])
            return [v for k, v in sorted_items]
        except:
            # If keys are not numbers, return values as list
            return list(data.values())
    
    return data

def load_and_preprocess_image(image_path, target_size=(224, 224)):
    """
    Load and preprocess a single image for prediction
    NOTE: Don't apply preprocessing here - model does it internally with Lambda layer
    """
    # Load image
    img = tf.keras.utils.load_img(image_path, target_size=target_size)
    
    # Convert to array
    img_array = tf.keras.utils.img_to_array(img)
    
    # Add batch dimension (no normalization - Lambda layer handles it)
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array, img

def predict_image(model, image_path, class_names, top_k=5):
    """
    Make prediction on a single image
    """
    print(f"\n{'='*60}")
    print(f"Analyzing: {os.path.basename(image_path)}")
    print('='*60)
    
    # Load image (preprocessing done by model's Lambda layer)
    img_array, original_img = load_and_preprocess_image(image_path)
    
    # Make prediction
    predictions = model.predict(img_array, verbose=0)
    
    # Get top K predictions (limit to actual number of classes)
    num_classes = len(class_names)
    top_k = min(top_k, num_classes)
    top_indices = np.argsort(predictions[0])[::-1][:top_k]
    
    print(f"\nTop {top_k} Predictions:")
    print("-" * 60)
    
    results = []
    for i, idx in enumerate(top_indices, 1):
        # Convert numpy int64 to Python int
        idx = int(idx)
        
        # Check if index is valid
        if idx < len(class_names):
            class_name = class_names[idx]
            confidence = float(predictions[0][idx]) * 100
            print(f"{i}. {class_name:40s} {confidence:6.2f}%")
            results.append((class_name, float(predictions[0][idx])))
        else:
            print(f"{i}. Class_{idx:02d} (Unknown)                    {float(predictions[0][idx])*100:6.2f}%")
            results.append((f"Class_{idx:02d}", float(predictions[0][idx])))
    
    # Return top prediction
    top_idx = int(top_indices[0])
    top_class = class_names[top_idx] if top_idx < len(class_names) else f"Class_{top_idx:02d}"
    
    return {
        'class': top_class,
        'confidence': float(predictions[0][top_idx]),
        'all_predictions': results,
        'image': original_img
    }

def visualize_prediction(result, save_path=None):
    """
    Visualize image with prediction
    """
    plt.figure(figsize=(10, 6))
    
    # Display image
    plt.imshow(result['image'])
    plt.axis('off')
    
    # Add prediction text
    title = f"Prediction: {result['class']}\nConfidence: {result['confidence']*100:.2f}%"
    plt.title(title, fontsize=14, fontweight='bold')
    
    if save_path:
        plt.savefig(save_path, bbox_inches='tight', dpi=150)
        print(f"\nVisualization saved to: {save_path}")
    else:
        plt.show()
    
    plt.close()

def test_model():
    """
    Main function to test the model
    """
    print("\n" + "="*60)
    print("TESTING PLANT DISEASE DETECTION MODEL")
    print("="*60)
    
    # Paths
    model_path = 'models/plant_disease_model.keras'
    class_names_path = 'models/class_names.json'
    
    # Check if model exists
    if not os.path.exists(model_path):
        print(f"\nError: Model not found at {model_path}")
        print("Please train the model first: python training-model/src/app.py")
        return
    
    # Load model with custom objects for Lambda layer
    print(f"\nLoading model from: {model_path}")
    model = load_model_with_lambda(model_path)
    print("✓ Model loaded successfully")
    
    # Print model info
    print(f"\nModel Information:")
    print(f"   Input shape:  {model.input_shape}")
    print(f"   Output shape: {model.output_shape}")
    print(f"   Parameters:   {model.count_params():,}")
    
    # Load class names
    class_names = load_class_names(class_names_path)
    print(f"   Classes:      {len(class_names)}")
    
    # Debug: print class names
    print(f"\nClass Names:")
    for i, name in enumerate(class_names[:10]):  # Show first 10
        print(f"   {i}: {name}")
    if len(class_names) > 10:
        print(f"   ... and {len(class_names) - 10} more")
    
    # Get test images
    print(f"\nLooking for test images...")
    
    # Check for test images in different locations
    test_dirs = [
        'samples',
    ]
    
    test_images = []
    for test_dir in test_dirs:
        if os.path.exists(test_dir):
            for ext in ['*.jpg', '*.jpeg', '*.png', '*.JPG', '*.JPEG', '*.PNG']:
                test_images.extend(Path(test_dir).rglob(ext))
            if test_images:
                break
    
    if not test_images:
        print("\nNo test images found!")
        print("\nPlease provide test images in one of these locations:")
        for test_dir in test_dirs:
            print(f"   - {test_dir}/")
        print("\nExample:")
        print("   mkdir test_images")
        print("   # Copy some plant images to test_images/")
        return
    
    # Limit to first 5 images
    test_images = list(test_images)[:5]
    print(f"✓ Found {len(test_images)} test image(s)")
    
    # Create output directory for visualizations
    output_dir = Path('models/predictions')
    output_dir.mkdir(exist_ok=True)
    
    # Test on each image
    results = []
    for img_path in test_images:
        try:
            result = predict_image(model, str(img_path), class_names)
            results.append(result)
            
            # Save visualization
            output_path = output_dir / f"pred_{img_path.stem}.png"
            visualize_prediction(result, save_path=output_path)
        except Exception as e:
            print(f"\nError processing {img_path.name}: {e}")
            continue
    
    # Summary
    print("\n" + "="*60)
    print("TESTING COMPLETE")
    print("="*60)
    print(f"\nProcessed {len(results)} image(s)")
    print(f"Results saved to: {output_dir}/")
    
    # Show confidence distribution
    if results:
        confidences = [r['confidence'] for r in results]
        avg_confidence = np.mean(confidences) * 100
        print(f"\nAverage confidence: {avg_confidence:.2f}%")
        print(f"Min confidence:     {min(confidences)*100:.2f}%")
        print(f"Max confidence:     {max(confidences)*100:.2f}%")

def test_single_image(image_path):
    """
    Test model on a single image
    """
    model_path = 'models/plant_disease_model.keras'
    class_names_path = 'models/class_names.json'
    
    # Load model and class names
    model = load_model_with_lambda(model_path)
    class_names = load_class_names(class_names_path)
    
    # Predict
    result = predict_image(model, image_path, class_names)
    
    # Visualize
    visualize_prediction(result)
    
    return result

if __name__ == '__main__':
    import sys
    
    # Check if a specific image path was provided
    if len(sys.argv) > 1:
        image_path = sys.argv[1]
        if os.path.exists(image_path):
            print(f"\nTesting single image: {image_path}")
            test_single_image(image_path)
        else:
            print(f"\Error: Image not found: {image_path}")
    else:
        # Test on all images in test directory
        test_model()
