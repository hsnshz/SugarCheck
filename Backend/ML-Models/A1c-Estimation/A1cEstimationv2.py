import pandas as pd
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.model_selection import train_test_split, KFold, GridSearchCV
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import os
import pickle


class GlucoseDataPreprocessor(BaseEstimator, TransformerMixin):
    def __init__(self, window=21):
        self.window = (
            window // 3
        )  # Calculate rolling windows based on 3 readings per day

    def fit(self, X, y=None):
        return self  # Fitting does nothing as no parameters to learn for preprocessing

    def transform(self, data):
        data["Timestamp"] = pd.to_datetime(data["Timestamp"])
        data["Date"] = data["Timestamp"].dt.date
        grouped = data.groupby(["Patient_ID", "Date"])
        daily_data = (
            grouped["Blood_Glucose"]
            .agg(["mean", "median", "std", "max", "min"])
            .reset_index()
        )
        daily_data["HbA1c"] = grouped["HbA1c"].first().values

        # Rolling features calculated for each glucose statistic
        for feature in ["mean", "median", "std", "max", "min"]:
            daily_data[f"{feature}_rolling_mean"] = daily_data.groupby("Patient_ID")[
                feature
            ].transform(lambda x: x.rolling(self.window, min_periods=1).mean())
            daily_data[f"{feature}_rolling_std"] = daily_data.groupby("Patient_ID")[
                feature
            ].transform(lambda x: x.rolling(self.window, min_periods=1).std())

        # Calculate summary statistics
        daily_data["rolling_mean"] = daily_data[
            [
                f"{feature}_rolling_mean"
                for feature in ["mean", "median", "std", "max", "min"]
            ]
        ].mean(axis=1)
        daily_data["rolling_median"] = daily_data[
            [
                f"{feature}_rolling_mean"
                for feature in ["mean", "median", "std", "max", "min"]
            ]
        ].median(axis=1)
        daily_data["rolling_std"] = daily_data[
            [
                f"{feature}_rolling_std"
                for feature in ["mean", "median", "std", "max", "min"]
            ]
        ].std(axis=1)

        return daily_data.dropna()[
            ["rolling_mean", "rolling_median", "rolling_std", "HbA1c"]
        ]


# Path and data loading
dir_path = os.path.dirname(os.path.realpath(__file__))
os.chdir(dir_path)
diabetes_data = pd.read_csv("../../../Dataset/synthetic_diabetes_data_v6.csv")

# Initialize preprocessor and process data
preprocessor = GlucoseDataPreprocessor()
features_data = preprocessor.transform(diabetes_data)

# Model training setup
X = features_data[["rolling_mean", "rolling_median", "rolling_std"]]
y = features_data["HbA1c"]
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Optimize model parameters
kfold = KFold(n_splits=5, shuffle=True, random_state=42)
param_grid = {"n_estimators": [50, 100, 200], "max_depth": [None, 10, 20, 30]}
grid_search = GridSearchCV(
    RandomForestRegressor(random_state=42), param_grid, cv=kfold, scoring="r2"
)
grid_search.fit(X_train, y_train)
best_rf_model = grid_search.best_estimator_
best_rf_model.fit(X_train, y_train)

# Evaluate the model
y_pred = best_rf_model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Mean Squared Error: {mse}, \nMean Absolute Error: {mae}, \nR-squared: {r2}")

# Save the model and preprocessor
with open("../Models/A1cModel.pkl", "wb") as file:
    pickle.dump({"preprocessor": preprocessor, "model": best_rf_model}, file)
