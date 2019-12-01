
import Supplier from '../types/Supplier';
import executeQuery, { insertQuery } from "../_helpers/db.js";

async function getAll(): Promise<[Supplier]> {
    const [[rows]]: [[[Supplier]]] = await executeQuery('call getAllSuppliers()');
    
    if (rows.length) {
      return rows;
    }
    throw 'No Supplier Found';
  }

  async function getById(id: string): Promise<[Supplier]> {
    const [rows]: [[Supplier]] = await executeQuery('select *  from supplier where supplierId=?', [id]);
  
    if (rows.length) {
      return rows;
    }
    throw 'No Customers Found';
  }
  

  async function create(supplierParam: Supplier) {
    
    if(!supplierParam.lastName){
        throw ' Last Name  is required';
    }
    
  
    
  
    return await insertQuery('insert into supplier set ?',supplierParam);
  
    
   
  
  
  
  }
  async function update(id:string, supplierParam:Supplier){
    const [supplier] = await getById(id);
    if(!supplier){
      'throw No Supplier found';
  
    }
    if(supplierParam.supplierId){
      throw 'Supplier id cannot be updated';
    }
    
  
   
    Object.assign(supplier,supplierParam);
  
    Object.keys(supplierParam).map(async (field:any) =>{
      try{
        //@ts-ignore
      
        const value = supplierParam[field];
       await insertQuery(`update supplier SET ${field} = ? where supplierId  = ?`,[value,id])
      
      }catch(e){
        console.log(e);
      }
  
    });
    return {supplier};
  }
  
  async function _delete(id:string) {
   await executeQuery('delete from supplier where supplierId = ?',[id]);
    }

    export default {
        
        create,
        getAll,
        getById,
        update,
        delete:_delete
      
      };