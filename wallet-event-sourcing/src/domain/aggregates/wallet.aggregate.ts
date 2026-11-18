import { DomainEvent } from "../events/domain-event";
import { WalletCreatedEvent } from "../events/wallet-created.event";
import { MoneyDepositedEvent } from "../events/money-deposited.event";

export class WalletAggregate {

    private walletId!: string;

    private ownerName!: string;

    private createdAt?: Date;

    private balance: number = 0;

    apply(event: DomainEvent) {

        if (event instanceof WalletCreatedEvent) {

            this.walletId = event.aggregateId;

            this.ownerName = event.ownerName;

            this.createdAt = event.occurredAt;
        }

        if (event instanceof MoneyDepositedEvent) {

            this.balance += event.amount;
        }
    }

    static rehydrate(
        events: DomainEvent[]
    ): WalletAggregate {

        const aggregate =
            new WalletAggregate();

        for (const event of events) {
            aggregate.apply(event);
        }

        return aggregate;
    }

    deposit(amount: number) {

        if (amount <= 0) {

            throw new Error(
                "Deposit amount must be greater than zero"
            );
        }

        return new MoneyDepositedEvent(
            this.walletId,
            amount
        );
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