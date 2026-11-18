import { DomainEvent } from "../events/domain-event";
import { WalletCreatedEvent } from "../events/wallet-created.event";

export class WalletAggregate {

    private walletId!: string;

    private ownerName!: string;

    private createdAt?: Date;

    private balance?: number = 0;

    apply(event: DomainEvent): void {

        if (event instanceof WalletCreatedEvent) {

            this.walletId = event.aggregateId;

            this.ownerName = event.ownerName;

            this.createdAt = event.occurredAt;


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

    getState() {
        return {
            walletId: this.walletId,
            ownerName: this.ownerName,
            createdAt: this.createdAt,
            balance: this.balance
        };
    }
}