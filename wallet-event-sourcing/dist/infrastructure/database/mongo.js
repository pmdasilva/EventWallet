"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoClient = void 0;
exports.connectDatabase = connectDatabase;
exports.getDatabase = getDatabase;
const mongodb_1 = require("mongodb");
const uri = process.env.MONGO_URI;
exports.mongoClient = new mongodb_1.MongoClient(uri);
async function connectDatabase() {
    await exports.mongoClient.connect();
    console.log("MongoDB conectado");
}
function getDatabase() {
    return exports.mongoClient.db("walletdb");
}
