import pandas as pd
import numpy as np
import pickle
from sklearn import preprocessing
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import MinMaxScaler
import unittest
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)

# Load dataset
df = pd.read_csv(
    "/Users/hassanshahzad/Desktop/Westminster/Year3/FinalYearProject/SugarCheck/Dataset/balanced_diabetes_data.csv"
)
df.columns = map(str.lower, df.columns)
df["class"] = df["class"].replace({"Positive": 1, "Negative": 0})

# Separate features and target
X = df.drop("class", axis=1)
y = df["class"]

# Label encoding for categorical variables
encoders = {}
for col in X.select_dtypes(include="object").columns:
    encoder = preprocessing.LabelEncoder()
    X[col] = encoder.fit_transform(X[col])
    encoders[col] = encoder

# MinMax scaling for 'age'
minmax = MinMaxScaler()
X[["age"]] = minmax.fit_transform(X[["age"]])

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=40
)

# Grid search for hyperparameter tuning
param_grid = {
    "n_estimators": [50, 100, 200],
    "max_depth": [10, 20, 30],
}
rf = RandomForestClassifier(random_state=0)
grid_search = GridSearchCV(
    estimator=rf, param_grid=param_grid, cv=5, n_jobs=-1, scoring="accuracy"
)
grid_search.fit(X_train, y_train)

# Best parameters and score
best_parameters = grid_search.best_params_
best_score = grid_search.best_score_
print("Best Parameters:", best_parameters)
print("Best Score:", best_score)

# Train the final model
final_rf = RandomForestClassifier(**best_parameters, random_state=0)
final_rf.fit(X_train, y_train)

# Evaluation Metrics
y_pred_rf = final_rf.predict(X_test)
rf_acc = accuracy_score(y_test, y_pred_rf)
rf_roc = roc_auc_score(y_test, y_pred_rf)
rf_prec = precision_score(y_test, y_pred_rf)
rf_rec = recall_score(y_test, y_pred_rf)
rf_f1 = f1_score(y_test, y_pred_rf)

print("Evaluation Metrics for Final Random Forest Classifier:")
print("Accuracy:", rf_acc)
print("ROC:", rf_roc)
print("Precision:", rf_prec)
print("Recall:", rf_rec)
print("F1 Score:", rf_f1)
print("\n")


def predict_diabetes(model, input_values):
    # Create a DataFrame from the input values
    input_df = pd.DataFrame([input_values])

    # Apply label encoding
    for col, encoder in encoders.items():
        if col in input_df:
            input_df[col] = encoder.transform(input_df[col])

    # Apply MinMax scaling to 'age'
    if "age" in input_df:
        input_df["age"] = minmax.transform(input_df[["age"]])

    # Make the prediction
    prediction = model.predict(input_df)

    # Convert the prediction to 'Positive' or 'Negative'
    return "Positive" if prediction[0] == 1 else "Negative"


# Save Model
saved_model = pickle.dumps(final_rf)

# Save the model to disk
with open("Backend/ML-Models/final_predict_model.pkl", "wb") as file:
    pickle.dump(final_rf, file)

# Save encoders to disk
with open("Backend/ML-Models/encoders.pkl", "wb") as file:
    pickle.dump(encoders, file)

# Save MinMaxScaler to disk
with open("Backend/ML-Models/minmax.pkl", "wb") as file:
    pickle.dump(minmax, file)


