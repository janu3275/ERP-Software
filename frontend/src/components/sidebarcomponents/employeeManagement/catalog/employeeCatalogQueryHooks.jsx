import { useMutation, useQuery } from "@tanstack/react-query";
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
  
   export const useGetEmployees = (getEmployeeSuccessfn) => {
  
    return useQuery({ 
      queryKey: ['Employees'], 
      queryFn:()=>returnAllEmployee(getEmployeeSuccessfn),
      staleTime: 1000 * 60 * 60,
      gcTime: 1000 * 60 * 10
  
    })
  
  };

  // ******************************************************************** ADD Employee HOOK *********************************************************************//

const createNewEmployee = async ( data, positionid, departmentid ) => {

    try {

      let body = {
        ...data,
        position_id:positionid,
        department_id: departmentid
      }

      let res = await Axios.post(`/employee/add`, body)

      if(res.data.success){
        return res.data
       
      }else{
        throw new Error('Failed to create Employee');
      }

    } catch (error) {
      console.log(error)
      throw new Error('Failed to create Employee');
    }

  }

  export const useAddEmployee = (addEmployeeSuccessfn) => {
   return useMutation({

      mutationFn: (data, positionid, departmentid) => createNewEmployee(data, positionid, departmentid), 
      onSuccess: () =>addEmployeeSuccessfn(),
  })
  }


 // ******************************************************************** UPDATE Employee HOOK *********************************************************************//

 const updateEmployee = async(data, positionid, departmentid) => {
   console.log(data, positionid, departmentid)
    try {

      let body = {

        employee_id: `${data.Employeeid}`, 
        ...data.data,
        position_id: positionid,
        department_id: departmentid
      }

      let res = await Axios.post( `/employee/update`, body )
      if(res.data.success){
        return res.data
    
      }else{
        throw new Error('Failed to update Employee');
      }

    } catch (error) {

      console.log(error)
      throw new Error('Failed to update Employee');

    }

  }  

export const useUpdateEmployee = (updateEmployeeSuccessfn) => {

    return useMutation({
 
       mutationFn: ({data, positionid, departmentid}) => updateEmployee(data, positionid, departmentid), 
       onSuccess: () => updateEmployeeSuccessfn()

   })

   }

     // ******************************************************************** DELETE Employee HOOK *********************************************************************//

const deleteEmployee = async(employee, employeearr) => {
    try {
        const selctedemployeeRow = employeearr.filter((row)=>row.id===employee[0].id)[0] || null
        if(!selctedemployeeRow){
          console.log(selctedemployeeRow)
          return 
        }

        let res = await Axios.delete(`/employee/delete?employee_id=${selctedemployeeRow.id}`)

    if(res.data.success){
        return res.data
    }else{
      throw new Error('Failed to delete Employee');
    }

    } catch (error) {
      console.log(error)
      throw new Error('Failed to delete Employee');
    }

  }  

export const useDeleteEmployee = (deleteEmployeeSuccessfn) => {

    return useMutation({
       mutationFn: ({Employee, Employeearr }) => deleteEmployee(Employee, Employeearr), 
       onSuccess: ()=>deleteEmployeeSuccessfn()
   })

}
