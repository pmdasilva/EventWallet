import { EventStore } from "../../domain/repositories/event-store";

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