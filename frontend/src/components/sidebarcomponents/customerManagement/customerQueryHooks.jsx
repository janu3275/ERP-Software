import { keepPreviousData, useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { Axios } from "../../../../utils/axios.mjs";


// ******************************************************************** GET ALL CUSTOMER INFINITE HOOK *********************************************************************//
const returnAllCustomer = async({getCustomerSuccessfn, filters, pageParam}) => {
  console.log("kjbs", getCustomerSuccessfn, filters, pageParam)

  try {

    let body = {
        filters: JSON.parse(filters),
        nextCursor: pageParam,
        previousCursor: null,
        limit: 100 // or whatever page size you need
    }

    let res = await Axios.post(`/Customer/getall`, body)

    if(res.data.success){
    console.log(res.data);
    const Customerarr = [...res.data.data];
    console.log("🚀 ~ returnAllCustomer ~ Customerarr:", Customerarr)
   
    if(getCustomerSuccessfn){
      
      getCustomerSuccessfn(Customerarr)
    }

    return res.data

    }else{

      throw new Error('Failed to fetch customers')
      
    }

  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch customers', error)
  }

 }

 export const useGetCustomers = (getCustomerSuccessfn, filters) => { // When fetchNextPage is executed pageParam takes value of getNextPageParam, when fetchPreviousPage is executed it takes value from getPreviousPageParam 
  
  return useInfiniteQuery({ 

    queryKey: ['customers', filters], 
    queryFn:({queryKey, pageParam }) => returnAllCustomer({getCustomerSuccessfn, filters : queryKey[1], pageParam}),
    initialPageParam:null,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 10,
    // placeholderData: keepPreviousData,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
     console.log(lastPage, allPages, lastPageParam, allPageParams)
     return lastPage?.nextCursor || undefined
    },
    // getPreviousPageParam: (firstPage) => firstPage?.prevCursor || undefined,
    maxPages:3,
    
    

  })

};

export const useGetPanelCustomers = (getCustomerSuccessfn, filters) => { // When fetchNextPage is executed pageParam takes value of getNextPageParam, when fetchPreviousPage is executed it takes value from getPreviousPageParam 
  
  return useInfiniteQuery({ 

    queryKey: ['panelcustomers', filters], 
    queryFn:({queryKey, pageParam }) => returnAllCustomer({getCustomerSuccessfn, filters : queryKey[1], pageParam}),
    // staleTime: 1000 * 60 * 60,
    // gcTime: 1000 * 60 * 10,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
     console.log(lastPage, allPages, lastPageParam, allPageParams)
     return lastPage?.nextCursor || undefined
    },
    // getPreviousPageParam: (firstPage) => firstPage?.prevCursor || undefined,
    maxPages:3
    

  })

};

// ******************************************************************** GET VENDOR BY ID HOOK *********************************************************************//

const returnCustomerInfoById = async(getCustomerSuccessfn, customerId) => { 
  console.log(customerId)
  try {
      let res = await Axios.get(`/Customer/getbyid/${customerId}`)
      if(res.data.success){
        console.log(res.data.data)
        let Customerinfo = res.data.data

        if(getCustomerSuccessfn){
          getCustomerSuccessfn()
        }
        return Customerinfo
        
      }else{
        throw new Error('Failed to fetch customer by id', customerId)
      }
    } catch (error) {
      console.log(error)
      throw new Error('Failed to fetch customer by id', customerId)
    }
}

export const useGetCustomerByID = ( getCustomerSuccessfn, customerId ) => {

  return useQuery({ 
    queryKey: [`customers-${customerId}`], 
    queryFn:()=>returnCustomerInfoById( getCustomerSuccessfn, customerId ),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 10

  })

};

// ******************************************************************** GET VENDOR BILLS *********************************************************************//

const getAllCustomerBills = async( customerId, product_type ) => {

  try {

    const params = {
      customerId, 
      product_type
    }

    const queryString = new URLSearchParams(params).toString();
    let res = await Axios.get(`/CustomerBill/getall?${queryString}`)

    if(res.data.success){
      console.log(res.data.data)
      let CustomerBillsarr = [...res.data.data]
   
      return CustomerBillsarr
    
    }

  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch all customer bills', customerId)
  }

}

export const useGetCustomerBills = ( customerId, product_type ) => {

  return useQuery({ 
    queryKey: [`customerBills-${customerId}`], 
    queryFn:()=>getAllCustomerBills( customerId, product_type  ),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 10

  })

};

// ******************************************************************** GET VENDOR PAYMENT *********************************************************************//