# TESTING
class TestPredictDiabetes(unittest.TestCase):
    def setUp(self):
        self.model = final_rf
        self.encoders = encoders
        self.minmax = minmax

    def test_predict_diabetes(self):
        # Test case 1
        input_values = {
            "age": 52,
            "gender": "Male",
            "polyuria": "No",
            "polydipsia": "No",
            "sudden weight loss": "No",
            "weakness": "Yes",
            "polyphagia": "No",
            "genital thrush": "No",
            "visual blurring": "Yes",
            "itching": "No",
            "irritability": "Yes",
            "delayed healing": "No",
            "partial paresis": "No",
            "muscle stiffness": "No",
            "alopecia": "No",
            "obesity": "No",
        }
        prediction = predict_diabetes(self.model, input_values)
        print(f"Test case 1 prediction: {prediction}")
        self.assertIn(prediction, ["Positive", "Negative"])

        # Test case 2
        input_values = {
            "age": 36,
            "gender": "Female",
            "polyuria": "No",
            "polydipsia": "Yes",
            "sudden weight loss": "No",
            "weakness": "Yes",
            "polyphagia": "No",
            "genital thrush": "No",
            "visual blurring": "Yes",
            "itching": "No",
            "irritability": "No",
            "delayed healing": "No",
            "partial paresis": "No",
            "muscle stiffness": "No",
            "alopecia": "No",
            "obesity": "Yes",
        }
        prediction = predict_diabetes(self.model, input_values)
        print(f"Test case 2 prediction: {prediction}")
        self.assertIn(prediction, ["Positive", "Negative"])

        # Test case 3
        input_values = {
            "age": 39,
            "gender": "Male",
            "polyuria": "Yes",
            "polydipsia": "No",
            "sudden weight loss": "No",
            "weakness": "No",
            "polyphagia": "Yes",
            "genital thrush": "No",
            "visual blurring": "Yes",
            "itching": "No",
            "irritability": "No",
            "delayed healing": "No",
            "partial paresis": "No",
            "muscle stiffness": "No",
            "alopecia": "No",
            "obesity": "Yes",
        }
        prediction = predict_diabetes(self.model, input_values)
        print(f"Test case 3 prediction: {prediction}")
        self.assertIn(prediction, ["Positive", "Negative"])

        # Test case 4
        input_values = {
            "age": 50,
            "gender": "Female",
            "polyuria": "Yes",
            "polydipsia": "Yes",
            "sudden weight loss": "No",
            "weakness": "No",
            "polyphagia": "Yes",
            "genital thrush": "No",
            "visual blurring": "No",
            "itching": "Yes",
            "irritability": "No",
            "delayed healing": "Yes",
            "partial paresis": "No",
            "muscle stiffness": "No",
            "alopecia": "Yes",
            "obesity": "No",
        }
        prediction = predict_diabetes(self.model, input_values)
        print(f"Test case 4 prediction: {prediction}")
        self.assertIn(prediction, ["Positive", "Negative"])

        # Test case 5
        input_values = {
            "age": 45,
            "gender": "Male",
            "polyuria": "No",
            "polydipsia": "No",
            "sudden weight loss": "Yes",
            "weakness": "Yes",
            "polyphagia": "Yes",
            "genital thrush": "Yes",
            "visual blurring": "No",
            "itching": "No",
            "irritability": "Yes",
            "delayed healing": "No",
            "partial paresis": "Yes",
            "muscle stiffness": "No",
            "alopecia": "No",
            "obesity": "Yes",
        }
        prediction = predict_diabetes(self.model, input_values)
        print(f"Test case 5 prediction: {prediction}")
        self.assertIn(prediction, ["Positive", "Negative"])

        # Test case 6
        input_values = {
            "age": 55,
            "gender": "Female",
            "polyuria": "Yes",
            "polydipsia": "Yes",
            "sudden weight loss": "No",
            "weakness": "No",
            "polyphagia": "No",
            "genital thrush": "No",
            "visual blurring": "Yes",
            "itching": "Yes",
            "irritability": "No",
            "delayed healing": "Yes",
            "partial paresis": "No",
            "muscle stiffness": "Yes",
            "alopecia": "No",
            "obesity": "No",
        }
        prediction = predict_diabetes(self.model, input_values)
        print(f"Test case 6 prediction: {prediction}")
        self.assertIn(prediction, ["Positive", "Negative"])

        # Test case 7
        input_values = {
            "age": 62,
            "gender": "Male",
            "polyuria": "No",
            "polydipsia": "No",
            "sudden weight loss": "Yes",
            "weakness": "Yes",
            "polyphagia": "No",
            "genital thrush": "Yes",
            "visual blurring": "No",
            "itching": "No",
            "irritability": "Yes",
            "delayed healing": "No",
            "partial paresis": "Yes",
            "muscle stiffness": "No",
            "alopecia": "Yes",
            "obesity": "Yes",
        }
        prediction = predict_diabetes(self.model, input_values)
        print(f"Test case 7 prediction: {prediction}")
        self.assertIn(prediction, ["Positive", "Negative"])

        # Test case 8
        input_values = {
            "age": 65,
            "gender": "Female",
            "polyuria": "No",
            "polydipsia": "No",
            "sudden weight loss": "No",
            "weakness": "Yes",
            "polyphagia": "Yes",
            "genital thrush": "Yes",
            "visual blurring": "Yes",
            "itching": "Yes",
            "irritability": "Yes",
            "delayed healing": "Yes",
            "partial paresis": "Yes",
            "muscle stiffness": "Yes",
            "alopecia": "Yes",
            "obesity": "Yes",
        }
        prediction = predict_diabetes(self.model, input_values)
        print(f"Test case 8 prediction: {prediction}")
        self.assertIn(prediction, ["Positive", "Negative"])


if __name__ == "__main__":
    unittest.main()
