"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoneyDepositedEvent = void 0;
const domain_event_1 = require("./domain-event");
class MoneyDepositedEvent extends domain_event_1.DomainEvent {
    amount;
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
exports.MoneyDepositedEvent = MoneyDepositedEvent;
