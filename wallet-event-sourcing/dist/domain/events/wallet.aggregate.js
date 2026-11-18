"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletAggregate = void 0;
const wallet_created_event_1 = require("../events/wallet-created.event");
class WalletAggregate {
    walletId;
    ownerName;
    createdAt;
    apply(event) {
        if (event instanceof wallet_created_event_1.WalletCreatedEvent) {
            this.walletId = event.aggregateId;
            this.ownerName = event.ownerName;
            this.createdAt = event.occurredAt;
        }
    }
    getState() {
        return {
            walletId: this.walletId,
            ownerName: this.ownerName,
            createdAt: this.createdAt
        };
    }
    static rehydrate(events) {
        const aggregate = new WalletAggregate();
        events.forEach(event => aggregate.apply(event));
        return aggregate;
    }
}
exports.WalletAggregate = WalletAggregate;
