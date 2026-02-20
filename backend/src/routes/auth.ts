import {Router} from 'express';
import {SignUpController, LoginController, MeController, LogoutController} from '../controllers/authController';
import {verifyToken} from '../middleware/auth';

const authRouter = Router();

authRouter.post('/signup', SignUpController);
authRouter.post('/login', LoginController);
authRouter.use(verifyToken);
authRouter.post('/logout', LogoutController);
authRouter.get('/me', MeController)




export default authRouter;
