import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Axios } from "../../../../../../utils/axios.mjs";


// ******************************************************************** GET ALL EmployeeAttendance HOOK *********************************************************************//
const returnAllEmployeeAttendance = async({employeeId, getEmployeeAttendanceSuccessfn, filters, pageParam}) => {
    try {

      let body = {
        filters: JSON.parse(filters),
        nextCursor: pageParam,
        previousCursor: null,
        limit: 100 // or whatever page size you need
      }
  
      let res = await Axios.post(`/employeeAttendance/getByEmployee/${employeeId}`, body)
  
      if(res.data.success){
      console.log(res.data.data);
      const EmployeeAttendancearr = [...res.data.data];
      console.log("🚀 ~ returnAllEmployeeAttendance ~ EmployeeAttendancearr:", EmployeeAttendancearr)
      console.log("🚀 ~ returnAllEmployeeAttendance ~ getEmployeeAttendanceSuccessfn:", getEmployeeAttendanceSuccessfn)
      if(getEmployeeAttendanceSuccessfn){
        getEmployeeAttendanceSuccessfn(EmployeeAttendancearr)
      }
    
      return res.data
  
      }else{
  
        throw new Error('Failed to fetch Employee Attendances', employeeId)
        
      }
  
    } catch (error) {
      console.log(error)
      throw new Error('Failed to fetch Employee Attendances', error, employeeId)
    }

   }
  
   export const useGetEmployeeAttendances = ( employeeId, getEmployeeAttendanceSuccessfn, filters ) => {
  
    return useInfiniteQuery({ 
      queryKey: [`employeeAttendances-${employeeId}`, filters], 
      queryFn:({queryKey, pageParam})=>returnAllEmployeeAttendance({employeeId, getEmployeeAttendanceSuccessfn, filters: queryKey[1], pageParam}),
      initialPageParam:null, 
      staleTime: 1000 * 60 * 60,
      gcTime: 1000 * 60 * 10,
      getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
        console.log(lastPage, allPages, lastPageParam, allPageParams)
        return lastPage?.nextCursor || undefined
       },
       // getPreviousPageParam: (firstPage) => firstPage?.prevCursor || undefined,
       maxPages:3,
  
    })
  
  };



 // ******************************************************************** UPDATE EmployeeAttendance HOOK *********************************************************************//

 const updateEmployeeAttendance = async(data) => {
   
    try {

        let body = {
            attendance_id: `${data.attendanceid}`, 
            ...data.data
        }

        let res = await Axios.post( `/employeeAttendance/updateByEmployee`, body )
      if(res.data.success){
        return res.data
    
      }else{
        throw new Error('Failed to update EmployeeAttendance');
      }

    } catch (error) {

      console.log(error)
      throw new Error('Failed to update EmployeeAttendance');

    }

  }  

export const useUpdateEmployeeAttendance = (updateEmployeeAttendanceSuccessfn) => {

    return useMutation({
 
       mutationFn: (data) => updateEmployeeAttendance(data), 
       onSuccess: () => updateEmployeeAttendanceSuccessfn()

   })

   }


