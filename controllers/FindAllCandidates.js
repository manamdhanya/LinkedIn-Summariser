const { MongoClient } = require('mongodb');

const uri = process.env.mongoDB_uri_findCandidate 

const dbName = process.env.mongodb_name; 

async function findAllCustomers() {
  const client = new MongoClient(uri);

  try {
    await client.connect()

    const db = client.db(dbName);
    const collection = db.collection("exsistingcandidatesdbs")
    const result = await collection.find({}).toArray()
    return result

  } catch (err) {
    console.error("Error connecting to or querying MongoDB:", err)
  } finally {
    await client.close()
  }
}

module.exports = {findAllCustomers}