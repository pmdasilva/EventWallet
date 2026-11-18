import { WalletAggregate }
    from "../../domain/aggregates/wallet.aggregate";

import { MongoEventStore }
    from "../../infrastructure/event-store/MongoEventStore";

import { MoneyDepositedEvent }
    from "../../domain/events/money-deposited.event";

import { WalletCreatedEvent }
    from "../../domain/events/wallet-created.event";

import { MoneyWithdrawnEvent }
    from "../../domain/events/money-withdrawn.event";

export class WalletLoaderService {

    constructor(
        private readonly eventStore:
            MongoEventStore
    ) { }

    async load(walletId: string) {

        const events =
            await this.eventStore
                .getEventsByAggregateId(walletId);

        const domainEvents =
            events.map(event => {

                switch (event.eventType) {

                    case "WalletCreatedEvent":

                        return new WalletCreatedEvent(
                            event.aggregateId,
                            (event.payload as { ownerName: string }).ownerName
                        );

                    case "MoneyDepositedEvent":

                        return new MoneyDepositedEvent(
                            event.aggregateId,
                            (event.payload as { amount: number }).amount
                        );

                    case "MoneyWithdrawnEvent":

                        return new MoneyWithdrawnEvent(
                            event.aggregateId,
                            (event.payload as { amount: number }).amount
                        );

                    default:

                        throw new Error(
                            `Evento não suportado: ${event.eventType}`
                        );
                }
            });

        return WalletAggregate
            .rehydrate(domainEvents);
    }
}
