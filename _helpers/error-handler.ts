import { NextHandleFunction } from "connect";
import { Response ,Request} from "express-serve-static-core";

export default errorHandler;

function errorHandler(err :any , req : Request, res : Response, next : NextHandleFunction)  {
    if (typeof (err) === 'string') {
        // custom application error
        return res.status(400).json({ message: err });
        
    
    }

    if (err.name === 'ValidationError') {
        // mongoose validation error
        return res.status(400).json({ message: err.message });
    }

   
    if(err.message==='jwt malformed'){
        return res.status(401).json({ message: 'Invalid Token' });

    }

    // default to 500 server error
    return res.status(500).json({ message: err.message });
}