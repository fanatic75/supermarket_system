
require('rootpath')();
import express from 'express';
const app = express();
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from './_helpers/jwt';
import errorHandler from './_helpers/error-handler';
import employeeController from './employees/employee.controller';
import branchesController from './Branches/branches.controller';
import customerController from './Customers/customers.contoller';
import productsController from './Products/products.controller';
import suppliersController from './Supplier/supplier.controller';
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());




// use JWT auth to secure the api
app.use(jwt());




// api routes
app.use('/employees', employeeController);

 app.use('/branches',branchesController);

 app.use('/customers',customerController);
 app.use('/products',productsController);
 
app.use('/suppliers',suppliersController);
/*


 */
// global error handler
app.use(errorHandler as any);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
 app.listen(port, function () {
    console.log('Server listening on port ' + port);
});

