"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const fastify_1 = __importDefault(require("fastify"));
const mongo_1 = require("../infrastructure/database/mongo");
const test_route_1 = require("../presentation/routes/test-route");
const wallet_routes_1 = require("../presentation/routes/wallet.routes");
const app = (0, fastify_1.default)();
app.get("/health", async () => {
    return {
        status: "ok"
    };
});
(0, test_route_1.registerTestRoute)(app);
(0, wallet_routes_1.walletRoutes)(app);
async function start() {
    await (0, mongo_1.connectDatabase)();
    await app.listen({
        port: Number(process.env.PORT) || 3000,
    });
}
start();
