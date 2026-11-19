interface EventStore {
    getEventsByAggregateId(walletId: string): unknown;
}

export class WalletEventsService {

    constructor(
        private readonly eventStore: EventStore
    ) { }

    async getEvents(
        walletId: string
    ) {

        return this.eventStore
            .getEventsByAggregateId(
                walletId
            );
    }
}