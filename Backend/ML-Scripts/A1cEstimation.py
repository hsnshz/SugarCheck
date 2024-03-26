from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import pickle
from keras.models import load_model

app = Flask(__name__)
CORS(app)

# Load the model, scaler, and selector
model = load_model("Backend/ML-Models/A1c-Estimation/a1c_model.keras")
with open("Backend/ML-Models/A1c-Estimation/scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

with open("Backend/ML-Models/A1c-Estimation/selector.pkl", "rb") as f:
    selector = pickle.load(f)


@app.route("/estimate-a1c", methods=["POST"])
def predict():
    # Get the data from the POST request
    data = request.get_json(force=True)

    # Create a DataFrame from the data
    input_data = pd.DataFrame(
        {
            "Age": [data["age"]],
            "BMI": [data["bmi"]],
            "Gender_Female": [data["gender_female"]],
            "Gender_Male": [data["gender_male"]],
        }
    )

    # Add glucose values
    for i, glucose_value in enumerate(data["glucose_values"]):
        input_data[f"glucose_t-{9-i}"] = glucose_value

    # Reorder the columns to match the order used when fitting the selector
    input_data = input_data[
        [
            "glucose_t-9",
            "glucose_t-8",
            "glucose_t-7",
            "glucose_t-6",
            "glucose_t-5",
            "glucose_t-4",
            "glucose_t-3",
            "glucose_t-2",
            "glucose_t-1",
            "glucose_t-0",
            "Age",
            "BMI",
            "Gender_Female",
            "Gender_Male",
        ]
    ]

    # Apply feature selection
    input_data = selector.transform(input_data)

    # Scale the glucose values
    input_data = scaler.transform(input_data)

    # Reshape the data to be 3D (samples, timesteps, features)
    input_data = input_data.reshape((input_data.shape[0], input_data.shape[1], 1))

    # Use the model to make a prediction
    prediction = model.predict(input_data)

    # Return the prediction
    print(prediction[0].tolist())
    return jsonify(prediction[0].tolist())


if __name__ == "__main__":
    app.run(port=5000, debug=True, host="0.0.0.0")
