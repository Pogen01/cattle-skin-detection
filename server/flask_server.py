from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import os
from werkzeug.utils import secure_filename
from PIL import Image

app = Flask(__name__)

# Model configuration - updated to match ResNet152V2
img_height = 224
img_width = 224
interpreter = None
class_names = None

def load_pretrained_model():
    """Load the pre-trained TensorFlow Lite model"""
    global interpreter, class_names
    
    try:
        model_path = os.path.join(os.path.dirname(__file__), 'cow_metadata.tflite')
        class_names_path = os.path.join(os.path.dirname(__file__), 'class_names.txt')
        
        if os.path.exists(model_path):
            # Load the TFLite model
            interpreter = tf.lite.Interpreter(model_path=model_path)
            interpreter.allocate_tensors()
            
            # Load class names if file exists, otherwise use default names from dataset
            if os.path.exists(class_names_path):
                with open(class_names_path, 'r') as f:
                    class_names = [line.strip() for line in f.readlines()]
            else:
                class_names = ['Healthy Skin', 'Disease 1', 'Disease 2']  # Update with actual class names
                print("Class names file not found. Using default class names.")
                
            print("Pre-trained TFLite model loaded successfully!")
            return True
        else:
            print(f"Model file not found: {model_path}")
            server_dir = os.path.dirname(__file__)
            for file in os.listdir(server_dir):
                if file.endswith('.tflite'):
                    print(f"  Found TFLite file: {file}")
            return False
            
    except Exception as e:
        print(f"Error loading model: {e}")
        return False

def preprocess_image(image_path):
    """Preprocess image for ResNet152V2 TFLite prediction"""
    try:
        img = tf.keras.utils.load_img(image_path, target_size=(img_height, img_width))
        img_array = tf.keras.utils.img_to_array(img)
        img_array = tf.expand_dims(img_array, 0)
        
        # Apply ResNet152V2 preprocessing - this normalizes to [-1, 1] range
        img_array = tf.keras.applications.resnet_v2.preprocess_input(img_array)
        
        # Convert to float32 for TFLite
        img_array = tf.cast(img_array, tf.float32)
        
        return img_array
    except Exception as e:
        print(f"Error in preprocessing: {e}")
        raise e

@app.route('/flask', methods=['GET'])
def index():
    return "Flask Server with Pre-trained CNN Model"

@app.route('/predict_from_path', methods=['POST'])
def predict_from_path():
    try:
        if interpreter is None:
            return jsonify({'error': 'Model not loaded. Please ensure the TFLite model is available.'}), 500
            
        data = request.get_json()
        image_path = data.get('image_path')
        
        if not image_path or not os.path.exists(image_path):
            return jsonify({'error': f'Invalid image path: {image_path}'}), 400
        
        # Make prediction with TFLite
        img_array = preprocess_image(image_path)
        
        # Get input and output details
        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()
        
        # Verify shapes match
        expected_shape = input_details[0]['shape']
        if img_array.shape[1:] != tuple(expected_shape[1:]):
            return jsonify({'error': f'Shape mismatch: expected {expected_shape}, got {img_array.shape}'}), 400
        
        # Set input tensor
        interpreter.set_tensor(input_details[0]['index'], img_array.numpy())
        
        # Run inference
        interpreter.invoke()
        
        # Get output tensor
        predictions = interpreter.get_tensor(output_details[0]['index'])
        
        predicted_class_index = np.argmax(predictions[0])
        predicted_class = class_names[predicted_class_index]
        
        # Apply softmax to get probabilities
        probabilities = tf.nn.softmax(predictions[0]).numpy()
        confidence = float(probabilities[predicted_class_index])
        
        # Get all class probabilities
        class_probabilities = {class_names[i]: float(probabilities[i]) for i in range(len(class_names))}
        
        return jsonify({
            'predicted_class': predicted_class,
            'confidence': confidence,
            'class_probabilities': class_probabilities,
            'all_classes': class_names
        })
        
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/model_info', methods=['GET'])
def model_info():
    model_path = os.path.join(os.path.dirname(__file__), 'cow_metadata.tflite')
    input_shape = None
    if interpreter is not None:
        input_details = interpreter.get_input_details()
        input_shape = input_details[0]['shape'].tolist()
    
    return jsonify({
        'model_loaded': interpreter is not None,
        'class_names': class_names,
        'input_shape': input_shape,
        'model_file_exists': os.path.exists(model_path),
        'model_type': 'ResNet152V2 TFLite'
    })

# Load model on startup
print("Loading pre-trained model...")
model_ready = load_pretrained_model()
if not model_ready:
    print("WARNING: Model not loaded! Run model training script first.")

if __name__ == '__main__':
    app.run(port=5000, debug=True)