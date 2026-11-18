export abstract class DomainEvent {
    constructor(
        public aggregateId: string,
        public occurredAt: Date = new Date(),
        public version: number = 1
    ) { }
}