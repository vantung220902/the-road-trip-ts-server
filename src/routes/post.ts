import { Router } from 'express';
import Post from '../controllers/Post';
import storage from './../middleware/uploadFile';
const { getPosts, insertPost, getPostById, softDelete, updatePost, deleted, recovery, getPostUser } = Post;
const router = Router();

router.get('/gets', getPosts);

router.get('/getById', getPostById);

router.get('/getPostUser', getPostUser);

router.post('/create', storage.array('images',3), insertPost);

router.put('/softDelete', softDelete);

router.put('/update', storage.single('image'), updatePost);

router.delete('/deleted', deleted);

router.put('/recovery', recovery);

export default router;
