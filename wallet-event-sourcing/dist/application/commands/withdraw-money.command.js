"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawMoneyHandler = exports.WithdrawMoneyCommand = void 0;
const money_withdrawn_event_1 = require("../../domain/events/money-withdrawn.event");
class WithdrawMoneyCommand {
    walletId;
    amount;
    constructor(walletId, amount) {
        this.walletId = walletId;
        this.amount = amount;
    }
}
exports.WithdrawMoneyCommand = WithdrawMoneyCommand;
class WithdrawMoneyHandler {
    eventStore;
    walletLoader;
    constructor(eventStore, walletLoader) {
        this.eventStore = eventStore;
        this.walletLoader = walletLoader;
    }
    async execute(command) {
        const aggregate = await this.walletLoader.load(command.walletId);
        const event = aggregate.withdraw(command.amount);
        await this.eventStore.append(event);
        switch (event.eventType) {
            case "MoneyWithdrawnEvent":
                return new money_withdrawn_event_1.MoneyWithdrawnEvent(event.aggregateId, event.payload().amount);
        }
    }
}
exports.WithdrawMoneyHandler = WithdrawMoneyHandler;
