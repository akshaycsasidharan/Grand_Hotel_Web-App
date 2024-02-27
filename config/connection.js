require("dotenv").config();
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI;
const dbName = process.env.DB;

const connectToMongoDB = async () => {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');

        const database = client.db(dbName);

        return database;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};

 module.exports = { connectToMongoDB };

 

 