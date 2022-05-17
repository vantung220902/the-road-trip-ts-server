"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Post_1 = __importDefault(require("../controllers/Post"));
const uploadFile_1 = __importDefault(require("./../middleware/uploadFile"));
const { getPosts, insertPost, getPostById, softDelete, updatePost, deleted, recovery, getPostUser } = Post_1.default;
const router = (0, express_1.Router)();
router.get('/gets', getPosts);
router.get('/getById', getPostById);
router.get('/getPostUser', getPostUser);
router.post('/create', uploadFile_1.default.array('images', 3), insertPost);
router.put('/softDelete', softDelete);
router.put('/update', uploadFile_1.default.single('image'), updatePost);
router.delete('/deleted', deleted);
router.put('/recovery', recovery);
exports.default = router;
//# sourceMappingURL=post.js.map