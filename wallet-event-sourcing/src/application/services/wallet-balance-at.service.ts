import { EventStore } from "../../domain/repositories/event-store";

export class WalletBalanceAtService {

    constructor(
        private readonly eventStore: EventStore
    ) { }

    async execute(
        walletId: string,
        targetDate: Date
    ) {
        if (Number.isNaN(targetDate.getTime())) {
            throw new Error("A data para consulta do saldo é inválida.");
        }

        const events =
            await this.eventStore
                .getEventsByAggregateId(walletId);

        let balance = 0;

        for (const event of events) {

            const occurredAt =
                new Date(event.occurredAt);

            if (occurredAt > targetDate) {
                continue;
            }

            switch (event.eventType) {

                case "MoneyDepositedEvent": {

                    const { amount } = event.payload as { amount: number };
                    balance += amount;
                    break;
                }

                case "MoneyWithdrawnEvent": {

                    const { amount } = event.payload as { amount: number };
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