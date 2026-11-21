import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";

import { connectDatabase } from "../infrastructure/database/mongo";
import { registerTestRoute } from "../presentation/routes/test-route";
import { walletRoutes } from "../presentation/routes/wallet.routes";

const app = Fastify();

async function start() {
    await app.register(cors, {
        origin: true,
    });

    registerTestRoute(app);
    walletRoutes(app);

    app.get("/health", async () => {
        return {
            status: "ok",
        };
    });

    await connectDatabase();

    await app.listen({
        host: "0.0.0.0",
        port: Number(process.env.PORT) || 3000,
    });

    console.log("Server running");
}

start().catch((error) => {
    console.error(error);
    process.exit(1);
});