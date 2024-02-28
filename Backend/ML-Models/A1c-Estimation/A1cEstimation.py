# import pandas as pd
# import numpy as np
# from sklearn.model_selection import (
#     train_test_split,
#     GridSearchCV,
#     cross_val_score,
#     KFold,
# )
# from sklearn.preprocessing import StandardScaler, OneHotEncoder
# from sklearn.compose import ColumnTransformer
# from sklearn.pipeline import Pipeline
# from sklearn.ensemble import RandomForestRegressor
# from sklearn.metrics import mean_squared_error
# from sklearn.feature_selection import SelectKBest, f_regression
# import unittest
# import pickle

# print()
# print("A1c Estimation Model")
# print("--------------------------------------------------")
# print()

# # Load the data
# df = pd.read_csv("Dataset/dummy_diabetes_data.csv")

# # Check for missing values and handle them
# df = df.dropna()

# # Define the features and target variable
# X = df.drop("Hba1c_Level", axis=1)
# y = df["Hba1c_Level"]

# # Split the data into training and test sets
# X_train, X_test, y_train, y_test = train_test_split(
#     X, y, test_size=0.2, random_state=42
# )

# # Define preprocessing for numeric and categorical features
# numeric_features = ["Age", "BMI", "Blood_Glucose_Level"]
# numeric_transformer = Pipeline(
#     steps=[
#         ("scaler", StandardScaler()),
#         ("selector", SelectKBest(f_regression, k=1)),
#     ]
# )

# categorical_features = ["Gender"]
# categorical_transformer = OneHotEncoder()

# preprocessor = ColumnTransformer(
#     transformers=[
#         ("num", numeric_transformer, numeric_features),
#         ("cat", categorical_transformer, categorical_features),
#     ]
# )

# # Define the model
# model = RandomForestRegressor(n_estimators=100, random_state=42)

# # Create the preprocessing and training pipeline
# pipeline = Pipeline(steps=[("preprocessor", preprocessor), ("model", model)])

# # Define the parameter grid for GridSearchCV
# param_grid = {
#     "model__n_estimators": [50, 100, 150, 200],
#     "model__max_depth": [None, 3, 5, 10],
#     "model__min_samples_split": [2, 5, 10],
# }

# # Set up GridSearchCV
# grid_search = GridSearchCV(
#     pipeline, param_grid, cv=10, scoring="neg_mean_squared_error", error_score="raise"
# )

# # Train the model
# grid_search.fit(X_train, y_train)

# # Get the best parameters and set them to the pipeline
# best_params = grid_search.best_params_
# pipeline.set_params(**best_params)

# # Fit the pipeline again with the best parameters
# pipeline.fit(X_train, y_train)

# # Predict and evaluate the model using the pipeline
# y_pred = pipeline.predict(X_test)
# mse = mean_squared_error(y_test, y_pred)
# rmse = mse**0.5
# print(f"Test RMSE: {rmse}")

# # Check for overfitting
# y_train_pred = pipeline.predict(X_train)
# mse_train = mean_squared_error(y_train, y_train_pred)
# rmse_train = mse_train**0.5
# print(f"Train RMSE: {rmse_train}")

# # Define the KFold cross-validator
# kfold = KFold(n_splits=10, shuffle=True, random_state=42)

# # Evaluate the model using cross-validation
# scores = cross_val_score(pipeline, X, y, cv=kfold, scoring="neg_mean_squared_error")

# # Take the square root of the scores to get the RMSE
# rmse_scores = np.sqrt(-scores)

# print(f"Cross-validated RMSE: {rmse_scores.mean()}")
# print()

import pandas as pd
import numpy as np
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split, KFold
from sklearn.preprocessing import MinMaxScaler, StandardScaler
from keras.models import Sequential
from keras.layers import Dense, SimpleRNN
import pickle
import unittest

# Load the data
df = pd.read_csv("Dataset/dummy_diabetes_data.csv")

# Convert 'Gender' to one-hot encoding
df = pd.get_dummies(df, columns=["Gender"])

# Group the data by patient and create sequences of glucose values
df_grouped = (
    df.groupby("Patient_ID")
    .apply(
        lambda x: pd.Series(
            {
                "Blood_Glucose_Level": [
                    x["Blood_Glucose_Level"][max(0, i - 10) : i].tolist()
                    + [np.nan] * (10 - min(10, i))
                    for i in range(10, len(x) + 1)
                ],
                "Hba1c_Level": x["Hba1c_Level"].mean(),
                "Age": x["Age"].mean(),
                "BMI": x["BMI"].mean(),
                "Gender_Female": x["Gender_Female"].mode()[0],
                "Gender_Male": x["Gender_Male"].mode()[0],
            }
        )
    )
    .reset_index()
)


# Create a new DataFrame with the sequences and the target variable
df_sequences = pd.DataFrame(
    [item for sublist in df_grouped["Blood_Glucose_Level"].values for item in sublist],
    columns=[f"glucose_t-{i}" for i in range(9, -1, -1)],
)
df_sequences["Hba1c_Level"] = np.repeat(
    df_grouped["Hba1c_Level"].values,
    [len(x) for x in df_grouped["Blood_Glucose_Level"]],
)
df_sequences["Age"] = np.repeat(
    df_grouped["Age"].values,
    [len(x) for x in df_grouped["Blood_Glucose_Level"]],
)
df_sequences["BMI"] = np.repeat(
    df_grouped["BMI"].values,
    [len(x) for x in df_grouped["Blood_Glucose_Level"]],
)
df_sequences["Gender_Female"] = np.repeat(
    df_grouped["Gender_Female"].values,
    [len(x) for x in df_grouped["Blood_Glucose_Level"]],
)

