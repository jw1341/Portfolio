**Mongo-Project-Quality-Coordinators**

**1. Technology Stack**\
RLES VM
Ubuntu\
Mongodb
Javascript
React
Python

An RLES Ubuntu Linux virtual machine was used according to the project instructions, as it serves as a method to remotely host our mongodb database.
Python was used to create scripts to scrape data from online to add to our dataset, as well as clean data.
Javascript and express were used to connect and send queries to the database.
React was used as the library for our frontend GUI because it allows us to isolate components for increasing coding efficiency, as well as allowing for consisten styling throughout the application's GUI.



**2. Process**
Describe how you loaded your database and what problems you ran into loading it (for
example, data cleansing)

Using Kaggle, we found a dataset on air quality around the world, which included geo locations, various AQIs, country, and city data. To process this dataset, We used Jupyter Notebook along with libraries such as Pandas and NumPy. We cleaned the data by removing records with null values and eliminating duplicates to ensure accuracy. Additionally, to supplement the dataset with images, We developed an image scraper that extracted city images from Wikipedia and stored them in the data/city_images directory. We then loaded the csv and images into our database using mongoimport.
Due to needing longer strings for regex queries, we utilized a second data scraper to extract descriptions of cities from wikipedia and append them to the initial city documents. This set of scraped data had gaps in information provided due to wikipedia's inconsistency with listing all cities, so the data had to be cleaned for impropper results to be replaced with the string "no description found". After this proccess, ~10k of the ~13k documents have full descriptions.


**3. Volume**\
Paste in the result of running countDocuments() on all of your collections
First Submision Files
AQI_Data: 1390\
AQI_images.chunks: 9514\
AQI_images.files: 9447  

**4. Variety**\
List out search terms that yield interesting results in your app; you can be specific, like “click on
search result x after searching for term y to see this and that...”

Search for term "environment" in the description search
Click on the result labeled "Laguna Beach"
You will be able to view the description and air quality rating of Laguna Beach, with the description mentioning its environmental preservation efforts, which may coincide with its displayed high air quality rating.

Click "Albany Air Quality" under "Nearby Locations"
You will be able to view the description and air quality rating of Albany, one of the locations near RIt.

Search the terms "industrial town" and "Venezuela"
Click on the result labeled "Anaco"
You will be able to view the description and air quality rating of Anaco, with the description mentioning that it is an industrial town, which may coincide with its lower air quality rating

**5. Bells and Whistles**
Describe what your group did particularly well; what are you most proud of; what differentiates
your project from the others?

Extensive frontend - Our project features a frontend design that goes beyond the minimum requirements by using consistent styling with dynamic animations. 

Data scraping - Our project also used data scraping to add to our dataset beyond that of other pre-supplied datasets. This allowed us to incorperate info that suits our dataset closer than that which may have been supplied by another dataset.

Dataset scale - Our project has a large size to our dataset, containing over 13 thousand documents to search, the majority of which contain large strings to use regex searches on.

**Authors:**

Anderson Cardenas\
Jason Wu
Logan Shaw
Jason Chen
Junheng Zheng
Ivan Li
