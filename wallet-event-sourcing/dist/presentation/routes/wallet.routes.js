"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletRoutes = walletRoutes;
const mongo_1 = require("../../infrastructure/database/mongo");
const MongoEventStore_1 = require("../../infrastructure/event-store/MongoEventStore");
const create_wallet_handler_1 = require("../../application/handlers/create-wallet.handler");
async function walletRoutes(app) {
    app.post("/wallets", async (request, reply) => {
        const body = request.body;
        const eventStore = new MongoEventStore_1.MongoEventStore((0, mongo_1.getDatabase)());
        const handler = new create_wallet_handler_1.CreateWalletHandler(eventStore);
        const result = await handler.execute({
            ownerName: body.ownerName
        });
        return reply.status(201).send(result);
    });
}
