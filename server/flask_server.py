from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import os
from werkzeug.utils import secure_filename
from PIL import Image

app = Flask(__name__)

# Model configuration
img_height = 100
img_width = 100
model = None
class_names = None

def load_pretrained_model():
    """Load the pre-trained model"""
    global model, class_names
    
    try:
        model_path = os.path.join(os.path.dirname(__file__), 'cattle_model.h5')
        class_names_path = os.path.join(os.path.dirname(__file__), 'class_names.txt')
        
        if os.path.exists(model_path) and os.path.exists(class_names_path):
            # Load the model
            model = tf.keras.models.load_model(model_path)
            
            # Load class names
            with open(class_names_path, 'r') as f:
                class_names = [line.strip() for line in f.readlines()]
                
            print("Pre-trained model loaded successfully!")
            print(f"Class names: {class_names}")
            return True
        else:
            print(f"Model files not found!")
            print(f"Model exists: {os.path.exists(model_path)}")
            print(f"Class names exists: {os.path.exists(class_names_path)}")
            print("Please run the model training script first to train and save the model.")
            return False
            
    except Exception as e:
        print(f"Error loading model: {e}")
        return False

def preprocess_image(image_path):
    """Preprocess image for prediction"""
    img = tf.keras.utils.load_img(image_path, target_size=(img_height, img_width))
    img_array = tf.keras.utils.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0)
    return img_array

@app.route('/flask', methods=['GET'])
def index():
    return "Flask Server with Pre-trained CNN Model"

@app.route('/predict_from_path', methods=['POST'])
def predict_from_path():
    try:
        if model is None:
            return jsonify({'error': 'Model not loaded. Please train the model first.'}), 500
            
        data = request.get_json()
        image_path = data.get('image_path')
        
        if not image_path or not os.path.exists(image_path):
            return jsonify({'error': f'Invalid image path: {image_path}'}), 400
            
        print(f"Analyzing image at: {image_path}")
        
        # Make prediction
        img_array = preprocess_image(image_path)
        predictions = model.predict(img_array)
        predicted_class_index = np.argmax(predictions[0])
        predicted_class = class_names[predicted_class_index]
        confidence = float(np.max(tf.nn.softmax(predictions[0])))
        
        # Get all class probabilities
        probabilities = tf.nn.softmax(predictions[0]).numpy()
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
    model_path = os.path.join(os.path.dirname(__file__), 'cattle_model.h5')
    return jsonify({
        'model_loaded': model is not None,
        'class_names': class_names,
        'input_shape': [img_height, img_width, 3] if model is not None else None,
        'model_file_exists': os.path.exists(model_path)
    })

# Load model on startup
print("Loading pre-trained model...")
model_ready = load_pretrained_model()
if not model_ready:
    print("WARNING: Model not loaded! Run model training script first.")

if __name__ == '__main__':
    app.run(port=5000, debug=True)