
import employeeService from './employee.service';
import Employee from '../types/Employee';

export default async function isAdmin (employee:any){
   
    if(employee&&employee.role=='Admin'){
        const [currUser]:[Employee] = await employeeService.getById(employee.sub);
        //@ts-ignore
        if(currUser&&currUser.role == 'Admin'){
            return true;
        }
    }
    return false;
}