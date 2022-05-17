"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Ticket_1 = __importDefault(require("../controllers/Ticket"));
const uploadFile_1 = __importDefault(require("./../middleware/uploadFile"));
const { getTickets, insertTicket } = Ticket_1.default;
const router = (0, express_1.Router)();
router.get('/gets', getTickets);
router.post('/create', uploadFile_1.default.array('images', 3), insertTicket);
exports.default = router;
//# sourceMappingURL=ticket.js.map