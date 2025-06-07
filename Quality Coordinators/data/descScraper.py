import requests
import os
import re
import time
import csv

def get_wikipedia_page_summary(city_name):
    formatted_city = city_name.replace(' ', '_')
    api_url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{formatted_city}"
    response = requests.get(api_url)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to fetch data for {city_name} (Status code: {response.status_code})")
        return None

def extract_description_from_api(data):
    # Extracting the description text
    if 'extract' in data:
        return data['extract']
    return None

def write_updated_csv(original_file, updated_data, output_file='updated_city_data.csv'):
    # Write the updated data to a new CSV file
    with open(output_file, 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerows(updated_data)

def main():
    # Read the city names from your CSV file
    with open('world_AQI_cleaned.csv', 'r') as file:
        csv_reader = list(csv.reader(file))  # Convert to list to get total count
        header = csv_reader[0]  # The header row
        cities = csv_reader[1:]  # The city data without the header
        total_cities = len(cities)

        # Add a new column to the header for descriptions
        header.append('Description')

        updated_data = [header]  # Start with the header row in the new data

        for index, row in enumerate(cities, start=1):
            city = row[1]  # Assuming the city name is in the second column (index 1)
            print(f"[{index}/{total_cities}] Processing {city}...")

            data = get_wikipedia_page_summary(city)
            
            if data:
                description = extract_description_from_api(data)
                if description:
                    # Append the description to the original row
                    row.append(description)
                    print(f"Description added for {city}")
                else:
                    # Append None if no description is found
                    row.append("No description found")
                    print(f"No description found for {city}")
            else:
                # If no data could be fetched, append None
                row.append("Failed to retrieve data")
                print(f"Failed to retrieve data for {city}")
            
            updated_data.append(row)  # Add the updated row to the list

            time.sleep(0.5)  # To prevent hitting API limits

        # Write the updated data to a new CSV file
        write_updated_csv('world_AQI_cleaned.csv', updated_data)
        print(f"Updated CSV file has been created: 'updated_city_data.csv'")

if __name__ == "__main__":
    main()