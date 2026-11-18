"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletAggregate = void 0;
const wallet_created_event_1 = require("../events/wallet-created.event");
class WalletAggregate {
    walletId;
    ownerName;
    createdAt;
    balance = 0;
    apply(event) {
        if (event instanceof wallet_created_event_1.WalletCreatedEvent) {
            this.walletId = event.aggregateId;
            this.ownerName = event.ownerName;
            this.createdAt = event.occurredAt;
        }
    }
    static rehydrate(events) {
        const aggregate = new WalletAggregate();
        for (const event of events) {
            aggregate.apply(event);
        }
        return aggregate;
    }
    getState() {
        return {
            walletId: this.walletId,
            ownerName: this.ownerName,
            createdAt: this.createdAt,
            balance: this.balance
        };
    }
}
exports.WalletAggregate = WalletAggregate;
