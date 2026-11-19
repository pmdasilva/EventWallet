"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletRoutes = walletRoutes;
const mongo_1 = require("../../infrastructure/database/mongo");
const MongoEventStore_1 = require("../../infrastructure/event-store/MongoEventStore");
const create_wallet_handler_1 = require("../../application/handlers/create-wallet.handler");
const create_wallet_schema_1 = require("../schemas/create-wallet.schema");
const wallet_loader_service_1 = require("../../application/services/wallet-loader.service");
const wallet_events_service_1 = require("../../application/services/wallet-events.service");
const deposit_money_handler_1 = require("../../application/handlers/deposit-money.handler");
const deposit_money_schema_1 = require("../schemas/deposit-money.schema");
const withdraw_money_command_1 = require("../../application/commands/withdraw-money.command");
const withdraw_money_schema_1 = require("../schemas/withdraw-money.schema");
async function walletRoutes(app) {
    app.post("/wallets", async (request, reply) => {
        const body = create_wallet_schema_1.createWalletSchema.parse(request.body);
        const eventStore = new MongoEventStore_1.MongoEventStore((0, mongo_1.getDatabase)());
        const handler = new create_wallet_handler_1.CreateWalletHandler(eventStore);
        const result = await handler.execute({
            ownerName: body.ownerName
        });
        return reply.status(201).send(result);
    });
    app.get("/wallets/:walletId", async (request) => {
        const { walletId } = request.params;
        const eventStore = new MongoEventStore_1.MongoEventStore((0, mongo_1.getDatabase)());
        const loader = new wallet_loader_service_1.WalletLoaderService(eventStore);
        const aggregate = await loader.load(walletId);
        return aggregate.getState();
    });
    app.post("/wallets/:walletId/deposit", async (request, reply) => {
        const { walletId } = request.params;
        const body = deposit_money_schema_1.depositMoneySchema.parse(request.body);
        const eventStore = new MongoEventStore_1.MongoEventStore((0, mongo_1.getDatabase)());
        const loader = new wallet_loader_service_1.WalletLoaderService(eventStore);
        const handler = new deposit_money_handler_1.DepositMoneyHandler(eventStore, loader);
        await handler.execute({
            walletId,
            amount: body.amount
        });
        return reply.status(204).send();
    });
    app.post("/wallets/:walletId/withdraw", async (request, reply) => {
        const { walletId } = request.params;
        const body = withdraw_money_schema_1.withdrawMoneySchema.parse(request.body);
        const eventStore = new MongoEventStore_1.MongoEventStore((0, mongo_1.getDatabase)());
        const loader = new wallet_loader_service_1.WalletLoaderService(eventStore);
        const handler = new withdraw_money_command_1.WithdrawMoneyHandler(eventStore, loader);
        await handler.execute({
            walletId,
            amount: body.amount
        });
        return reply.status(204).send();
    });
    app.get("/wallets/:walletId/events", async (request, reply) => {
        const { walletId } = request.params;
        const eventStore = new MongoEventStore_1.MongoEventStore((0, mongo_1.getDatabase)());
        const walletEventsService = new wallet_events_service_1.WalletEventsService(eventStore);
        const events = await walletEventsService.getEvents(walletId);
        return reply.send(events);
    });
}
