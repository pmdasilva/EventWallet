import { FastifyInstance } from "fastify";

import { getDatabase } from "../../infrastructure/database/mongo";

import { MongoEventStore } from "../../infrastructure/event-store/MongoEventStore";

import { CreateWalletHandler } from "../../application/handlers/create-wallet.handler";
import { createWalletSchema } from "../schemas/create-wallet.schema";

import { WalletLoaderService } from "../../application/services/wallet-loader.service";
import { DepositMoneyHandler } from "../../application/handlers/deposit-money.handler";
import { depositMoneySchema } from "../schemas/deposit-money.schema";

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
            eventStore as unknown as ConstructorParameters<typeof CreateWalletHandler>[0]
        );

        const result = await handler.execute({
            ownerName: body.ownerName
        });

        return reply.status(201).send(result);
    });

    app.get(
        "/wallets/:walletId",
        async (request) => {

            const { walletId } =
                request.params as {
                    walletId: string
                };

            const eventStore =
                new MongoEventStore(
                    getDatabase()
                );

            const loader =
                new WalletLoaderService(
                    eventStore
                );

            const aggregate =
                await loader.load(walletId) as unknown as {
                    getState(): unknown
                };

            return aggregate.getState();
        }
    );

    app.post(
        "/wallets/  /deposit",
        async (request, reply) => {

            const { walletId } =
                request.params as {
                    walletId: string;
                };

            const body =
                depositMoneySchema.parse(
                    request.body
                );

            const eventStore =
                new MongoEventStore(
                    getDatabase()
                );

            const loader =
                new WalletLoaderService(
                    eventStore
                );

            const handler =
                new DepositMoneyHandler(
                    eventStore,
                    loader
                );

            await handler.execute({
                walletId,
                amount: body.amount
            });

            return reply.status(204).send();
        }
    );


}