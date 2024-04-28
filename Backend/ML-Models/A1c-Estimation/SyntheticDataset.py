# Import necessary libraries
import numpy as np
import pandas as pd
import datetime

# Define simulation parameters
num_patients = 49
days = 90  # 3 months
readings_per_day = 3  # Morning, Afternoon, Evening

# Set a random seed for reproducibility
np.random.seed(42)

# Patient demographics
patient_ids = np.arange(1, num_patients + 1)
ages = np.random.randint(18, 82, num_patients)
genders = np.random.choice(["Female", "Male"], num_patients)
bmis = np.round(np.random.uniform(18.5, 40, num_patients), 2)

# Generate timestamps for glucose readings
start_date = datetime.date.today() - datetime.timedelta(days=days)
timestamps = pd.date_range(start=start_date, periods=days * readings_per_day, freq="8H")


# Function to simulate glucose readings
def simulate_glucose_readings(num_days, readings_per_day, category, bmi, age, gender):
    # Calculate a BMI factor based on a quadratic relationship with glucose levels
    bmi_factor = ((bmi - 25) ** 2) * 0.01

    # Interaction with age and gender
    if gender == "Female":
        bmi_factor *= 1.1
    bmi_factor *= 1 + 0.01 * (age - 50)

    # Initialize glucose readings list
    glucose_readings = []

    # Define max thresholds for each category
    max_thresholds = {"non_diabetic": 140, "pre_diabetic": 200, "diabetic": 260}

    # Loop over each day and reading
    for day in range(num_days):
        for reading in range(readings_per_day):
            # Set base glucose levels for different categories
            if category == "non_diabetic":
                base = np.random.normal(70, 10)
            elif category == "pre_diabetic":
                base = np.random.normal(110, 18)
            else:  # diabetic
                base = np.random.normal(135, 24)

            # Simulate glucose reading variation due to BMI only for the first reading of the day
            if reading == 0:
                base += bmi_factor

            # Simulate random daily variability
            daily_variation = np.random.normal(0, 5)

            # Simulate meal responses
            if reading > 0:  # Assume first reading is fasting
                meal_response = (
                    np.random.normal(18, 10)
                    if category != "non_diabetic"
                    else np.random.normal(10, 5)
                )
                base += meal_response

            # Adjust for medication or exercise
            medication_effect = -5 if np.random.rand() < 0.4 else 0  # 40% chance
            exercise_effect = -5 if np.random.rand() < 0.2 else 0  # 20% chance

            # Combine all effects
            reading_value = base + daily_variation + medication_effect + exercise_effect

            # Ensure glucose readings are within a realistic range
            reading_value = max(min(reading_value, max_thresholds[category]), 50)

            glucose_readings.append(reading_value)

    return np.array(glucose_readings)


# Function to simulate HbA1c from glucose readings
def simulate_hba1c_from_glucose(glucose_readings):
    # Calculate the mean glucose level
    mean_glucose = np.mean(glucose_readings)

    # Simulate HbA1c level based on the mean glucose
    hba1c = (46.7 + mean_glucose) / 28.7

    # Add some random biological variability
    hba1c += np.random.normal(0, 0.2)

    return np.round(hba1c, 1)


# Generate synthetic dataset
df_list = []
for patient_id in patient_ids:
    # Randomly assign each patient to a category
    category = np.random.choice(
        ["non_diabetic", "pre_diabetic", "diabetic"], p=[0.2, 0.3, 0.5]
    )

    # Retrieve the BMI, age and gender for the patient
    bmi = bmis[patient_id - 1]
    age = ages[patient_id - 1]
    gender = genders[patient_id - 1]

    # Simulate glucose readings and HbA1c levels
    glucose_readings = simulate_glucose_readings(
        days, readings_per_day, category, bmi, age, gender
    )
    hba1c = simulate_hba1c_from_glucose(glucose_readings)

    # Compile patient data into the dataframe list
    for i in range(days * readings_per_day):
        df_list.append(
            [
                patient_id,
                timestamps[i % (days * readings_per_day)].strftime("%Y-%m-%d %H:%M:%S"),
                ages[patient_id - 1],
                genders[patient_id - 1],
                bmi,
                glucose_readings[i],
                hba1c,
            ]
        )

# Define dataframe columns
columns = ["Patient_ID", "Timestamp", "Age", "Gender", "BMI", "Blood_Glucose", "HbA1c"]

# Create dataframe
dummy_data = pd.DataFrame(df_list, columns=columns)

print("\nDataset generated and saved\n")


# Save the dataframe to a CSV file
dummy_data.to_csv(
    "Dataset/synthetic_diabetes_data_v6.csv", index=False, float_format="%.2f"
)
