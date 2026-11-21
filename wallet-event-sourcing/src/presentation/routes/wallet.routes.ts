import { FastifyInstance } from "fastify";

import { getDatabase } from "../../infrastructure/database/mongo";

import { MongoEventStore } from "../../infrastructure/event-store/MongoEventStore";

import { CreateWalletHandler } from "../../application/handlers/create-wallet.handler";
import { createWalletSchema } from "../schemas/create-wallet.schema";

import { WalletLoaderService } from "../../application/services/wallet-loader.service";
import { WalletEventsService } from "../../application/services/wallet-events.service";
import { DepositMoneyHandler } from "../../application/handlers/deposit-money.handler";
import { depositMoneySchema } from "../schemas/deposit-money.schema";
import { WithdrawMoneyHandler } from "../../application/commands/withdraw-money.command";
import { withdrawMoneySchema } from "../schemas/withdraw-money.schema";
import { WalletBalanceAtService } from "../../application/services/wallet-balance-at.service";
import { walletBalanceAtQuerySchema } from "../schemas/wallet-balance-at.schema";

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
        "/wallets/:walletId/deposit",
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

    app.post(
        "/wallets/:walletId/withdraw",
        async (request, reply) => {

            const { walletId } =
                request.params as {
                    walletId: string;
                };

            const body =
                withdrawMoneySchema.parse(
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
                new WithdrawMoneyHandler(
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

    app.get(
        "/wallets/:walletId/events",
        async (request, reply) => {

            const { walletId } =
                request.params as {
                    walletId: string;
                };

            const eventStore =
                new MongoEventStore(
                    getDatabase()
                );

            const walletEventsService =
                new WalletEventsService(eventStore);

            const events =
                await walletEventsService.getEvents(
                    walletId
                );

            return reply.send(events);
        }
    );

    app.get(
        "/wallets/:walletId/balance-at",
        async (request, reply) => {

            const { walletId } =
                request.params as {
                    walletId: string;
                };

            const query =
                walletBalanceAtQuerySchema.safeParse(
                    request.query
                );

            if (!query.success) {
                return reply.status(400).send({
                    message: "Informe date como uma data/hora ISO 8601 válida."
                });
            }

            const service =
                new WalletBalanceAtService(
                    new MongoEventStore(
                        getDatabase()
                    )
                );

            const result =
                await service.execute(
                    walletId,
                    new Date(query.data.date)
                );

            return reply.send(result);
        }
    );



}