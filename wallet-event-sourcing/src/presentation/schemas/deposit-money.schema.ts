import { z } from "zod";

export const depositMoneySchema =
    z.object({
        amount: z.number()
            .positive()
    });