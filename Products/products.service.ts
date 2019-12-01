import Products from '../types/Products';
import executeQuery, { insertQuery } from "../_helpers/db.js";

async function getAll(): Promise<[Products]> {
    const [[rows]]: [[[Products]]] = await executeQuery('call getAllProducts()');
    
    if (rows.length) {
      return rows;
    }
    throw 'No Products Found';
  }




  async function getById(id: string): Promise<[Products]> {
    const [rows]: [[Products]] = await executeQuery('select *  from products where productId=?', [id]);
  
    if (rows.length) {
      return rows;
    }
    throw 'No Branches Found';
  }
  

  async function create(productParam: Products) {
    
    if(!productParam.company||!productParam.expDate||!productParam.price||!productParam.productName||!productParam.productionDate){
        throw 'All the fields are required';
    }
    if(productParam.productionDate&&productParam.expDate){
        const today = new Date();
        productParam.productionDate= new Date(productParam.productionDate);
        productParam.expDate = new Date(productParam.expDate);
        if(productParam.expDate< today){
            throw 'Already an expired product';
        } if(productParam.productionDate>today){
            throw 'faulty production date';
        }
    }
    
  
    return await insertQuery('insert into products set ?',productParam);
  
    
   
  
  
  
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
   await executeQuery('delete from product where productId = ?',[id]);
    }

    export default {
        
        create,
        getAll,
        getById,
        update,
        delete:_delete
      
      };