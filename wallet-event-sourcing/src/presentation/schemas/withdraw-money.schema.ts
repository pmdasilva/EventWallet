import { z } from "zod";

export const withdrawMoneySchema =
    z.object({
        amount: z.number()
            .positive()
    });