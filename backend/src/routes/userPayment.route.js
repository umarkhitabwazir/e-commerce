import express from 'express';
import { saveUserPayment, getUserPayment, deleteUserPayment } from '../controllers/UserPayment.controller.js';
import {authMiddleware }from '../middleWare/auth.Middle.js';

const userPaymentRouter = express.Router();

userPaymentRouter.route('/payment/save').post( authMiddleware, saveUserPayment);
userPaymentRouter.route('/payment/get').get( authMiddleware, getUserPayment);
userPaymentRouter.route('/payment/delete').delete( authMiddleware, deleteUserPayment);

export default userPaymentRouter;
