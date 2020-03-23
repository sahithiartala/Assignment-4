/* eslint linebreak-style: ["error", "windows"] */

/* eslint no-restricted-globals: "off" */

const fs = require('fs');
require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { MongoClient } = require('mongodb');

const url = process.env.DB_URL || 'mongodb+srv://sahithiartala:SanDiegO15@mongodb-bqwk5.mongodb.net/producttracker?retryWrites=true&w=majority';
const port = process.env.API_SERVER_PORT || 3000;

let db;
// let aboutMessage = 'Product Inventory';
// const productDB = [];

async function productList() {
  const products = await db.collection('products').find({}).toArray();
  console.log(products);
  return products;
}
async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  return result.value.current;
}

async function addProduct(_, { product }) {
  //  product.id = productDB.length + 1;
  const newProduct = { ...product };
  console.log('Added new product to inventory');
  newProduct.id = await getNextSequence('products');
  //  console.log(newProduct.id);
  const result = await db.collection('products').insertOne(newProduct);
  const savedProduct = await db.collection('products')
    .findOne({ _id: result.insertedId });
  return savedProduct;
  //  productDB.push(product);
  //  return product;
}

const resolvers = {
  Query: {
    productList,
  },
  Mutation: {
    addProduct,
  },
};

async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
});

const app = express();

// app.use(express.static('public'));

server.applyMiddleware({ app, path: '/graphql' });
(async function start() {
  try {
    await connectToDb();
    app.listen(port, () => {
      console.log(`API started on port ${port}`);
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
}());
