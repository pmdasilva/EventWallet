import { randomUUID } from "crypto";

import { EventStore } from "../../domain/repositories/event-store";

import { WalletCreatedEvent } from "../../domain/events/wallet-created.event";

import { CreateWalletCommand } from "../commands/create-wallet.command";

export class CreateWalletHandler {

    constructor(
        private readonly eventStore: EventStore
    ) { }

    async execute(command: CreateWalletCommand) {

        const walletId = randomUUID();

        const event = new WalletCreatedEvent(
            walletId,
            command.ownerName
        );

        await this.eventStore.append(event);

        return {
            walletId
        };
    }

}