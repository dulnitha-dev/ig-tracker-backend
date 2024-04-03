const client = require("../db.config");
const dbName = "ig-tracker";

const insertToken = async (data) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const tokens = await db.collection("tokens");
    const footprint = await tokens.insertOne(data);
    return footprint;
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
};

const findToken = async (filter) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const tokens = await db.collection("tokens");
    const result = await tokens.find(filter).toArray();
    return result;
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
};

const updateToken = async (filter, newDoc) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const tokens = await db.collection("tokens");
    const footprint = await tokens.updateOne(filter, { $set: newDoc });
    return footprint;
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
};

const insertInvoice = async (data) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const tokens = await db.collection("invoices");
    const footprint = await tokens.insertOne(data);
    return footprint;
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
};

const findInvoice = async (filter) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const tokens = await db.collection("invoices");
    const result = await tokens.find(filter).toArray();
    return result;
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
};

const updateInvoice = async (filter, newDoc) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const tokens = await db.collection("invoices");
    const footprint = await tokens.updateOne(filter, { $set: newDoc });
    return footprint;
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
};

module.exports = { insertToken, findToken, updateToken, insertInvoice, findInvoice, updateInvoice };
