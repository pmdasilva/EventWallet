"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawMoneySchema = void 0;
const zod_1 = require("zod");
exports.withdrawMoneySchema = zod_1.z.object({
    amount: zod_1.z.number()
        .positive()
});
