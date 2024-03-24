const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri = process.env.DB_STRING;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

module.exports = client;
