from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np
from glucosePreprocessor import GlucoseDataPreprocessor

app = Flask(__name__)
CORS(app)


# Load the diabetes model from disk
with open("final_predict_model.pkl", "rb") as file:
    diabetes_model = pickle.load(file)
# Load the encoders and scaler from disk
with open("encoders.pkl", "rb") as file:
    encoders = pickle.load(file)
with open("minmax.pkl", "rb") as file:
    minmax = pickle.load(file)


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


# Load the a1c model, and preprocessor
with open("A1cModel.pkl", "rb") as file:
    model_data = pickle.load(file)

a1c_model = model_data["model"]
preprocessor = model_data["preprocessor"]


@app.route("/estimate-a1c", methods=["POST"])
def estimate_a1c():
    try:
        data = request.get_json(force=True)
        readings = data.get("readings", [])
        input_data = pd.DataFrame(readings)

        preprocessor = GlucoseDataPreprocessor()

        # Assign a default 'Patient_ID', 'Blood_Glucose' and 'HbA1c'
        input_data["Patient_ID"] = "default"
        input_data["Blood_Glucose"] = input_data.get("blood_glucose", 0)
        input_data["HbA1c"] = input_data.get("HbA1c", 0)

        # Convert 'timestamp' to datetime
        input_data["Timestamp"] = pd.to_datetime(input_data["timestamp"])

        # Check for required columns
        expected_cols = {"Patient_ID", "Timestamp", "Blood_Glucose", "HbA1c"}
        if not expected_cols.issubset(set(input_data.columns)):
            return (
                jsonify(
                    {"error": f"Missing columns, required columns are: {expected_cols}"}
                ),
                400,
            )

        # Preprocess the data
        processed_data = preprocessor.transform(input_data)

        # Make a prediction
        prediction = a1c_model.predict(
            processed_data[["rolling_mean", "rolling_median", "rolling_std"]]
        )

        # Calculate the mean of the predictions
        average_prediction = np.mean(prediction)

        return jsonify({"HbA1c": average_prediction})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=3000, debug=True, host="0.0.0.0")
