import { DomainEvent } from "./domain-event";

export class WalletCreatedEvent extends DomainEvent {
    payload(): Record<string, unknown> {
        return {
            ownerName: this.ownerName
        };
    }

    balance: number | undefined;

    constructor(
        aggregateId: string,
        public ownerName: string
    ) {
        super(aggregateId);
    }

}