import { WalletAggregate }
    from "../../domain/aggregates/wallet.aggregate";

import { MongoEventStore }
    from "../../infrastructure/event-store/MongoEventStore";

import { WalletCreatedEvent }
    from "../../domain/events/wallet-created.event";

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

                        const payload = event.payload as {
                            ownerName: string;
                        };

                        return new WalletCreatedEvent(
                            event.aggregateId,
                            payload.ownerName
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
