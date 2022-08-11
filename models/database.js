/**
 * Temporary database connection check
 */

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect(err => {
    const collection = client.db("WebWeaver").collection("Users");
    // perform actions on the collection object
    client.close();
});

// ---

class Database {

}

module.exports = Database;