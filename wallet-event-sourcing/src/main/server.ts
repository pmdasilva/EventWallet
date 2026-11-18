import "dotenv/config";
import Fastify from "fastify";

import { connectDatabase } from "../infrastructure/database/mongo";

import { registerTestRoute } from "../presentation/routes/test-route";
import { walletRoutes } from "../presentation/routes/wallet.routes";

const app = Fastify();

app.get("/health", async () => {
    return {
        status: "ok"
    };
});

registerTestRoute(app);
walletRoutes(app);

async function start() {
    await connectDatabase();

    await app.listen({
        port: Number(process.env.PORT),
        host: "0.0.0.0"
    });
}

start();