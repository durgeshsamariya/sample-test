const express = require("express");
const mongodb = require("mongodb");

//
// Starts the microservice.
//
async function startMicroservice(dbhost, dbname, port) {
    const client = await mongodb.MongoClient.connect(dbhost); // Connects to the database.
    const db = client.db(dbname);
    const videosCollection = db.collection("videos");

    const app = express();

    //
    // HTTP GET route to retrieve list of videos from the database.
    //
    app.get("/videos", async (req, res) => {
        const videos = await videosCollection.find().toArray(); // In a real application this should be paginated.
        res.json({
            videos: videos
        });
    });

    // Add other route handlers here.

    app.listen(port, () => { // Starts the HTTP server.
        console.log("Microservice online.");
    });
}

//
// Application entry point.
//
async function main() {
    if (!process.env.PORT) {
        throw new Error("Please specify the port number for the HTTP server with the environment variable PORT.");
    }
    
    if (!process.env.DBHOST) {
        throw new Error("Please specify the databse host using environment variable DBHOST.");
    }

    if (!process.env.DBNAME) {
        throw new Error("Please specify the databse name using environment variable DBNAME.");
    }
    
	const PORT = process.env.PORT;
    const DBHOST = process.env.DBHOST;
    const DBNAME = process.env.DBNAME;
        
    await startMicroservice(DBHOST, DBNAME, PORT);
}

main()
    .catch(err => {
        console.error("Microservice failed to start.");
        console.error(err && err.stack || err);
    });
