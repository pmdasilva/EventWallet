import { DomainEvent } from "./domain-event";

export class WalletCreatedEvent extends DomainEvent {

    constructor(
        aggregateId: string,
        public ownerName: string
    ) {
        super(aggregateId);
    }

}