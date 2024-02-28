import numpy as np
import pandas as pd

# Define the parameters for the dummy dataset
num_patients = 100
days = 5  # Number of days to simulate
readings_per_day = 3  # Number of glucose readings per day

# Set a random seed for reproducibility
np.random.seed(42)

# Generate patient IDs
patient_ids = np.arange(1, num_patients + 1)

# Generate patient demographics
ages = np.random.randint(18, 80, num_patients)
genders = np.random.choice(["Female", "Male"], num_patients)
bmis = np.random.uniform(18.5, 40, num_patients)  # A healthy BMI range

# Generate blood glucose readings
# Assuming normal distribution, mean of 120 mg/dL, std of 30 mg/dL, slightly high to account for diabetic range
blood_glucose = np.random.normal(120, 30, (num_patients, days * readings_per_day))

# Calculate HbA1c from blood glucose using a simplified formula: (Average Glucose + 46.7) / 28.7
# Formula is an approximation and not for medical use
hba1c = (np.mean(blood_glucose, axis=1) + 46.7) / 28.7

# Create a DataFrame
df_list = []
for i in range(num_patients):
    for d in range(days):
        for r in range(readings_per_day):
            df_list.append(
                [
                    patient_ids[i],
                    ages[i],
                    genders[i],
                    bmis[i],
                    blood_glucose[i, d * readings_per_day + r],
                    hba1c[i],
                ]
            )

columns = ["Patient_ID", "Age", "Gender", "BMI", "Blood_Glucose", "HbA1c"]
dummy_data = pd.DataFrame(df_list, columns=columns)

# Ensure the dataset has at least 500 rows
assert len(dummy_data) >= 500

# Save the DataFrame to a CSV file
dummy_data.to_csv("Dataset/dummy_diabetes_data.csv", index=False)

print(dummy_data.head())
