import expressJwt, { IsRevokedCallback } from 'express-jwt';
import employeeService from "../employees/employee.service";
import * as  config from '../config.json';

export default jwt;

function jwt() {
    const secret = config.secretToken;
    return expressJwt({ secret, isRevoked  }).unless({
        path: [
            // public routes that don't require authentication
            '/employees/authenticate',
            '/employees/register',
            /^\/users\/token\/.*/
            
        ]
    });
}

const isRevoked:IsRevokedCallback = async  (req , payload, done)=>   {
    
    const [employee] = await employeeService.getById(payload.sub);
    console.log(employee);
    // revoke token if user no longer exists
    if (!employee) {
        return done(null, true);
    }

    done(false); 
};