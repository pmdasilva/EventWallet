import { FastifyInstance } from "fastify";

import { MongoEventStore } from "../../infrastructure/event-store/MongoEventStore";
import { getDatabase } from "../../infrastructure/database/mongo";
import { DomainEvent } from "../../domain/events/domain-event";

class TestEvent extends DomainEvent {
    constructor(
        aggregateId: string,
        public name: string
    ) {
        super(aggregateId);
    }
}

export async function registerTestRoute(
    app: FastifyInstance
) {

    app.post("/test-event", async () => {

        const store = new MongoEventStore(
            getDatabase()
        );

        const event = new TestEvent(
            crypto.randomUUID(),
            "evento teste"
        );

        await store.append(event);

        return {
            success: true
        };
    });
}