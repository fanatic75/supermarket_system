import { role } from "../_helpers/roles";


export default class Employee {
    constructor(
        public empId: number,
        public  lastName: string,
        public   branchId: number,
        public hash: string,
        public username: string,
        public  role: role,
        public password?:string,
        public firstName?: string|undefined|null,
        public city?: string|undefined|null,
        public  street?: string|undefined|null,
        public  houseNo?: string|undefined|null
        
        
    ) { }
}