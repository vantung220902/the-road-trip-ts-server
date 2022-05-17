import { Router } from 'express';
import Story from '../controllers/Story';
import storage from './../middleware/uploadFile';

const { insert, getStories } = Story;
const router = Router();

router.post('/create', storage.single('image'), insert);

router.get('/gets', getStories);

export default router;
