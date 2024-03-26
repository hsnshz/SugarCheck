from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np
from keras.models import load_model
import firebase_admin
import firebase_admin
from firebase_admin import credentials, storage
import requests
import os
from datetime import timedelta


# Firebase Admin initialization
cred = credentials.Certificate(
    "/Users/hassanshahzad/Desktop/Westminster/Year3/FinalYearProject/sugarcheck-0-firebase-adminsdk-sirmc-444be3e09d.json"
)
firebase_admin.initialize_app(cred, {"storageBucket": "sugarcheck-0.appspot.com"})


def download_file_from_firebase(file_name, local_file_path):
    bucket = storage.bucket()
    blob = bucket.blob(file_name)
    url = blob.generate_signed_url(timedelta(minutes=5), method="GET")

    # Ensure the directory exists
    os.makedirs(os.path.dirname(local_file_path), exist_ok=True)

    try:
        response = requests.get(url)
        response.raise_for_status()
        with open(local_file_path, "wb") as file:
            file.write(response.content)
    except requests.exceptions.HTTPError as err:
        print(f"HTTP error occurred: {err}")


# Download model and encoder files from Firebase Cloud Storage
files_to_download = [
    "ModelFiles/final_predict_model.pkl",
    "ModelFiles/encoders.pkl",
    "ModelFiles/minmax.pkl",
    "ModelFiles/a1c_model.keras",
    "ModelFiles/scaler.pkl",
    "ModelFiles/selector.pkl",
]

for file_name in files_to_download:
    local_file_path = os.path.join(
        "ModelFiles", os.path.basename(file_name)
    )  # Adjust the path according to your local directory structure
    download_file_from_firebase(file_name, local_file_path)


app = Flask(__name__)
CORS(app)


# Load the diabetes model
with open("ModelFiles/final_predict_model.pkl", "rb") as file:
    diabetes_model = pickle.load(file)
# Load the encoders and scaler
with open("ModelFiles/encoders.pkl", "rb") as file:
    encoders = pickle.load(file)
with open("ModelFiles/minmax.pkl", "rb") as file:
    minmax = pickle.load(file)

# Load the a1c model, scaler, and selector
a1c_model = load_model("ModelFiles/a1c_model.keras")
with open("ModelFiles/scaler.pkl", "rb") as f:
    scaler = pickle.load(f)
with open("ModelFiles/selector.pkl", "rb") as f:
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


@app.route("/")
def index():
    return "Hello, World!"


if __name__ == "__main__":
    app.run(port=3000, debug=True, host="0.0.0.0")
