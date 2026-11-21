import "dotenv/config";
import Fastify from "fastify";

import { connectDatabase } from "../infrastructure/database/mongo";
import { registerTestRoute } from "../presentation/routes/test-route";
import { walletRoutes } from "../presentation/routes/wallet.routes";

const app = Fastify();

async function start() {
    app.addHook("onRequest", async (request, reply) => {
        const origin = request.headers.origin;

        if (origin) {
            reply.header("access-control-allow-origin", origin);
            reply.header("vary", "Origin");
        }

        if (request.method === "OPTIONS") {
            reply.header("access-control-allow-methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
            const requestedHeaders = request.headers["access-control-request-headers"];
            if (requestedHeaders) {
                reply.header("access-control-allow-headers", requestedHeaders);
            }
            return reply.code(204).send();
        }
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