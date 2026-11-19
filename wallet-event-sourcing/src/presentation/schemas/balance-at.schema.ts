import { z } from "zod";

export const balanceAtSchema =
    z.object({
        date: z.string()
    });