const express = require('express');
const { MongoClient,GridFSBucket} = require('mongodb');
const cors = require('cors');
const base64 = require('base-64');
const app = express();

app.use(cors());
app.use(express.json()); // For parsing JSON requests

// MongoDB Connection URI with credentials
// const uri = "mongodb://mongoapp:huMONGOu5@qualitycoordinators.webdev.gccis.rit.edu:27017";

const uri = "mongodb://localhost:27017";

// Create a new MongoClient instance
const client = new MongoClient(uri, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

let db, aqiCollection;

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db('AQI'); // Specify the database name
    aqiCollection = db.collection('AQI_Data'); // Specify the collection name
    gridFSBucket = new GridFSBucket(db, { bucketName: "AQI_images" })
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    // Implement reconnection logic if needed
    setTimeout(connectToDatabase, 5000); // Try to reconnect after 5 seconds
  }
}

// Initial connection
connectToDatabase();

// for filter
app.get("/filter", async (req, res) => {
  try {
    const { query } = req.query;

    // Allow single words and sentences, but reject completely empty queries

   // Create regex to match words that start with the query
    const regexPattern = query
    .trim()
    .split(/\s+/) // Split query into words
    .map(word => `(?=.*^${word})`) // Ensure each word starts with the given letters
    .join(""); 

    const searchRegex = new RegExp(regexPattern, "i"); // Case-insensitive

    // Search for matches in City, Country, or Description
    const results = await aqiCollection.find({
    $or: [
      { City: searchRegex },
      { Country: searchRegex },
      { Description: searchRegex }
    ]
    },
    { projection: { _id: 0, City: 1, Country: 1} })
    .toArray();


    if (results.length === 0) {
      return res.status(404).json({ error: "No matching records found" });
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/add_comment", async (req, res) => {
  try {
    const { document_id, comment_text, user } = req.body;
    // Update the document by pushing a new comment into the "comments" array
    const result = await aqiCollection.updateOne(
      { _id: new ObjectId(document_id) }, // Convert document_id to ObjectId
      { $push: { comments: { user, text: comment_text, timestamp: new Date() } } } // Append comment
    );

    if (result.modifiedCount > 0) {
      res.json({ message: "Comment added successfully." });
    } else {
      res.status(404).json({ error: "No document updated. Check if the ID exists." });
    }
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Retrieve Comments for a Specific Document
app.get("/get_comments/:document_id", async (req, res) => {
  try {
    const { document_id } = req.params;

    // Validate ObjectId format
    if (!ObjectId.isValid(document_id)) {
      return res.status(400).json({ error: "Invalid document ID format" });
    }

    // Find the document by ID
    const document = await aqiCollection.findOne(
      { _id: new ObjectId(document_id) },
      { projection: { comments: 1, _id: 0 } } // Only retrieve the comments field
    );

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json({ comments: document.comments || [] });
  } catch (error) {
    console.error("Error retrieving comments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Search Route
app.get("/search", async (req, res) => {
  try {
    const { query } = req.query;

    // Allow single words and sentences, but reject completely empty queries
    if (!query || query.trim() === "") {
      return res.status(400).json({ error: "Query cannot be empty" });
    }

    // Create regex to match all words in the query
    // Create regex to match all words in the query
    const regexPattern = query
    .trim()
    .split(/\s+/) // Split query into words
    .map(word => `\\b${word}\\b`) // Match each word as a whole word
    .join(".*"); // Allow any characters between words (including spaces)
    
const regex = new RegExp(regexPattern, "i"); // Case-insensitive search, adjust flags as necessary

    const searchRegex = new RegExp(regexPattern, "i"); // Case-insensitive

    // Search for matches in City first
    const cityResults = await aqiCollection.find({
      City: searchRegex
    }, {
      projection: { _id: 0, City: 1, Description: 1 }
    }).limit(7).toArray();

    // Then search for matches in Description
    const descriptionResults = await aqiCollection.find({
      Description: searchRegex
    }, {
      projection: { _id: 0, City: 1, Description: 1 }
    }).limit(7).toArray();

    // Combine the results, prioritizing City results first
    const combinedResults = [...cityResults, ...descriptionResults];

    // Optionally remove duplicates (if same City appears in both)
    const uniqueResults = [
      ...new Map(combinedResults.map(item => [item.City, item])).values()
    ];

    return res.json(uniqueResults);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/images", async (req, res) => {
  try {
    const fsFilesColl = db.collection("fs.files");
    const cursor = fsFilesColl.find({}).sort({ _id: -1 });

    const images = [];

    for await (const item of cursor) {
      console.log(item);

      const downloadStream = gridFSBucket.openDownloadStream(item._id);
      let imageData = [];

      for await (const chunk of downloadStream) {
        imageData.push(chunk);
      }

      const buffer = Buffer.concat(imageData);
      const encodeString = buffer.toString("base64");

      images.push({
        encoded_string: encodeString,
        filename: item.filename,
        metadata: item.metadata,
      });
    }

    res.json(images);
  } catch (error) {
    console.error("Error retrieving images:", error);
    res.status(500).json({ error: "Failed to retrieve images" });
  }
});

app.get("/single", async (req, res) => {
  try {
    const { query } = req.query;

    // Ensure query is not empty
    if (!query || query.trim() === "") {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    // Search for an exact match in the 'City' field
    const cityResults = await aqiCollection.find({
      City: query.trim() // Exact match search for City
    }, {
      projection: { _id: 0, AQI_value: 1, AQI_category: 1, CO_AQI_value: 1 , CO_AQI_category: 1, Ozone_AQI_value: 1, Ozone_AQI_category: 1, NO2_AQI_value: 1, NO2_AQI_category: 1, PM2_5_AQI_value: 1, PM2_5_AQI_category: 1}
    }).limit(7).toArray();

    // Return the results
    return res.json(cityResults);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // For potential testing

//db.aqiCollection.find();