"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Comment_1 = __importDefault(require("../controllers/Comment"));
const { insertComment, getComments } = Comment_1.default;
const router = (0, express_1.Router)();
router.post('/create', insertComment);
router.get('/gets', getComments);
exports.default = router;
//# sourceMappingURL=commets.js.map