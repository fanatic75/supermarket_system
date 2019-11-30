import { connection } from '../config.json';
//@ts-ignore
const mySql= require('mysql2/promise');


export default async function executeQuery(query:string,values?:[string|number]|object){
    try{
        
       const con = await mySql.createConnection({
            host:connection.host,
            user:connection.user,
            password:connection.password,
            database:'supermarket'
        });
         return await con.execute(query,values&&values);
        }catch(e){
            console.log(e);
        }
}   
 
export async function insertQuery(query:string,values?:object|[string|number]){
    try{
        const con = await mySql.createConnection({
            host:connection.host,
            user:connection.user,
            password:connection.password,
            database:'supermarket'
        });
        return await con.query(query,values&&values);
    }   catch(e){
        console.log(e);
    }
  
}   