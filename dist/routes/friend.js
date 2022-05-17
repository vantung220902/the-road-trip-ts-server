"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Friend_1 = __importDefault(require("../controllers/Friend"));
const { checkStatusFriend, actionFriend, getInvitations, actionInviting, getFriends } = Friend_1.default;
const router = (0, express_1.Router)();
router.get('/status', checkStatusFriend);
router.get('/action', actionFriend);
router.get('/gets', getInvitations);
router.get('/inviting', actionInviting);
router.get('/friends', getFriends);
exports.default = router;
//# sourceMappingURL=friend.js.map