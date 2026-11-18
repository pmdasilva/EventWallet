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
}
exports.WalletAggregate = WalletAggregate;
