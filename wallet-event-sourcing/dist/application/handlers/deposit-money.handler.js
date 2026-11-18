"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepositMoneyHandler = void 0;
const money_deposited_event_1 = require("../../domain/events/money-deposited.event");
class DepositMoneyHandler {
    eventStore;
    walletLoader;
    constructor(eventStore, walletLoader) {
        this.eventStore = eventStore;
        this.walletLoader = walletLoader;
    }
    async execute(command) {
        const aggregate = await this.walletLoader.load(command.walletId);
        const event = aggregate.deposit(command.amount);
        await this.eventStore.append(event);
        switch (event.constructor.name) {
            case "MoneyDepositedEvent":
                return new money_deposited_event_1.MoneyDepositedEvent(event.aggregateId, event.payload().amount);
        }
    }
}
exports.DepositMoneyHandler = DepositMoneyHandler;
