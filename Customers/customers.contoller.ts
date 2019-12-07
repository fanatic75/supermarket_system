import express from 'express';
import { Request, Response } from "express";
export interface RequestUser extends Request {
    user: string
}
const router = express.Router();
import customerService from "./customer.service"
import isAdmin from '../employees/admin.service';



const register = (req: RequestUser, res: Response, next: any) => {
 
                customerService.create(req.body)
                .then(Customers => Customers ? res.json(Customers) : res.json({message:"Customer could not be created"}).status(404))
                .catch(err => next(err));
          

}

const  getAll = (req:RequestUser, res:Response, next:any)=> {

    isAdmin(req.user)
        .then((result) => {
            if (result) {
                customerService.getAll()
                .then(Customers => Customers ? res.json(Customers) : res.sendStatus(404))
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
                customerService.getById(req.params.id)
                .then(Customers => Customers ? res.json(Customers) : res.sendStatus(404))
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
                customerService.delete(req.params.id)
                    .then(() => res.json({ message: "Customer Deleted" }))
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
router.delete('/:id', _delete);

//@ts-ignore
router.get('/', getAll);

//@ts-ignore
router.get('/:id', getById);

export default router;