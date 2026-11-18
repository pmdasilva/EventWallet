"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletCreatedEvent = void 0;
const domain_event_1 = require("./domain-event");
class WalletCreatedEvent extends domain_event_1.DomainEvent {
    ownerName;
    payload() {
        return {
            ownerName: this.ownerName
        };
    }
    balance;
    constructor(aggregateId, ownerName) {
        super(aggregateId);
        this.ownerName = ownerName;
    }
}
exports.WalletCreatedEvent = WalletCreatedEvent;
