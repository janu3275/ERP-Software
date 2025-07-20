import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Axios } from "../../../../../../utils/axios.mjs";

const getAllCustomerPayments = async({ customerId, getCustomerPaymentsSuccessfn, filters, pageParam }) => {

    try {

      let body = {
        filters: JSON.parse(filters),
        nextCursor: pageParam,
        previousCursor: null,
        limit: 100 // or whatever page size you need
      }  
  
     let res = await Axios.post(`/CustomerPayment/getall/${customerId}`, body)
  
      if(res.data.success){
  
        console.log(res.data.data)
        let CustomerPaymentsarr = [...res.data.data]

          
    if(getCustomerPaymentsSuccessfn){
      
        getCustomerPaymentsSuccessfn(CustomerPaymentsarr)

      }
  
      return res.data
     
  
      
      }else{
        throw new Error('Failed to fetch all customer payments', customerId)
      }
  
    } catch (error) {
      console.log(error)
      throw new Error('Failed to fetch all customer payments', customerId)
    }
  
  }
  
  export const useGetCustomerPayments = ( customerId, getCustomerPaymentsSuccessfn, filters ) => {
  
    return useInfiniteQuery({ 
  
      queryKey: [`customerPayments-${customerId}`, filters], 
      queryFn:({queryKey, pageParam})=>getAllCustomerPayments({ customerId, getCustomerPaymentsSuccessfn, filters : queryKey[1], pageParam }),
      initialPageParam: null, 
      staleTime: 1000 * 60 * 60,
      gcTime: 1000 * 60 * 10,
      getNextPageParam: ( lastPage, allPages, lastPageParam, allPageParams ) => {
        console.log(lastPage, allPages, lastPageParam, allPageParams)
        return lastPage?.nextCursor || undefined
       },
       // getPreviousPageParam: (firstPage) => firstPage?.prevCursor || undefined,
       maxPages:3
  
    })

  
  };

  // ******************************************************************** ADD VENDOR PAYMENT HOOK *********************************************************************//

const addCustomerPayment = async ( data , customerId ) => {
    console.log(data, customerId)
     try {
   
       let body = {
         ...data,
         customer_id: customerId,
         paidOptionInfo: data.paidOptionInfo
             .map((option) => {
               return {
                 via: option.via,
                 checked: true,
                 amount: parseFloat(option.amount),
               };
             })
       }
   
       let res = await Axios.post(`/CustomerPayment/add`, body )
   
       if(res.data.success){
         return res.data
        
       }else{
         throw new Error('Failed to create customer payment');
       }
   
     } catch (error) {
       console.log(error)
       throw new Error('Failed to create customer payment');
     }
   
   }
   
   export const useAddCustomerPayment = (addCustomerPaymentSuccessfn) => {
   
    return useMutation({
   
       mutationFn: ({ data, customerId }) => addCustomerPayment( data, customerId ), 
       onSuccess: () =>addCustomerPaymentSuccessfn(),
   })
   
   }

   
   
   // ******************************************************************** UPDATE VENDOR PAYMENT HOOK *********************************************************************//   


 const updateCustomerPayment = async( data ) => {
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
  
    let res = await Axios.post( `/CustomerPayment/update`, body )
      if(res.data.success){
         return res.data
      }else{
        throw new Error('Failed to update customer');
      }
  
    } catch (error) {
      console.log(error)
      throw new Error('Failed to update customer');
    }
  
  }   
  
  export const useUpdateCustomerPayment = (updateCustomerPaymentSuccessfn) => {
  
    return useMutation({
  
       mutationFn: (data) => updateCustomerPayment(data), 
       onSuccess: () => updateCustomerPaymentSuccessfn()
   })
  
  }   
  
  // ******************************************************************** DELETE VENDOR PAYMENT HOOK *********************************************************************//

 const deleteCustomerPayment = async( CustomerPayment, CustomerPaymentsarr ) => {

    try {
  
      const selctedCustomerPaymentsRow = CustomerPaymentsarr.filter((row)=>row.id===CustomerPayment[0].id)[0] || null
      if(!selctedCustomerPaymentsRow){
        console.log(selctedCustomerPaymentsRow)
        return 
      } 
  
      let res = await Axios.delete(`/CustomerPayment/delete?paymentId=${selctedCustomerPaymentsRow.id}`)
  
    if(res.data.success){
        return res.data
    }else{
      throw new Error('Failed to delete customer payment');
    }
  
    } catch (error) {
      console.log(error)
      throw new Error('Failed to delete customer payment');
    }
  
  }
  
  export const useDeleteCustomerPayment = ( deleteCustomerPaymentSuccessfn ) => {
  
    return useMutation({
  
       mutationFn: ({ CustomerPayment, CustomerPaymentsarr }) => deleteCustomerPayment( CustomerPayment, CustomerPaymentsarr ), 
       onSuccess: () => deleteCustomerPaymentSuccessfn()
  
   })
  
  }
  
  