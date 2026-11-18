"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletAggregate = void 0;
const wallet_created_event_1 = require("../events/wallet-created.event");
const money_deposited_event_1 = require("../events/money-deposited.event");
const money_withdrawn_event_1 = require("../events/money-withdrawn.event");
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
        if (event instanceof money_deposited_event_1.MoneyDepositedEvent) {
            this.balance += event.amount;
        }
        if (event instanceof money_withdrawn_event_1.MoneyWithdrawnEvent) {
            this.balance -= event.amount;
        }
    }
    static rehydrate(events) {
        const aggregate = new WalletAggregate();
        for (const event of events) {
            aggregate.apply(event);
        }
        return aggregate;
    }
    deposit(amount) {
        if (amount <= 0) {
            throw new Error("Deposit amount must be greater than zero");
        }
        return new money_deposited_event_1.MoneyDepositedEvent(this.walletId, amount);
    }
    withdraw(amount) {
        if (amount <= 0) {
            throw new Error("Withdrawal amount must be greater than zero");
        }
        if (amount > this.balance) {
            throw new Error("Insufficient balance");
        }
        return new money_withdrawn_event_1.MoneyWithdrawnEvent(this.walletId, amount);
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
