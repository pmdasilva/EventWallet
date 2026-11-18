import { z } from "zod";

export const createWalletSchema = z.object({
    ownerName: z
        .string()
        .min(3, "Nome deve possuir pelo menos 3 caracteres")
});