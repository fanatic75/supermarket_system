import express from 'express';
import { Request, Response } from "express";
export interface RequestUser extends Request {
    user: string
}
const router = express.Router();
import ordersService from "./orders.service"
import isAdmin from '../employees/admin.service';



const register = (req: RequestUser, res: Response, next: any) => {
    isAdmin(req.user && req.user)
        .then((result) => {
            if (result) {
                ordersService.create(req.body)
                .then(Orders => Orders ? res.json({ message: 'Order created' }) : res.json({message:"Order could not be created"}).status(404))
                .catch(err => next(err));
            
            }else {
                throw "Not an Admin"
            }
        })
        .catch(err => next(err)); 

}

const  getAll = (req:RequestUser, res:Response, next:any)=> {

    isAdmin(req.user)
        .then((result) => {
            if (result) {
                ordersService.getAll()
                .then(Orders => Orders ? res.json(Orders) : res.sendStatus(404))
                    .catch(err => next(err));
            } else {
                throw "Not an Admin"
            }
        })
        .catch(err => next(err));
}

const  getAllProductsOfAnOrder = (req:RequestUser, res:Response, next:any)=> {

    isAdmin(req.user)
        .then((result) => {
            if (result) {
                ordersService.getAllProductsOfAnOrder(req.params.id)
                .then(products => products ? res.json(products) : res.sendStatus(404))
                    .catch(err => next(err));
            } else {
                throw "Not an Admin"
            }
        })
        .catch(err => next(err));
}

const  getById = (req:RequestUser, res:Response, next:any)=> {

    isAdmin(req.user)
        .then((result) => {
            if (result) {
                ordersService.getById(req.params.id)
                .then(Orders => Orders ? res.json(Orders) : res.sendStatus(404))
                    .catch(err => next(err));
            } else {
                throw "Not an Admin"
            }
        })
        .catch(err => next(err));
}





const _delete = (req: RequestUser, res: Response, next: any) => {

    isAdmin(req.user && req.user)
        .then((result) => {
            if (result) {
                ordersService.delete(req.params.id)
                    .then(() => res.json({ message: "Order Deleted" }))
                    .catch(err => next(err));
            }
            else{
                throw 'Not an Admin'
            }

        })
        .catch(err => next(err));
}


//@ts-ignore
router.post('/register',register);
//@ts-ignore
router.get('/:id/products',getAllProductsOfAnOrder);

//@ts-ignore
router.delete('/:id', _delete);

//@ts-ignore
router.get('/', getAll);

//@ts-ignore
router.get('/:id', getById);

export default router;