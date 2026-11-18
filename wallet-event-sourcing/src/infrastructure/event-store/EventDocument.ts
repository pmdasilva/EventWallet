export interface EventDocument {
    aggregateId: string;

    eventType: string;

    occurredAt: Date;

    version: number;

    payload: unknown;
}