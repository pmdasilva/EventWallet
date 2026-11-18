import { DomainEvent } from "../events/domain-event";
import { WalletCreatedEvent } from "../events/wallet-created.event";

export class WalletAggregate {

    private walletId!: string;

    private ownerName!: string;

    private createdAt!: Date;

    apply(event: DomainEvent): void {

        if (event instanceof WalletCreatedEvent) {

            this.walletId = event.aggregateId;

            this.ownerName = event.ownerName;

            this.createdAt = event.occurredAt;
        }
    }

    getState() {
        return {
            walletId: this.walletId,
            ownerName: this.ownerName,
            createdAt: this.createdAt
        };
    }

    static rehydrate(
        events: DomainEvent[]
    ) {

        const aggregate =
            new WalletAggregate();

        events.forEach(event =>
            aggregate.apply(event)
        );

        return aggregate;
    }
}