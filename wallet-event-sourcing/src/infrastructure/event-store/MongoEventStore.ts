import { Db } from "mongodb";

import { DomainEvent } from "../../domain/events/domain-event";
import { EventStore } from "../../domain/repositories/event-store";

export class MongoEventStore implements EventStore {

    constructor(
        private readonly database: Db
    ) { }

    async append(
        event: DomainEvent
    ): Promise<void> {

        await this.database
            .collection("wallet_events")
            .insertOne({
                aggregateId: event.aggregateId,

                eventType: event.constructor.name,

                occurredAt: event.occurredAt,

                version: event.version,

                payload: event
            });
    }

    async getEventsByAggregateId(
        aggregateId: string
    ) {

        return this.database
            .collection("wallet_events")
            .find({
                aggregateId
            })
            .sort({
                occurredAt: 1
            })
            .toArray();
    }
}