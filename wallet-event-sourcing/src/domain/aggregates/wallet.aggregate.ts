import { WalletCreatedEvent } from "../events/wallet-created.event";

export class WalletAggregate {

    private walletId!: string;

    private ownerName!: string;

    private createdAt!: Date;

    apply(event: WalletCreatedEvent) {

        if (event instanceof WalletCreatedEvent) {

            this.walletId = event.aggregateId;

            this.ownerName = event.ownerName;

            this.createdAt = event.occurredAt;
        }
    }

}