"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletLoaderService = void 0;
const wallet_aggregate_1 = require("../../domain/aggregates/wallet.aggregate");
const money_deposited_event_1 = require("../../domain/events/money-deposited.event");
const wallet_created_event_1 = require("../../domain/events/wallet-created.event");
const money_withdrawn_event_1 = require("../../domain/events/money-withdrawn.event");
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
                    return new wallet_created_event_1.WalletCreatedEvent(event.aggregateId, event.payload.ownerName);
                case "MoneyDepositedEvent":
                    return new money_deposited_event_1.MoneyDepositedEvent(event.aggregateId, event.payload.amount);
                case "MoneyWithdrawnEvent":
                    return new money_withdrawn_event_1.MoneyWithdrawnEvent(event.aggregateId, event.payload.amount);
                default:
                    throw new Error(`Evento não suportado: ${event.eventType}`);
            }
        });
        return wallet_aggregate_1.WalletAggregate
            .rehydrate(domainEvents);
    }
}
exports.WalletLoaderService = WalletLoaderService;
