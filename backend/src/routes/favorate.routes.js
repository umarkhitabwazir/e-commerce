import { Router } from "express";
import {authMiddleware} from '../middleWare/auth.Middle.js'
import { addtoFavorateProducts, getFavProducts, removeFavProduct } from "../controllers/favourite.cotroller.js";

const favoritRouter=Router()
favoritRouter.route('/add-to-fav/:productId').post(authMiddleware,addtoFavorateProducts)
favoritRouter.route('/remove-fav/:productId').delete(authMiddleware,removeFavProduct)
favoritRouter.route('/get-fav-product').get(authMiddleware,getFavProducts)


export default favoritRouter