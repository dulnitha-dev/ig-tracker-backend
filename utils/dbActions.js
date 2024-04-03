const client = require("../db.config");
const dbName = "ig-tracker";

const connectDB = async () => {
  try {
    await client.connect();
    console.log("Database Connected");
  } catch (error) {
    console.error(error);
  }
};

const disConnectDB = async () => {
  await client.close();
  console.log("Database Disconnected");
};

const insertToken = async (data) => {
  const db = client.db(dbName);
  const tokens = await db.collection("tokens");
  const footprint = await tokens.insertOne(data);
  return footprint;
};

const findToken = async (filter) => {
  const db = client.db(dbName);
  const tokens = await db.collection("tokens");
  const result = await tokens.find(filter).toArray();
  return result;
};

const updateToken = async (filter, newDoc) => {
  const db = client.db(dbName);
  const tokens = await db.collection("tokens");
  const footprint = await tokens.updateOne(filter, { $set: newDoc });
  return footprint;
};

const insertInvoice = async (data) => {
  const db = client.db(dbName);
  const tokens = await db.collection("invoices");
  const footprint = await tokens.insertOne(data);
  return footprint;
};

const findInvoice = async (filter) => {
  const db = client.db(dbName);
  const tokens = await db.collection("invoices");
  const result = await tokens.find(filter).toArray();
  return result;
};

const updateInvoice = async (filter, newDoc) => {
  const db = client.db(dbName);
  const tokens = await db.collection("invoices");
  const footprint = await tokens.updateOne(filter, { $set: newDoc });
  return footprint;
};

module.exports = {
  connectDB,
  disConnectDB,
  insertToken,
  findToken,
  updateToken,
  insertInvoice,
  findInvoice,
  updateInvoice,
};
