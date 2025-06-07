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

def extract_image_url_from_api(data):
    if 'thumbnail' in data and 'source' in data['thumbnail']:
        return data['thumbnail']['source']
    if 'originalimage' in data and 'source' in data['originalimage']:
        return data['originalimage']['source']
    return None

def download_image(image_url, city_name, output_dir='.'):
    if not image_url.startswith('http'):
        image_url = 'https:' + image_url
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    }
    
    try:
        response = requests.get(image_url, headers=headers, stream=True, timeout=10)
        if response.status_code == 200:
            os.makedirs(output_dir, exist_ok=True)
            file_extension = os.path.splitext(image_url)[1]
            if not file_extension:
                file_extension = '.jpg'
            
            filename = re.sub(r'[\\/*?:"<>|]', "", city_name)
            file_path = os.path.join(output_dir, f"{filename}{file_extension}")
            
            with open(file_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            print(f"Image downloaded for {city_name}: {file_path}")
            return file_path
        else:
            print(f"Failed to download image for {city_name} (Status code: {response.status_code})")
            return None
    except requests.RequestException as e:
        print(f"Error downloading image for {city_name}: {e}")
        return None

def main():
    with open('world_AQI_cleaned.csv', 'r') as file:
        csv_reader = list(csv.reader(file))  # Convert to list to get total count
        header = csv_reader[0]
        cities = csv_reader[1:]
        total_cities = len(cities)
        output_dir = 'city_images'
        
        for index, row in enumerate(cities, start=1):
            city = row[1]  # Assuming the city name is in the second column (index 1)
            print(f"[{index}/{total_cities}] Processing {city}...")

            data = get_wikipedia_page_summary(city)
            
            if data:
                image_url = extract_image_url_from_api(data)
                if image_url:
                    download_image(image_url, city, output_dir)
                else:
                    print(f"No image found for {city}")
            else:
                print(f"Failed to retrieve data for {city}")
            
            time.sleep(0.5)

if __name__ == "__main__":
    main()
