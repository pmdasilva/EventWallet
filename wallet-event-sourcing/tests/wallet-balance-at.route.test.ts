import assert from "node:assert/strict";
import test from "node:test";
import Fastify from "fastify";

test("returns 400 when the historical balance date is invalid", async () => {
    process.env.COMPOSE_MONGO_URI ??= "mongodb://localhost:27017";
    const { walletRoutes } = await import("../src/presentation/routes/wallet.routes");
    const app = Fastify();
    await walletRoutes(app);

    try {
        const response = await app.inject({
            method: "GET",
            url: "/wallets/wallet-1/balance-at?date=not-a-date"
        });

        assert.equal(response.statusCode, 400);
        assert.match(response.json().message, /ISO 8601/);
    } finally {
        await app.close();
    }
});
