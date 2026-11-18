"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoneyWithdrawnEvent = void 0;
const domain_event_1 = require("./domain-event");
class MoneyWithdrawnEvent extends domain_event_1.DomainEvent {
    amount;
    eventType;
    constructor(aggregateId, amount) {
        super(aggregateId);
        this.amount = amount;
    }
    payload() {
        return {
            amount: this.amount
        };
    }
}
exports.MoneyWithdrawnEvent = MoneyWithdrawnEvent;
