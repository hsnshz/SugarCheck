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
