import pandas as pd
import numpy as np
import os

# Get the absolute path of the directory where the script is located
dir_path = os.path.dirname(os.path.realpath(__file__))

# Change the current working directory to the directory where the script is located
os.chdir(dir_path)

# Load the original dataset
df = pd.read_csv("../../Dataset/diabetes_data_upload.csv")

# Determine the current counts for each gender and class combination
current_counts = df.groupby(["Gender", "class"]).size().reset_index(name="counts")

# Generate random target counts for each combination
np.random.seed(0)  # for reproducibility
total_target = np.random.randint(850, 1040)  # random total target count
targets = np.random.multinomial(
    total_target, [0.25, 0.25, 0.25, 0.25]
)  # random split among groups

# Identify the shortfall to reach the target counts
shortfalls = {}
for i, (gender, diabetes_class) in enumerate(
    [
        ("Male", "Positive"),
        ("Male", "Negative"),
        ("Female", "Positive"),
        ("Female", "Negative"),
    ]
):
    current_count = current_counts[
        (current_counts["Gender"] == gender)
        & (current_counts["class"] == diabetes_class)
    ]["counts"].sum()
    shortfall = max(0, targets[i] - current_count)
    shortfalls[(gender, diabetes_class)] = shortfall


# Adjusted function to generate synthetic data considering class-specific distributions
def generate_synthetic_data_for_class(df, gender, diabetes_class, num_records):
    synthetic_df = pd.DataFrame()
    for column in df.columns:
        if column in ["Gender", "class"]:  # These will be set explicitly later
            continue
        if df[column].dtype == np.number:
            mean, std = (
                df[df["class"] == diabetes_class][column].mean(),
                df[df["class"] == diabetes_class][column].std(),
            )
            synthetic_df[column] = np.random.normal(mean, std, num_records)
        else:
            # For categorical columns, replicate the distribution seen in the specific class
            values, counts = np.unique(
                df[df["class"] == diabetes_class][column], return_counts=True
            )
            probs = counts / counts.sum()
            synthetic_df[column] = np.random.choice(values, p=probs, size=num_records)
    synthetic_df["Gender"] = gender
    synthetic_df["class"] = diabetes_class
    return synthetic_df


# Generate the required synthetic data for each group
synthetic_dfs = []
for (gender, diabetes_class), shortfall in shortfalls.items():
    if shortfall > 0:
        synthetic_df = generate_synthetic_data_for_class(
            df, gender, diabetes_class, shortfall
        )
        synthetic_dfs.append(synthetic_df)

# Combine the synthetic data with the original dataset
if synthetic_dfs:
    synthetic_data = pd.concat(synthetic_dfs, ignore_index=True)
    balanced_df = pd.concat([df, synthetic_data], ignore_index=True)
else:
    balanced_df = df.copy()

# Save the balanced dataset to a new CSV file
balanced_df.to_csv(
    "../../Dataset/balanced_diabetes_data.csv",
    index=False,
)

print("Dataset balancing complete. The balanced dataset has been saved.")
