"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateWalletHandler = void 0;
const crypto_1 = require("crypto");
const wallet_created_event_1 = require("../../domain/events/wallet-created.event");
class CreateWalletHandler {
    eventStore;
    constructor(eventStore) {
        this.eventStore = eventStore;
    }
    async execute(command) {
        const walletId = (0, crypto_1.randomUUID)();
        const event = new wallet_created_event_1.WalletCreatedEvent(walletId, command.ownerName);
        await this.eventStore.append(event);
        return {
            walletId
        };
    }
}
exports.CreateWalletHandler = CreateWalletHandler;
