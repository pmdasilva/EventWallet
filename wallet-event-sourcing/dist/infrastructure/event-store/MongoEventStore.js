"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoEventStore = void 0;
class MongoEventStore {
    database;
    constructor(database) {
        this.database = database;
    }
    async append(event) {
        await this.database
            .collection("wallet_events")
            .insertOne({
            aggregateId: event.aggregateId,
            eventType: event.constructor.name,
            occurredAt: event.occurredAt,
            version: event.version,
            payload: event.payload()
        });
    }
    async getEventsByAggregateId(aggregateId) {
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
exports.MongoEventStore = MongoEventStore;
