"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTestRoute = registerTestRoute;
const MongoEventStore_1 = require("../../infrastructure/event-store/MongoEventStore");
const mongo_1 = require("../../infrastructure/database/mongo");
const domain_event_1 = require("../../domain/events/domain-event");
class TestEvent extends domain_event_1.DomainEvent {
    name;
    payload() {
        throw new Error("Method not implemented.");
    }
    constructor(aggregateId, name) {
        super(aggregateId);
        this.name = name;
    }
}
async function registerTestRoute(app) {
    app.post("/test-event", async () => {
        const store = new MongoEventStore_1.MongoEventStore((0, mongo_1.getDatabase)());
        const event = new TestEvent(crypto.randomUUID(), "evento teste");
        await store.append(event);
        return {
            success: true
        };
    });
}
