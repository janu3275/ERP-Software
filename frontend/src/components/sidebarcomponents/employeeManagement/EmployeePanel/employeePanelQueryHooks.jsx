import { useQuery } from "@tanstack/react-query";
import { Axios } from "../../../../../utils/axios.mjs";

// ******************************************************************** GET ALL Employee HOOK *********************************************************************//
const returnAllEmployee = async(getEmployeeSuccessfn) => {
    try {
  
      let res = await Axios.get(`/employee/getall`)
  
      if(res.data.success){
      console.log(res.data.data);
      const Employeearr = [...res.data.data];
      console.log("🚀 ~ returnAllEmployee ~ Employeearr:", Employeearr)
      console.log("🚀 ~ returnAllEmployee ~ getEmployeeSuccessfn:", getEmployeeSuccessfn)
      if(getEmployeeSuccessfn){
        
        getEmployeeSuccessfn(Employeearr)
      }
    
      return Employeearr
  
      }else{
  
        throw new Error('Failed to fetch Employees')
        
      }
  
    } catch (error) {
      console.log(error)
      throw new Error('Failed to fetch Employees', error)
    }
    
   }
  
   export const useGetEmployeesPanel = (getEmployeeSuccessfn) => {
  
    return useQuery({ 
      queryKey: ['EmployeesPanel'], 
      queryFn:()=>returnAllEmployee(getEmployeeSuccessfn),
      staleTime: 1000 * 60 * 60,
      gcTime: 1000 * 60 * 10
  
    })
  
  };
