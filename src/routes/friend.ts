import { Router } from 'express';
import Friend from '../controllers/Friend';

const { checkStatusFriend, actionFriend, getInvitations,actionInviting,getFriends } = Friend;
const router = Router();

router.get('/status', checkStatusFriend);

router.get('/action', actionFriend);

router.get('/gets', getInvitations);

router.get('/inviting', actionInviting);

router.get('/friends', getFriends);

export default router;
