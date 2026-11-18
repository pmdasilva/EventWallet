import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI!;

export const mongoClient = new MongoClient(uri);

export async function connectDatabase() {
    await mongoClient.connect();

    console.log("MongoDB conectado");
}

export function getDatabase() {
    return mongoClient.db("walletdb");
}