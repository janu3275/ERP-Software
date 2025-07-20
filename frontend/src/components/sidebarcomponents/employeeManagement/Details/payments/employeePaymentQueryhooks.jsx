import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Axios } from "../../../../../../utils/axios.mjs";

const getAllEmployeePayments = async({ EmployeeId, getEmployeePaymentsSuccessfn, filters, pageParam }) => {

    try {

      let body = {
        filters: JSON.parse(filters),
        nextCursor: pageParam,
        previousCursor: null,
        limit: 100 // or whatever page size you need
      }  
  
     let res = await Axios.post(`/employeePayment/getall/${EmployeeId}`, body)
  
      if(res.data.success){
  
        console.log(res.data.data)
        let EmployeePaymentsarr = [...res.data.data]

          
    if(getEmployeePaymentsSuccessfn){
      
        getEmployeePaymentsSuccessfn(EmployeePaymentsarr)

      }
  
      return res.data
     
  
      
      }else{
        throw new Error('Failed to fetch all Employee payments', EmployeeId)
      }
  
    } catch (error) {
      console.log(error)
      throw new Error('Failed to fetch all Employee payments', EmployeeId)
    }
  
  }
  
  export const useGetEmployeePayments = ( EmployeeId, getEmployeePaymentsSuccessfn, filters ) => {
  
    return useInfiniteQuery({ 
  
      queryKey: [`employeePayments-${EmployeeId}`, filters], 
      queryFn:({queryKey, pageParam})=>getAllEmployeePayments({ EmployeeId, getEmployeePaymentsSuccessfn, filters : queryKey[1], pageParam }),
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

  // ******************************************************************** ADD VENDOR PAYMENT HOOK *********************************************************************//

const addEmployeePayment = async ( data , employeeId ) => {
    console.log(data, employeeId)
     try {
   
       let body = {
         ...data,
         employee_id: employeeId,
         paidOptionInfo: data.paidOptionInfo
             .map((option) => {
               return {
                 via: option.via,
                 checked: true,
                 amount: parseFloat(option.amount),
               };
             })
       }
   
       let res = await Axios.post(`/employeePayment/add`, body )
   
       if(res.data.success){
         return res.data
        
       }else{
         throw new Error('Failed to create Employee payment');
       }
   
     } catch (error) {
       console.log(error)
       throw new Error('Failed to create Employee payment');
     }
   
   }
   
   export const useAddEmployeePayment = (addEmployeePaymentSuccessfn) => {
   
    return useMutation({
   
       mutationFn: ({ data, employeeId }) => addEmployeePayment( data, employeeId ), 
       onSuccess: () =>addEmployeePaymentSuccessfn(),
   })
   
   }

   
   
   // ******************************************************************** UPDATE VENDOR PAYMENT HOOK *********************************************************************//   


 const updateEmployeePayment = async( data ) => {
    console.log(data)
  
    try {
  
        let body = {
                      ...data.data,
                        payment_id: `${data.Paymentid}`, 
                        paidOptionInfo: data.data.paidOptionInfo
                       .map((option) => {
                          return {
                            via: option.via,
                            checked: true,
                            amount: parseFloat(option.amount),
                          };
                        }),
                      
                    }
  
    let res = await Axios.post( `/employeePayment/update`, body )
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
  
  export const useUpdateEmployeePayment = (updateEmployeePaymentSuccessfn) => {
  
    return useMutation({
  
       mutationFn: (data) => updateEmployeePayment(data), 
       onSuccess: () => updateEmployeePaymentSuccessfn()
   })
  
  }   
  
  // ******************************************************************** DELETE VENDOR PAYMENT HOOK *********************************************************************//

 const deleteEmployeePayment = async( EmployeePayment, EmployeePaymentsarr ) => {

    try {
  
      const selctedEmployeePaymentsRow = EmployeePaymentsarr.filter((row)=>row.id===EmployeePayment[0].id)[0] || null
      if(!selctedEmployeePaymentsRow){
        console.log(selctedEmployeePaymentsRow)
        return 
      } 
  
      let res = await Axios.delete(`/employeePayment/delete?payment_id=${selctedEmployeePaymentsRow.id}`)
  
    if(res.data.success){
        return res.data
    }else{
      throw new Error('Failed to delete Employee payment');
    }
  
    } catch (error) {
      console.log(error)
      throw new Error('Failed to delete Employee payment');
    }
  
  }
  
  export const useDeleteEmployeePayment = ( deleteEmployeePaymentSuccessfn ) => {
  
    return useMutation({
  
       mutationFn: ({ EmployeePayment, EmployeePaymentsarr }) => deleteEmployeePayment( EmployeePayment, EmployeePaymentsarr ), 
       onSuccess: () => deleteEmployeePaymentSuccessfn()
  
   })
  
  }
  
  