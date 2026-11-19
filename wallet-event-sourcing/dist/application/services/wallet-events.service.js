"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletEventsService = void 0;
class WalletEventsService {
    eventStore;
    constructor(eventStore) {
        this.eventStore = eventStore;
    }
    async getEvents(walletId) {
        return this.eventStore
            .getEventsByAggregateId(walletId);
    }
}
exports.WalletEventsService = WalletEventsService;
