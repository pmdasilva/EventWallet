"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainEvent = void 0;
class DomainEvent {
    aggregateId;
    occurredAt;
    version;
    constructor(aggregateId, occurredAt = new Date(), version = 1) {
        this.aggregateId = aggregateId;
        this.occurredAt = occurredAt;
        this.version = version;
    }
}
exports.DomainEvent = DomainEvent;
