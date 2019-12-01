import Products from '../types/Products';
import executeQuery, { insertQuery } from "../_helpers/db.js";
import { uuidv4 } from '../Orders/orders.service';

async function getAll(): Promise<[Products]> {
    const [[rows]]: [[[Products]]] = await executeQuery('call getAllProducts()');
    
    if (rows.length) {
      return rows;
    }
    throw 'No Products Found';
  }

  async function getAllProductsOfABranch(id: string): Promise<any> {
    const [rows]: [[any]] = await executeQuery('select productId, noOfCopies  from hasCopies where branchId = ?', [id]);
    
    if (rows.length) {
          return Promise.all(rows.map(async (row:any)=>{
         const [products] =await  getById(row.productId);
        return { 
            noOfCopies : row.noOfCopies,
            ...products

          }

          
      }));
    
    }
    throw 'No Branches Found';
  }





  async function getById(id: string): Promise<[Products]> {
    const [rows]: [[Products]] = await executeQuery('select *  from products where productId=?', [id]);
  
    if (rows.length) {
      return rows;
    }
    throw 'No Branches Found';
  }
  

  async function create(productParam: any) {
    
    if(productParam.productId){
        throw 'product Id cannot be suppleid'
    }

    if(!productParam.productionDate||!productParam.expDate||!productParam.branchId||!productParam.noOfCopies||!productParam.company||!productParam.price||!productParam.productName){
        throw 'All the fields are required';
    }
    if(productParam.productionDate&&productParam.expDate){
        productParam.productId = uuidv4();
        const today = new Date();
        productParam.productionDate= new Date(productParam.productionDate);
        productParam.expDate = new Date(productParam.expDate);
        if(productParam.expDate< today){
            throw 'Already an expired product';
        } if(productParam.productionDate>today){
            throw 'faulty production date';
        }
        const hasCopies = { branchId : productParam.branchId,productId:productParam.productId,noOfCopies:productParam.noOfCopies};
        const {branchId, noOfCopies , ...restOfProductParam } = productParam;
         await insertQuery('insert into products set ?',restOfProductParam);
        
        return await insertQuery ('insert into hasCopies set?',hasCopies);
        
    }

    throw 'Product could not be created';
  
    
   
  
  
  
  }

  async function updateQuantityOfBranch(id : string, productParam : any){
    if(!productParam.noOfCopies&&!productParam.branchId){
      throw 'No Of Copies and Branch Id is required';
    }
      const [result] = await insertQuery('update hasCopies set noOfCopies = ? where productId = ? and branchId = ?',[productParam.noOfCopies, productParam.productId, id]);
      if(result.affectedRows)
        return true;
      return;
  }

  async function update(id:string, productParam:Products){
    const [product] = await getById(id);
    const today = new Date();

    if(!product){
      'throw No Product found';
  
    }
    if(productParam.productId){
      throw 'Product id cannot be updated';
    }
    if(!productParam.productionDate&&!productParam.expDate){
       const {productionDate,expDate,...productParamWithoutDate} = productParam;
       if(productParam.expDate< today){
        throw 'Already an expired product';
    } if(productParam.productionDate>today){
        throw 'faulty production date';
    }
       Object.assign(product,productParamWithoutDate);
   
  
    } else if(!productParam.productionDate){
        productParam.expDate = new Date(productParam.expDate);
        if(productParam.expDate< today){
            throw 'Already an expired product';
        }
        const {productionDate,...productParamWithoutProductionDate} = productParam;
        Object.assign(product,productParamWithoutProductionDate);

    } else if(!productParam.expDate){
        productParam.productionDate = new Date(productParam.productionDate);
        if(productParam.productionDate>today){
            throw 'faulty production date';
        }
        const {expDate,...productParamWithoutExpiryDate} = productParam;
        Object.assign(product,productParamWithoutExpiryDate);
    } else {
        Object.assign(product,productParam);
    }
  
   
  
    Object.keys(productParam).map(async (field:any) =>{
      try{
        //@ts-ignore
      
        const value = productParam[field];
       await insertQuery(`update products SET ${field} = ? where productId  = ?`,[value,id])
      
      }catch(e){
        console.log(e);
      }
  
    });
    return {product};
  }

  async function _delete(id:string) {
   await executeQuery('delete from products where productId = ?',[id]);
    }

    export default {
        updateQuantityOfBranch,
        getAllProductsOfABranch,
        create,
        getAll,
        getById,
        update,
        delete:_delete
      
      };