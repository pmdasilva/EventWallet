"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.depositMoneySchema = void 0;
const zod_1 = require("zod");
exports.depositMoneySchema = zod_1.z.object({
    amount: zod_1.z.number()
        .positive()
});
