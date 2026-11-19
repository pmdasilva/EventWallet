"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.balanceAtSchema = void 0;
const zod_1 = require("zod");
exports.balanceAtSchema = zod_1.z.object({
    date: zod_1.z.string()
});
