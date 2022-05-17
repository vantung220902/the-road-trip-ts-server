"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Story_1 = __importDefault(require("../controllers/Story"));
const uploadFile_1 = __importDefault(require("./../middleware/uploadFile"));
const { insert, getStories } = Story_1.default;
const router = (0, express_1.Router)();
router.post('/create', uploadFile_1.default.single('image'), insert);
router.get('/gets', getStories);
exports.default = router;
//# sourceMappingURL=story.js.map