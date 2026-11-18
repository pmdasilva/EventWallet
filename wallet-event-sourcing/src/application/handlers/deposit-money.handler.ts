import { EventStore }
    from "../../domain/repositories/event-store";

import { WalletLoaderService }
    from "../services/wallet-loader.service";

import { DepositMoneyCommand }
    from "../commands/deposit-money.command";
import { MoneyDepositedEvent } from "../../domain/events/money-deposited.event";



export class DepositMoneyHandler {

    constructor(
        private readonly eventStore: EventStore,
        private readonly walletLoader:
            WalletLoaderService
    ) { }

    async execute(
        command: DepositMoneyCommand
    ) {

        const aggregate =
            await this.walletLoader.load(
                command.walletId
            );

        const event =
            aggregate.deposit(
                command.amount
            );

        await this.eventStore.append(
            event
        );

        switch (event.constructor.name) {
            case "MoneyDepositedEvent":
                return new MoneyDepositedEvent(
                    event.aggregateId,
                    event.payload().amount
                );
        }
    }
}