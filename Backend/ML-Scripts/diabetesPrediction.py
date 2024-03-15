from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

# Load the model from disk
with open("Backend/ML-Models/final_predict_model.pkl", "rb") as file:
    loaded_model = pickle.load(file)
# Load the encoders and scaler from disk
with open("Backend/ML-Models/encoders.pkl", "rb") as file:
    encoders = pickle.load(file)
with open("Backend/ML-Models/minmax.pkl", "rb") as file:
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

    prediction = loaded_model.predict(input_df)
    print("Prediction", prediction)
    return jsonify(prediction.tolist())


if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")
