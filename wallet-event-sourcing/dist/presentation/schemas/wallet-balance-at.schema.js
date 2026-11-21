"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletBalanceAtQuerySchema = void 0;
const zod_1 = require("zod");
exports.walletBalanceAtQuerySchema = zod_1.z.object({
    date: zod_1.z.string().datetime({ offset: true })
});
