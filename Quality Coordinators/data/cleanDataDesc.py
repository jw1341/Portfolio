import pandas as pd
import re

# Load the CSV file
file_path = "updated_city_data.csv"  # Replace with your file path
df = pd.read_csv(file_path)

# Function to clean and standardize the description field
def clean_description(desc):
    if pd.isna(desc):
        return ""

    # Step 1: Check for "may refer to" and replace the description
    if "may refer to" in desc.lower():
        return '"No description provided"'
    if "refers to" in desc.lower():
        return '"No description provided"'
    if "can refer to" in desc.lower():
        return '"No description provided"'
    if "also refer to" in desc.lower():
        return '"No description provided"'
    
    
    # Step 2: Ensure the entire description is wrapped in double quotes
    if not (desc.startswith('"') and desc.endswith('"')):
        desc = f'"{desc.strip()}"'

    # Step 3: Replace internal double quotes with single quotes
    desc = desc[0] + desc[1:-1].replace('"', "'") + desc[-1]

    # Step 4: Remove all newlines within the description
    desc = desc.replace('\n', ' ')  # Removes ALL line returns

    # Step 5: Replace multiple spaces with a single space
    desc = re.sub(r'\s+', ' ', desc)

    return desc.strip()

# Apply the cleaning function
df['Description'] = df['Description'].apply(clean_description)

# Save the cleaned data
output_file = "desc_cleaned2.csv"
df.to_csv(output_file, index=False)

print(f"Cleaned file saved as {output_file}")
