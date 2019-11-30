
import Branches from '../types/Branches';
import executeQuery, { insertQuery } from "../_helpers/db.js";

async function getAll(): Promise<[Branches]> {
    const [[rows]]: [[[Branches]]] = await executeQuery('call display()');
    
    if (rows.length) {
      return rows;
    }
    throw 'No Branches Found';
  }

  async function getById(id: string): Promise<[Branches]> {
    const [rows]: [[Branches]] = await executeQuery('select *  from branches where branchId=?', [id]);
  
    if (rows.length) {
      return rows;
    }
    throw 'No Branches Found';
  }
  

  async function create(branchParam: Branches) {
    
    if(!branchParam.branchName){
        throw 'branchName is required';
    }
    
    const [rows]: [[Branches]] = await executeQuery('select branchName from branches where branchName=?', [branchParam.branchName]);
  
    if (rows.length) {
      throw 'Branch Name "' + rows[0]['branchName'] + '" is already taken';
  
    }
  
    return await insertQuery('insert into branches set ?',branchParam);
  
    
   
  
  
  
  }

  async function update(id:string, branchParam:Branches){
    const [branch] = await getById(id);
    if(!branch){
      'throw No branch found';
  
    }
    if(branchParam.branchId){
      throw 'Branch id cannot be updated';
    }
    
  
   
    Object.assign(branch,branchParam);
  
    Object.keys(branchParam).map(async (field:any) =>{
      try{
        //@ts-ignore
      
        const value = branchParam[field];
       await insertQuery(`update branches SET ${field} = ? where branchId  = ?`,[value,id])
      
      }catch(e){
        console.log(e);
      }
  
    });
    return {branch};
  }

  async function _delete(id:string) {
   await executeQuery('delete from branches where branchId = ?',[id]);
    }

    export default {
        
        create,
        getAll,
        getById,
        update,
        delete:_delete
      
      };