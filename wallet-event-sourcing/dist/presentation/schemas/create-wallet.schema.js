"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWalletSchema = void 0;
const zod_1 = require("zod");
exports.createWalletSchema = zod_1.z.object({
    ownerName: zod_1.z
        .string()
        .min(3, "Nome deve possuir pelo menos 3 caracteres")
});
