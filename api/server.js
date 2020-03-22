
const fs = require('fs');
require('dotenv').config();
const express = require('express');
const { ApolloServer, UserInputError  } = require('apollo-server-express');
const { MongoClient } = require('mongodb');
const url = process.env.DB_URL ||'mongodb+srv://sahithiartala:SanDiegO15@mongodb-bqwk5.mongodb.net/producttracker?retryWrites=true&w=majority';
const port = process.env.API_SERVER_PORT || 3000;

let db;
let aboutMessage = "Product Inventory";
const productDB = [];


const resolvers = {
  Query: {
    
    productList,
  },
  Mutation: {
    
    addProduct,
  },
 
};

async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  return result.value.current;
}

async function productList() {

  const products = await db.collection('products').find({}).toArray();
  return products;
  

}
async function addProduct(_, { product }) {
 
  //product.id = productDB.length + 1;
  product.id = await getNextSequence('products');
  const result = await db.collection('products').insertOne(product);
  const savedProduct = await db.collection('products')
    .findOne({ _id: result.insertedId });
  return savedProduct;
  //productDB.push(product);
  //return product;
}

  

async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}



const server = new ApolloServer({
  typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
  resolvers,
});

const app = express();

//app.use(express.static('public'));

server.applyMiddleware({ app, path: '/graphql' });
(async function () {
  try {
    await connectToDb();
    app.listen(port, function () {
      console.log(`API server started on port ${port}`);
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
})();
