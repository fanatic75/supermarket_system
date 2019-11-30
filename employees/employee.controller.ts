import express from 'express';
import { Request, Response } from "express";
export interface RequestUser extends Request {
    user: string
}
const router = express.Router();
import employeeService from "./employee.service"
import isAdmin from './admin.service';




const authenticate = (req: RequestUser, res: Response, next: any) => {

    employeeService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({
            message: 'Username or password is incorrect'
        }))
        .catch(err => next(err));
}

const register = (req: RequestUser, res: Response, next: any) => {
    isAdmin(req.user && req.user)
        .then((result) => {
            if (result) {
                employeeService.create(req.body)
                .then(user => user ? res.json({ message: 'Employee created' }) : res.json({message:"Employee could not be created"}).status(404))
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
                employeeService.getAll()
                .then(employee => employee ? res.json(employee) :res.sendStatus(404)) 
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
                employeeService.getById(req.params.id)
                .then(employee => employee ? res.json(employee) : res.sendStatus(404))
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
                employeeService.update(req.params.id, req.body)
                    .then(user => user ? res.json(user) : res.sendStatus(404))
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
                employeeService.delete(req.params.id)
                    .then(() => res.json({ message: "Employee Deleted" }))
                    .catch(err => next(err));
            }
            else{
                throw 'Not an Admin'
            }

        })
        .catch(err => next(err));
}

//@ts-ignore
router.post('/authenticate', authenticate);

//@ts-ignore
router.post('/register', register);

//@ts-ignore
router.put('/:id', update);

//@ts-ignore
router.delete('/:id', _delete);

//@ts-ignore
router.get('/', getAll);

//@ts-ignore
router.get('/:id', getById);
/*router.post('/token/:id',refreshToken);
router.get('/admins',getAllAdmins) 


router.get('/current', getCurrent);

*/
export default router;