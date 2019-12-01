import express from 'express';
import { Request, Response } from "express";
export interface RequestUser extends Request {
    user: string
}
const router = express.Router();
import supplierService from "./supplier.service"
import isAdmin from '../employees/admin.service';



const register = (req: RequestUser, res: Response, next: any) => {
    isAdmin(req.user && req.user)
        .then((result) => {
            if (result) {
                supplierService.create(req.body)
                .then(Suppliers => Suppliers ? res.json({ message: 'Supplier created' }) : res.json({message:"Supplier could not be created"}).status(404))
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
                supplierService.getAll()
                .then(Suppliers => Suppliers ? res.json(Suppliers) : res.sendStatus(404))
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
                supplierService.getById(req.params.id)
                .then(Suppliers => Suppliers ? res.json(Suppliers) : res.sendStatus(404))
                    .catch(err => next(err));
            } else {
                throw "Not an Admin"
            }
        })
        .catch(err => next(err));
}

const update = (req: RequestUser, res: Response, next: any) => {
    isAdmin(req.user)
        .then((result) => {
            if (result) {
                supplierService.update(req.params.id, req.body)
                    .then(Suppliers => Suppliers ? res.json(Suppliers) : res.sendStatus(404))
                    .catch(err => next(err));
            } else {

                throw 'Not an Admin';

            }

        })
        .catch(err => next(err));

        

}




const _delete = (req: RequestUser, res: Response, next: any) => {

    isAdmin(req.user && req.user)
        .then((result) => {
            if (result) {
                supplierService.delete(req.params.id)
                    .then(() => res.json({ message: "Supplier Deleted" }))
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
router.put('/:id',update);

//@ts-ignore
router.delete('/:id', _delete);

//@ts-ignore
router.get('/', getAll);

//@ts-ignore
router.get('/:id', getById);

export default router;