df_sequences["Gender_Male"] = np.repeat(
    df_grouped["Gender_Male"].values,
    [len(x) for x in df_grouped["Blood_Glucose_Level"]],
)

# Define the features and target variable
X = df_sequences.drop("Hba1c_Level", axis=1)
y = df_sequences["Hba1c_Level"]

# Define the KFold cross-validator
kfold = KFold(n_splits=10, shuffle=True, random_state=42)

# Initialize the list of scores
scores = []
train_scores = []
test_scores = []

# Perform cross-validation
for train_index, test_index in kfold.split(X):
    X_train, X_test = X.iloc[train_index], X.iloc[test_index]
    y_train, y_test = y.iloc[train_index], y.iloc[test_index]

    # Feature selection
    selector = SelectKBest(f_classif, k=5)
    X_train = selector.fit_transform(X_train, y_train)
    X_test = selector.transform(X_test)

    # Scale the glucose values
    scaler = MinMaxScaler(feature_range=(0, 1))
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    # Reshape the data to be 3D (samples, timesteps, features)
    X_train = X_train.reshape((X_train.shape[0], X_train.shape[1], 1))
    X_test = X_test.reshape((X_test.shape[0], X_test.shape[1], 1))

    # Define the model
    model = Sequential()
    model.add(SimpleRNN(30, activation="relu", input_shape=(None, 1)))
    model.add(Dense(20))
    model.add(Dense(1))

    # Compile the model
    model.compile(optimizer="adam", loss="mse")

    # Train the model
    model.fit(X_train, y_train, epochs=100, verbose=0)

    # Predict and evaluate the model on the training set
    y_train_pred = model.predict(X_train)
    train_mse = mean_squared_error(y_train, y_train_pred)
    train_rmse = train_mse**0.5
    train_scores.append(train_rmse)

    # Predict and evaluate the model on the test set
    y_test_pred = model.predict(X_test)
    test_mse = mean_squared_error(y_test, y_test_pred)
    test_rmse = test_mse**0.5
    test_scores.append(test_rmse)


# Predict and evaluate the model
y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
rmse = mse**0.5
scores.append(rmse)

print()
print("Model performance:")
print("--------------------------------------------------")
print()

# Print the mean RMSE across all folds for the training and test sets
print(f"Training RMSE: {np.mean(train_scores)}")
print(f"Test RMSE: {np.mean(test_scores)}")

# Print the mean RMSE across all folds
print(f"Cross-validated RMSE: {np.mean(scores)}")

print()
# Assuming y_train is your target variable
min_value = y_train.min()
max_value = y_train.max()

print(f"Range of target variable: {min_value} to {max_value}")

# Save the model
model.save("Backend/ML-Models/A1c-Estimation/a1c_model.keras")

# Save the scaler
with open("Backend/ML-Models/A1c-Estimation/scaler.pkl", "wb") as file:
    pickle.dump(scaler, file)

# Save the selector
with open("Backend/ML-Models/A1c-Estimation/selector.pkl", "wb") as file:
    pickle.dump(selector, file)


# Function to predict Hba1c level
def predict_hba1c(
    model, scaler, selector, age, bmi, glucose_values, gender_female, gender_male
):
    # Create a DataFrame from the inputs
    input_data = pd.DataFrame(
        {
            "Age": [age],
            "BMI": [bmi],
            "Gender_Female": [gender_female],
            "Gender_Male": [gender_male],
        }
    )

    # Add glucose values
    for i, glucose_value in enumerate(glucose_values):
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

    return prediction[0]


class TestPredictHba1c(unittest.TestCase):
    def setUp(self):
        # Assuming the model, scaler, and selector are defined globally
        self.model = model
        self.scaler = scaler
        self.selector = selector

    def test_predict_hba1c_1(self):
        prediction = predict_hba1c(
            self.model, self.scaler, self.selector, 50, 25, list(range(100, 110)), 0, 1
        )
        self.assertIsInstance(prediction, np.ndarray)

    def test_predict_hba1c_2(self):
        prediction = predict_hba1c(
            self.model, self.scaler, self.selector, 30, 22, list(range(110, 120)), 1, 0
        )
        self.assertIsInstance(prediction, np.ndarray)

    def test_predict_hba1c_3(self):
        prediction = predict_hba1c(
            self.model, self.scaler, self.selector, 60, 27, list(range(120, 130)), 0, 1
        )
        self.assertIsInstance(prediction, np.ndarray)

    def test_predict_hba1c_4(self):
        prediction = predict_hba1c(
            self.model, self.scaler, self.selector, 45, 24, list(range(130, 140)), 1, 0
        )
        self.assertIsInstance(prediction, np.ndarray)

    def test_predict_hba1c_5(self):
        prediction = predict_hba1c(
            self.model, self.scaler, self.selector, 55, 26, list(range(140, 150)), 0, 1
        )
        self.assertIsInstance(prediction, np.ndarray)


if __name__ == "__main__":
    unittest.main()
