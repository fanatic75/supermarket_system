import * as config from "../config.json";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import Employee from '../types/Employee';
import executeQuery, { insertQuery } from "../_helpers/db.js";




const authenticate = async ({ username, password }: { username: string, password: string }) => {

  const [rows]: [any, [Employee]] = await executeQuery('Select * from employee where username=?', [username]);
  if (rows.length === 0) {
    throw 'No such user found';
  }
  if (!password || !username) {
    throw 'Username or Password is required';
  }
  const employee: Employee = rows[0];
  if (bcrypt.compareSync(password, employee.hash)) {
    const {
      hash,
      firstName,
      city,
      street,
      houseNo,
      ...employeeWithoutHash
    }: Employee = employee;

    const token = jwt.sign({
      sub: employee.empId,
      role: employee.role,
    }, config.secretToken, { expiresIn: config.secretTokenLife });


    return {
      token,
      ...employeeWithoutHash
    }


  }
  throw 'No such user found';









}

async function getAll(): Promise<[Employee]> {
  const [rows]: [[Employee]] = await executeQuery('select empId,lastName,firstName,branchId,username,role from employee');
  if (rows.length) {
    return rows;
  }
  throw 'No Employees Found';
}


async function getById(id: string): Promise<[Employee]> {
  const [rows]: [[Employee]] = await executeQuery('select empId,city,street,houseNo,lastName,firstName,branchId,username,role from employee where empId=?', [id]);

  if (rows.length) {
    return rows;
  }
  throw 'No Employees Found';
}


async function create(employeeParam: Employee) {
  const [rows]: [[Employee]] = await executeQuery('select empId,city,street,houseNo,lastName,firstName,branchId,username,role from employee where username=?', [employeeParam.username]);

  if (rows.length) {
    throw 'Username "' + rows[0]['username'] + '" is already taken';

  }

  if (employeeParam.hash) {
    throw 'Hashes cannot be provided';
  }

  //@ts-ignore
  if (employeeParam.role && employeeParam.role == 'Admin') {
    employeeParam.branchId = 1
  }
  if(!employeeParam.lastName){
    throw 'Last Name is required';
  }
  if (employeeParam.branchId) {
    const branches = await executeQuery('select branchId from branches where branchId=?', [employeeParam.branchId])
    if (branches.length) {
      if (employeeParam.password) {
        const { password, ...employeeWithoutPassword } = employeeParam;
        employeeWithoutPassword.hash = bcrypt.hashSync(employeeParam.password, config.secretPasswordHash);
       
          return await insertQuery('insert into employee SET ?', employeeWithoutPassword);
       
      
        
      }
      throw 'password is required';
    }
  }
  throw 'Branch Id is required.'



}


async function update(id:string, employeeParam:Employee){
  const [employee] = await getById(id);
  if(!employee){
    'throw No employee found';

  }
  if(employeeParam.empId){
    throw 'employee id cannot be updated';
  }
  if(employeeParam.hash){
    throw 'Hash cannot be provided';

  }
  if(employee.username===employeeParam.username&&await getById(id)){
    throw 'username ' +employeeParam.username +' is already taken';
  }
  if(employeeParam.branchId){
    throw 'Branch ID cannot be updated';

  }
  if(employeeParam.password){
    employeeParam.hash = bcrypt.hashSync(employeeParam.password,config.secretPasswordHash);
  }
  Object.assign(employee,employeeParam);
  const {password,...employeeWithoutPassword}=employee;

  Object.keys(employeeWithoutPassword).map(async (field:any) =>{
    try{
      //@ts-ignore
    
      const value = employeeWithoutPassword[field];
     await insertQuery(`update employee SET ${field} = ? where empId  = ?`,[value,id])
    
    }catch(e){
      console.log(e);
    }

  });
  return {...employeeWithoutPassword};
}


async function _delete(id:string) {
 await executeQuery('delete from employee where empId = ?',[id]);
 
}
export default {
  authenticate,
  create,
  getAll,
  getById,
  update,
  delete:_delete

};