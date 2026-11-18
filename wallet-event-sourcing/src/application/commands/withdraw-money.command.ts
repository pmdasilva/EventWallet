import { EventStore }
    from "../../domain/repositories/event-store";

import { WalletLoaderService }
    from "../services/wallet-loader.service";

import { MoneyWithdrawnEvent }
    from "../../domain/events/money-withdrawn.event";

export class WithdrawMoneyCommand {
    constructor(
        public readonly walletId: string,
        public readonly amount: number
    ) { }
}

export class WithdrawMoneyHandler {

    constructor(
        private readonly eventStore: EventStore,
        private readonly walletLoader:
            WalletLoaderService
    ) { }

    async execute(
        command: WithdrawMoneyCommand
    ) {

        const aggregate =
            await this.walletLoader.load(
                command.walletId
            );

        const event =
            aggregate.withdraw(
                command.amount
            );

        await this.eventStore.append(
            event
        );

        switch (event.eventType) {
            case "MoneyWithdrawnEvent":
                return new MoneyWithdrawnEvent(
                    event.aggregateId,
                    event.payload().amount
                );
        }
    }
}