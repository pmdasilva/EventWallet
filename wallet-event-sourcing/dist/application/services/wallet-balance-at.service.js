"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletBalanceAtService = void 0;
class WalletBalanceAtService {
    eventStore;
    constructor(eventStore) {
        this.eventStore = eventStore;
    }
    async execute(walletId, targetDate) {
        const events = await this.eventStore
            .getEventsByAggregateId(walletId);
        let balance = 0;
        for (const event of events) {
            const occurredAt = new Date(event.occurredAt);
            if (occurredAt > targetDate) {
                continue;
            }
            switch (event.eventType) {
                case "MoneyDepositedEvent": {
                    const { amount } = event.payload;
                    balance += amount;
                    break;
                }
                case "MoneyWithdrawnEvent": {
                    const { amount } = event.payload;
                    balance -= amount;
                    break;
                }
            }
        }
        return {
            walletId,
            balance,
            date: targetDate
        };
    }
}
exports.WalletBalanceAtService = WalletBalanceAtService;
