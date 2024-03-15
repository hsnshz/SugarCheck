from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np
from keras.models import load_model

app = Flask(__name__)
CORS(app)

# Load the diabetes model from disk
with open("Backend/ML-Models/final_predict_model.pkl", "rb") as file:
    diabetes_model = pickle.load(file)
# Load the encoders and scaler from disk
with open("Backend/ML-Models/encoders.pkl", "rb") as file:
    encoders = pickle.load(file)
with open("Backend/ML-Models/minmax.pkl", "rb") as file:
    minmax = pickle.load(file)

# Load the a1c model, scaler, and selector
a1c_model = load_model("Backend/ML-Models/A1c-Estimation/a1c_model.keras")
with open("Backend/ML-Models/A1c-Estimation/scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

with open("Backend/ML-Models/A1c-Estimation/selector.pkl", "rb") as f:
    selector = pickle.load(f)


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    if not data:
        return "No data provided", 400

    # Create a DataFrame from the input data
    input_df = pd.DataFrame(data, index=[0])

    # Convert all values to title case
    input_df = input_df.applymap(lambda s: s.title() if type(s) == str else s)

    # Convert column names to lower case
    input_df.columns = input_df.columns.str.lower()

    # Apply label encoding
    for col, encoder in encoders.items():
        if col in input_df:
            # Replace empty strings with NaN
            input_df[col] = input_df[col].replace("", np.nan)

            input_df[col] = encoder.transform(input_df[col])

    # Apply MinMax scaling to 'age'
    if "age" in input_df:
        input_df["age"] = minmax.transform(input_df[["age"]])

    prediction = diabetes_model.predict(input_df)
    print("\nPrediction", prediction)
    return jsonify(prediction.tolist())


@app.route("/estimate-a1c", methods=["POST"])
def estimate_a1c():
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
    prediction = a1c_model.predict(input_data)

    # Return the prediction
    print(prediction[0].tolist())
    return jsonify(prediction[0].tolist())


if __name__ == "__main__":
    app.run(port=3000, debug=True, host="0.0.0.0")
