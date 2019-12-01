import express from 'express';
import { Request, Response } from "express";
export interface RequestUser extends Request {
    user: string
}
const router = express.Router();
import productsService from "./products.service"
import isAdmin from '../employees/admin.service';



const register = (req: RequestUser, res: Response, next: any) => {
    isAdmin(req.user && req.user)
        .then((result) => {
            if (result) {
                productsService.create(req.body)
                .then(products => products ? res.json({ message: 'Product created' }) : res.json({message:"Product could not be created"}).status(404))
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
                productsService.getAll()
                .then(products => products ? res.json(products) : res.sendStatus(404))
                    .catch(err => next(err));
            } else {
                throw "Not an Admin"
            }
        })
        .catch(err => next(err));
}

const  getAllProductsOfABranch = (req:RequestUser, res:Response, next:any)=> {

    isAdmin(req.user)
        .then((result) => {
            if (result) {
                productsService.getAllProductsOfABranch(req.params.id)
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
                productsService.getById(req.params.id)
                .then(products => products ? res.json(products) : res.sendStatus(404))
                    .catch(err => next(err));
            } else {
                throw "Not an Admin"
            }
        })
        .catch(err => next(err));
}




const updateQuantityOfBranch = (req: RequestUser, res: Response, next: any) => {
    isAdmin(req.user)
        .then((result) => {
            if (result) {
                productsService.updateQuantityOfBranch(req.params.id, req.body)
                    .then(products => products ? res.json({message: "Product Quantity Updated"}) : res.sendStatus(404))
                    .catch(err => next(err));
            } else {

                throw 'Not an Admin';

            }

        })
        .catch(err => next(err));

        

}

const update = (req: RequestUser, res: Response, next: any) => {
    isAdmin(req.user)
        .then((result) => {
            if (result) {
                productsService.update(req.params.id, req.body)
                    .then(products => products ? res.json(products) : res.sendStatus(404))
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
                productsService.delete(req.params.id)
                    .then(() => res.json({ message: "Product Deleted" }))
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
router.put('/:id', update);


//@ts-ignore
router.put('/:id/quantity', updateQuantityOfBranch);



//@ts-ignore
router.delete('/:id', _delete);

//@ts-ignore
router.get('/', getAll);


//@ts-ignore
router.get('/:id/branch', getAllProductsOfABranch);


//@ts-ignore
router.get('/:id', getById);

export default router;