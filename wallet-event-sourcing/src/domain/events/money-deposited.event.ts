import { DomainEvent } from "./domain-event";

export class MoneyDepositedEvent extends DomainEvent {

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