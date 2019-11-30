import express from 'express';
import { Request, Response } from "express";
export interface RequestUser extends Request {
    user: string
}
const router = express.Router();
import branchesService from "./branches.service"
import isAdmin from '../employees/admin.service';



const register = (req: RequestUser, res: Response, next: any) => {
    isAdmin(req.user && req.user)
        .then((result) => {
            if (result) {
                branchesService.create(req.body)
                .then(branches => branches ? res.json({ message: 'Branch created' }) : res.json({message:"Branch could not be created"}).status(404))
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
                branchesService.getAll()
                .then(branches => branches ? res.json(branches) : res.sendStatus(404))
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
                branchesService.getById(req.params.id)
                .then(branches => branches ? res.json(branches) : res.sendStatus(404))
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
                branchesService.update(req.params.id, req.body)
                    .then(branches => branches ? res.json(branches) : res.sendStatus(404))
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
                branchesService.delete(req.params.id)
                    .then(() => res.json({ message: "Branch Deleted" }))
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
router.delete('/:id', _delete);

//@ts-ignore
router.get('/', getAll);

//@ts-ignore
router.get('/:id', getById);

export default router;