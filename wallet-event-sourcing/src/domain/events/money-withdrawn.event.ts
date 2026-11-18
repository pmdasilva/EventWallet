import { DomainEvent } from "./domain-event";

export class MoneyWithdrawnEvent extends DomainEvent {
    eventType: any;

    constructor(
        aggregateId: string,
        public amount: number
    ) {
        super(aggregateId);
    }

    payload() {
        return {
            amount: this.amount
        };
    }
}