const getAllCustomerPayments = async( customerId ) => {

  try {

   let res = await Axios.get(`/CustomerPayment/getall/${customerId}`)

    if(res.data.success){

      console.log(res.data.data)
      let CustomerPaymentsarr = [...res.data.data]
   
      return CustomerPaymentsarr
    
    }else{
      throw new Error('Failed to fetch all customer payments', customerId)
    }

  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch all customer payments', customerId)
  }

}

export const useGetCustomerPayments = ( customerId ) => {

  return useQuery({ 

    queryKey: [`customerPayments-${customerId}`], 
    queryFn:()=>getAllCustomerPayments( customerId ),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 10

  })

};

// ******************************************************************** GET VENDOR PURCHASE ORDERS *********************************************************************//

const getAllCustomerPO = async( customerId ) => {

  try {

    let res = await Axios.get(`/CustomerPO/getall/${customerId}`)

    if(res.data.success){

      console.log(res.data.data)
      let CustomerPO = [...res.data.data]
   
      return CustomerPO
    
    }else{
      throw new Error('Failed to fetch all customer po', customerId)
    }

  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch all customer po', customerId)
  }

}

export const useGetCustomerPO = ( customerId ) => {

  return useQuery({ 

    queryKey: [`customerPOs-${customerId}`], 
    queryFn:()=>getAllCustomerPO( customerId ),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 10

  })

};  


// ******************************************************************** ADD VENDOR HOOK *********************************************************************//

const createNewCustomer = async ( data ) => {

    try {

      let body = {
        ...data
      }

      let res = await Axios.post(`/Customer/add`, body)

      if(res.data.success){
        return res.data
       
      }else{
        throw new Error('Failed to create customer');
      }

    } catch (error) {
      console.log(error)
      throw new Error('Failed to create customer');
    }

  }

  export const useAddCustomer = (addCustomerSuccessfn) => {
   return useMutation({

      mutationFn: (data) => createNewCustomer(data), 
      onSuccess: () =>addCustomerSuccessfn(),
  })
  }




// ******************************************************************** ADD VENDOR BILL HOOK *********************************************************************//

const addCustomerBill = async ( data , customerId, product_type ) => {

  try {

    let body = {
      ...data,
      customerId,
      product_type
    }

    let res = await Axios.post(`/CustomerBill/add`, body )

    if(res.data.success){
      return res.data
     
    }else{
      throw new Error('Failed to create customer');
    }

  } catch (error) {
    console.log(error)
    throw new Error('Failed to create customer');
  }

}

export const useAddCustomerBill = (addCustomerBillSuccessfn) => {

 return useMutation({

    mutationFn: ({data, customerId, product_type} ) => addCustomerBill(data, customerId, product_type), 
    onSuccess: () =>addCustomerBillSuccessfn(),
})

}

// ******************************************************************** ADD VENDOR PAYMENT HOOK *********************************************************************//

const addCustomerPayment = async ( data , customerId ) => {
 console.log(data, customerId)
  try {

    let body = {
      ...data,
      customerId
    }

    let res = await Axios.post(`/CustomerPayment/add`, body )

    if(res.data.success){
      return res.data
     
    }else{
      throw new Error('Failed to create customer');
    }

  } catch (error) {
    console.log(error)
    throw new Error('Failed to create customer');
  }

}

export const useAddCustomerPayment = (addCustomerPaymentSuccessfn) => {

 return useMutation({

    mutationFn: ({ data, customerId }) => addCustomerPayment( data, customerId ), 
    onSuccess: () =>addCustomerPaymentSuccessfn(),
})

}

// ******************************************************************** ADD VENDOR PO HOOK *********************************************************************//

const addCustomerPO = async ( data , customerId ) => {
  console.log(data, customerId)
   try {

    let body = {
      ...data,
      customerId
    }

    let res = await Axios.post(`/CustomerPO/add`, body )
 
     if(res.data.success){
       return res.data
      
     }else{
       throw new Error('Failed to create customer');
     }
 
   } catch (error) {
     console.log(error)
     throw new Error('Failed to create customer');
   }
 
 }
 
 export const useAddCustomerPO = ( addCustomerPOSuccessfn ) => {
 
  return useMutation({
 
     mutationFn: ({ data, customerId }) => addCustomerPO( data, customerId ), 
     onSuccess: () => addCustomerPOSuccessfn()
 })
 
 }

  // ******************************************************************** UPDATE VENDOR HOOK *********************************************************************//

