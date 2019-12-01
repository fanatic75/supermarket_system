
import Customers from '../types/Customers';
import executeQuery, { insertQuery } from "../_helpers/db.js";

async function getAll(): Promise<[Customers]> {
    const [[rows]]: [[[Customers]]] = await executeQuery('call getAllCustomers()');
    
    if (rows.length) {
      return rows;
    }
    throw 'No Customers Found';
  }

  async function getById(id: string): Promise<[Customers]> {
    const [rows]: [[Customers]] = await executeQuery('select *  from customer where customerId=?', [id]);
  
    if (rows.length) {
      return rows;
    }
    throw 'No Customers Found';
  }
  

  async function create(customerParam: Customers) {
    
    if(!customerParam.lastName||!customerParam.branchId){
        throw ' Last Name and Branch Id is required';
    }
    
  
    
  
    return await insertQuery('insert into customer set ?',customerParam);
  
    
   
  
  
  
  }

  
  async function _delete(id:string) {
   await executeQuery('delete from customer where customerId = ?',[id]);
    }

    export default {
        
        create,
        getAll,
        getById,
        delete:_delete
      
      };