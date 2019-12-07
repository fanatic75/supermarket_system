
import Orders from '../types/Orders';
import executeQuery, { insertQuery } from "../_helpers/db.js";

async function getAll(): Promise<[Orders]> {
    const [[rows]]: [[[Orders]]] = await executeQuery('call getAllOrders()');

    if (rows.length) {
        return rows;
    }
    throw 'No Orders Found';
}

async function getAllOrdersWithCustomerInfo(): Promise<[Orders]> {
    const [[rows]]: [[[Orders]]] = await executeQuery('call getAllOrdersCustomers();');

    if (rows.length) {
        return rows;
    }
    throw 'No Orders Found';
}

async function getAllProductsOfAnOrder(id:string): Promise<[Orders]>{
   if(id){
    const [rows]: [[Orders]] = await executeQuery('select productId  from ordersproducts where orderId=?', [id]);
    if(rows.length){
        return rows;

    }
    throw 'No Products found';
   } throw 'id is required';
}

async function getById(id: string): Promise<[Orders]> {
    const [rows]: [[Orders]] = await executeQuery('select *  from orders where orderId=?', [id]);

    if (rows.length) {
        return rows;
    }
    throw 'No Orders Found';
}


async function create(ordersParam: any) {
    if (ordersParam.orderId) {
        throw 'orderId cannot be supplied';
    }
    if (ordersParam.orderTime) {
        throw 'time cannot be supplied';
    }

    if (ordersParam.orderDate) {
        throw 'Date  cannot be supplied';
    }
  


        ordersParam.orderId = uuidv4();
    
    if (!ordersParam.customerId || !ordersParam.products || !ordersParam.orderPrice) {
        throw ' Required fields are not filled';
    }



    ordersParam.orderDate = new Date();
    ordersParam.orderTime = new Date(ordersParam.orderDate).toLocaleTimeString();
    console.log(ordersParam);

    console.log(ordersParam.products.length)
    if (ordersParam.products.length > 0) {
        const {products,...orderWithoutproducts} = ordersParam;
        const result = await insertQuery('insert into orders set ?', orderWithoutproducts);
        console.log(result);
    
        let orderProducts = [];
    
    
        orderProducts = ordersParam.products.map((productId: (string | number)) => {
            return [ordersParam.orderId, productId]
        });
        return await insertQuery('insert into ordersproducts (orderId,productId) VALUES ?', [orderProducts]);
    }

    throw 'Order could not be created';






}


async function _delete(id: string) {
    await executeQuery('delete from orders where orderId = ?', [id]);
}

export default {
    getAllProductsOfAnOrder,
    getAllOrdersWithCustomerInfo,
    create,
    getAll,
    getById,
    delete: _delete

};

export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  