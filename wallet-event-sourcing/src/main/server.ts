import "dotenv/config";
import Fastify from "fastify";
import { connectDatabase } from "../infrastructure/database/mongo";
import { registerTestRoute } from "../presentation/routes/test-route";
import { walletRoutes } from "../presentation/routes/wallet.routes";

const app = Fastify();

app.register(cors, {
    origin: true,
})

app.register(walletRoutes)

app.register(cors, {
    origin: [
        'https://event-wallet-tau.vercel.app',
    ],
});

app.addHook("onRequest", async (request, reply) => {
    const origin = request.headers.origin;

    if (origin) {
        reply.header("Access-Control-Allow-Origin", origin);
        reply.header("Vary", "Origin");
        reply.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");

        const requestedHeaders = request.headers["access-control-request-headers"];
        if (requestedHeaders) {
            reply.header("Access-Control-Allow-Headers", requestedHeaders);
        }
    }

    if (request.method === "OPTIONS") {
        return reply.code(204).send();
    }
});

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
        port: Number(process.env.PORT) || 3000,
    });
}

start();