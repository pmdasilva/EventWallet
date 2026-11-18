"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletLoaderService = void 0;
const wallet_aggregate_1 = require("../../domain/aggregates/wallet.aggregate");
const wallet_created_event_1 = require("../../domain/events/wallet-created.event");
class WalletLoaderService {
    eventStore;
    constructor(eventStore) {
        this.eventStore = eventStore;
    }
    async load(walletId) {
        const events = await this.eventStore
            .getEventsByAggregateId(walletId);
        const domainEvents = events.map(event => {
            switch (event.eventType) {
                case "WalletCreatedEvent":
                    const payload = event.payload;
                    return new wallet_created_event_1.WalletCreatedEvent(event.aggregateId, payload.ownerName);
                default:
                    throw new Error(`Evento não suportado: ${event.eventType}`);
            }
        });
        return wallet_aggregate_1.WalletAggregate
            .rehydrate(domainEvents);
    }
}
exports.WalletLoaderService = WalletLoaderService;
