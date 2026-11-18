export abstract class DomainEvent {
    constructor(
        public readonly aggregateId: string,
        public readonly occurredAt: Date = new Date(),
        public readonly version: number = 1
    ) { }

    abstract payload(): Record<string, unknown>;
}