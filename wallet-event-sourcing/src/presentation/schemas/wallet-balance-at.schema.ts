import { z } from "zod";

export const walletBalanceAtQuerySchema = z.object({
    date: z.string().datetime({ offset: true })
});
