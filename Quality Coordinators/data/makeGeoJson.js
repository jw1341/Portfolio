// mongoimport --db AQI --collection AQI_Data --type csv --file desc_cleaned.csv --headerline
// mongosh makeGeoJson.js

const connection = new Mongo(`localhost:27017`),
    db = connection.getDB(`AQI`),
    aqi = db.getCollection(`AQI_Data`);

// result = aqi.updateMany(
//     {},
//     [
//         {
//             $set: {
//                 location: {
//                     type: "Point",
//                     coordinates: ["$longitude", "$latitude"]
//                 }
//             }
//         },
//         {$unset: ["longitude", "latitude"]}
//     ]
// )
// aqi.createIndex({location: "2dsphere"});
    

function findNearbyCities(latitude, longitude) {
  aqi.find({
    loction:{
        $near:{
            $geometry:{
                type:"Point",
                coordinates:[longitude,latitude]
            },$maxDistance: 50000
        }
    }
  }
).limit(4).forEach(element=>{
    printjson(element)})
};

findNearbyCities(-51,-21)