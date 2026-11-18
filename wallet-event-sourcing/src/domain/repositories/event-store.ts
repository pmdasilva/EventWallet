import { EventDocument } from "../../infrastructure/event-store/EventDocument";
import { DomainEvent } from "../events/domain-event";

export interface EventStore {
    append(event: DomainEvent): Promise<void>;

    getEventsByAggregateId(
        aggregateId: string
    ): Promise<EventDocument[]>;
}

export { EventDocument };
