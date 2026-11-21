import assert from "node:assert/strict";
import test from "node:test";

import { WalletBalanceAtService } from "../src/application/services/wallet-balance-at.service";
import { EventDocument } from "../src/domain/repositories/event-store";

test("rebuilds the balance using only events up to the requested instant", async () => {
    const events: EventDocument[] = [
        {
            aggregateId: "wallet-1",
            eventType: "WalletCreatedEvent",
            occurredAt: new Date("2026-11-18T21:00:00.000Z"),
            version: 1,
            payload: { ownerName: "Paulo Silva" }
        },
        {
            aggregateId: "wallet-1",
            eventType: "MoneyDepositedEvent",
            occurredAt: new Date("2026-11-18T21:10:00.000Z"),
            version: 2,
            payload: { amount: 100 }
        },
        {
            aggregateId: "wallet-1",
            eventType: "MoneyWithdrawnEvent",
            occurredAt: new Date("2026-11-18T21:30:00.000Z"),
            version: 3,
            payload: { amount: 30 }
        }
    ];

    const service = new WalletBalanceAtService({
        append: async () => undefined,
        getEventsByAggregateId: async () => events
    });

    const result = await service.execute(
        "wallet-1",
        new Date("2026-11-18T21:20:00.000Z")
    );

    assert.equal(result.balance, 100);
});

test("rejects an invalid historical date", async () => {
    const service = new WalletBalanceAtService({
        append: async () => undefined,
        getEventsByAggregateId: async () => []
    });

    await assert.rejects(
        service.execute("wallet-1", new Date(Number.NaN)),
        /data para consulta do saldo é inválida/
    );
});
