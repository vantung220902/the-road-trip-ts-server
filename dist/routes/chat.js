"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Chat_1 = __importDefault(require("../controllers/Chat"));
const { insertMessage, getMessage } = Chat_1.default;
const router = (0, express_1.Router)();
router.post('/create', insertMessage);
router.get('/gets', getMessage);
exports.default = router;
//# sourceMappingURL=chat.js.map