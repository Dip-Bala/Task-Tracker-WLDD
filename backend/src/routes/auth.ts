import {Router} from 'express';
import {RegisterController, LoginController, MeController} from '../controllers/authController.js';
import {verifyToken} from '../middleware/auth.js';

const authRouter = Router();

authRouter.post('/register', RegisterController);
authRouter.post('/login', LoginController);
authRouter.use(verifyToken);
// authRouter.post('/logout', LogoutController);
authRouter.get('/me', MeController)



export default authRouter;
