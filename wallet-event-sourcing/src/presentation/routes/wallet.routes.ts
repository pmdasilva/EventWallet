import { FastifyInstance } from "fastify";

import { getDatabase } from "../../infrastructure/database/mongo";

import { MongoEventStore } from "../../infrastructure/event-store/MongoEventStore";

import { CreateWalletHandler } from "../../application/handlers/create-wallet.handler";
import { createWalletSchema }
    from "../schemas/create-wallet.schema";

export async function walletRoutes(
    app: FastifyInstance
) {

    app.post("/wallets", async (request, reply) => {

        const body = createWalletSchema.parse(
            request.body
        );

        const eventStore = new MongoEventStore(
            getDatabase()
        );

        const handler = new CreateWalletHandler(
            eventStore
        );

        const result = await handler.execute({
            ownerName: body.ownerName
        });

        return reply.status(201).send(result);
    });
}