const updateCustomer = async(data) => {
   
    try {

      let body = {

        customerid: `${data.customerid}`, 
        ...data.data
      }

      let res = await Axios.post( `/Customer/update`, body )
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

export const useUpdateCustomer = (updateCustomerSuccessfn) => {

    return useMutation({
 
       mutationFn: (data) => updateCustomer(data), 
       onSuccess: () =>updateCustomerSuccessfn(),
   })

   }

 // ******************************************************************** UPDATE VENDOR BILL HOOK *********************************************************************//   


   const updateCustomerBill = async( data, product_type ) => {
    console.log(data)
    try {

      let body = {
          billId: `${data.Billid}`, 
          product_type,
        ...data.data
      }

      let res = await Axios.post( `/CustomerBill/update`, body )
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

  export const useUpdateCustomerBill = (updateCustomerBillSuccessfn) => {

    return useMutation({
 
       mutationFn: ({data, product_type}) => updateCustomerBill(data, product_type), 
       onSuccess: () => updateCustomerBillSuccessfn()
   })

   }


 // ******************************************************************** UPDATE VENDOR PAYMENT HOOK *********************************************************************//   


 const updateCustomerPayment = async( data ) => {
  console.log(data)

  try {

    let body = {
      paymentId: `${data.Paymentid}`, 
      
    ...data.data
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

 // ******************************************************************** UPDATE VENDOR PO HOOK *********************************************************************//   


 const updateCustomerPO = async( data ) => {
  console.log(data)

  try {

    let body = {
      poId: `${data.POid}`, 
      
    ...data.data
  }

  let res = await Axios.post( `/CustomerPO/update`, body )

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

export const useUpdateCustomerPO = ( updateCustomerPOSuccessfn ) => {

  return useMutation({

     mutationFn: (data) => updateCustomerPO(data), 
     onSuccess: () => updateCustomerPOSuccessfn()
 })

}   

  // ******************************************************************** DELETE VENDOR HOOK *********************************************************************//

const deleteCustomer = async(Customer, Customerarr) => {
    try {
      const selctedCustomerRow = Customerarr.filter((row)=>row.id===Customer[0].id)[0] || null
      if(!selctedCustomerRow){
        console.log(selctedCustomerRow)
        return 
      }

    let res = await Axios.delete(`/Customer/delete?customerid=${selctedCustomerRow.id}`)

    if(res.data.success){
        return res.data
    }else{
      throw new Error('Failed to delete customer');
    }

    } catch (error) {
      console.log(error)
      throw new Error('Failed to delete customer');
    }

  }  

export const useDeleteCustomer = (deleteCustomerSuccessfn) => {

    return useMutation({
       mutationFn: ({Customer, Customerarr }) => deleteCustomer(Customer, Customerarr), 
       onSuccess: ()=>deleteCustomerSuccessfn()
   })

}

 // ******************************************************************** DELETE VENDOR BILL HOOK *********************************************************************//

const deleteCustomerBill = async( CustomerBill, CustomerBillsarr ) => {

  try {

    const selctedCustomerBillsRow = CustomerBillsarr.filter((row)=>row.id===CustomerBill[0].id)[0] || null
    if(!selctedCustomerBillsRow){
      console.log(selctedCustomerBillsRow)
      return 
    }
    let res = await Axios.delete(`/CustomerBill/delete?billId=${selctedCustomerBillsRow.id}`)

    if(res.data.success){
      return res.data
  }else{
    throw new Error('Failed to delete customer bill');
  }

  } catch (error) {
    console.log(error)
    throw new Error('Failed to delete customer bill');
  }

}

export const useDeleteCustomerBill = ( deleteCustomerBillSuccessfn ) => {

  return useMutation({

     mutationFn: ({ CustomerBill, CustomerBillsarr }) => deleteCustomerBill( CustomerBill, CustomerBillsarr ), 
     onSuccess: () => deleteCustomerBillSuccessfn()
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


 // ******************************************************************** DELETE VENDOR PO HOOK *********************************************************************//

 const deleteCustomerPO = async( CustomerPO, CustomerPOsarr) => {

  try {

    const selctedCustomerPOsRow = CustomerPOsarr.filter((row)=>row.id===CustomerPO[0].id)[0] || null
        if(!selctedCustomerPOsRow){
          console.log(selctedCustomerPOsRow)
          return 
        }
        let res = await Axios.delete(`/CustomerPO/delete?poId=${selctedCustomerPOsRow.id}`)

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

export const useDeleteCustomerPO = ( deleteCustomerPOSuccessfn ) => {

  return useMutation({

     mutationFn: ({ CustomerPO, CustomerPOsarr }) => deleteCustomerPO( CustomerPO, CustomerPOsarr ), 
     onSuccess: () => deleteCustomerPOSuccessfn()

 })

}



  // ******************************************************************** GET ALL VENDOR *********************************************************************//