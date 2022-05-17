import { Router } from 'express';
import User from '../controllers/User';
import storage from './../middleware/uploadFile';
const { registerUser, login, refreshToken,updateUser } = User;

const routes = Router();

routes.post('/register', registerUser);

routes.post('/login', login);

routes.get('/refresh', refreshToken);

routes.put('/update', storage.single('image'), updateUser);

export default routes;
