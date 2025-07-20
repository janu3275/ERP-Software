import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { Axios } from "../../../utils/axios.mjs"

// ******************************************************************** GET ALL VENDOR HOOK *********************************************************************//
const returnAllVendor = async(getVendorSuccessfn) => {
  try {

    let res = await Axios.get(`/Vendor/getall`)

    if(res.data.success){
    console.log(res.data.data);
    const Vendorarr = [...res.data.data];
    console.log("🚀 ~ returnAllVendor ~ Vendorarr:", Vendorarr)
    console.log("🚀 ~ returnAllVendor ~ getVendorSuccessfn:", getVendorSuccessfn)
    if(getVendorSuccessfn){
      
      getVendorSuccessfn(Vendorarr)
    }
  
    return Vendorarr

    }else{

      throw new Error('Failed to fetch vendors')
      
    }

  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch vendors', error)
  }
 }

 export const useGetVendors = (getVendorSuccessfn) => {

  return useQuery({ 
    queryKey: ['vendors'], 
    queryFn:()=>returnAllVendor(getVendorSuccessfn),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 10

  })

};

// ******************************************************************** GET VENDOR BY ID HOOK *********************************************************************//

const returnVendorInfoById = async(getVendorSuccessfn, vendorId) => { 
  console.log(vendorId)
  try {
      let res = await Axios.get(`/Vendor/getbyid/${vendorId}`)
      if(res.data.success){
        console.log(res.data.data)
        let Vendorinfo = res.data.data

        if(getVendorSuccessfn){
          getVendorSuccessfn()
        }
        return Vendorinfo
        
      }else{
        throw new Error('Failed to fetch vendor by id', vendorId)
      }
    } catch (error) {
      console.log(error)
      throw new Error('Failed to fetch vendor by id', vendorId)
    }
}

export const useGetVendorByID = ( getVendorSuccessfn, vendorId ) => {

  return useQuery({ 

    queryKey: [`vendors-${vendorId}`], 
    queryFn:()=>returnVendorInfoById( getVendorSuccessfn, vendorId ),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 10

  })

};

// ******************************************************************** GET VENDOR BILLS *********************************************************************//

const getAllVendorBills = async({ vendorId, getVendorBillsSuccessfn, filters, pageParam,  product_type }) => {

  try {

    const params = {
      vendorId, 
      product_type
    }

    let body = {
      filters: JSON.parse(filters),
      nextCursor: pageParam,
      previousCursor: null,
      limit: 100 // or whatever page size you need
    } 

    const queryString = new URLSearchParams(params).toString();
    let res = await Axios.post(`/VendorBill/getall?${queryString}`, body)

    if(res.data.success){
      console.log(res.data.data)
      let VendorBillsarr = [...res.data.data]

      if(getVendorBillsSuccessfn){
      
        getVendorBillsSuccessfn(VendorBillsarr)

      }
   
      return res.data
    
    }else{
      throw new Error('Failed to fetch all vendor bills', vendorId)
    }

  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch all vendor bills', vendorId)
  }

}

export const useGetVendorBills = ( vendorId, product_type, getVendorBillsSuccessfn, filters ) => {

  return useInfiniteQuery({ 
    
    queryKey: [`vendorBills-${vendorId}`, filters], 
    queryFn:({queryKey, pageParam})=>getAllVendorBills({ vendorId, getVendorBillsSuccessfn, filters: queryKey[1], pageParam,  product_type }),
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

// ******************************************************************** GET VENDOR PAYMENT *********************************************************************//

const getAllVendorPayments = async({ vendorId, getVendorPaymentsSuccessfn, filters, pageParam }) => {

  try {

    let body = {
      filters: JSON.parse(filters),
      nextCursor: pageParam,
      previousCursor: null,
      limit: 100 // or whatever page size you need
    } 

   let res = await Axios.post(`/VendorPayment/getall/${vendorId}`, body)

    if(res.data.success){

      console.log(res.data.data)
      let VendorPaymentsarr = [...res.data.data]

      if(getVendorPaymentsSuccessfn){
      
        getVendorPaymentsSuccessfn(VendorPaymentsarr)

      }
   
      return res.data
    
    }else{
      throw new Error('Failed to fetch all vendor payments', vendorId)
    }

  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch all vendor payments', vendorId)
  }

}

export const useGetVendorPayments = ( vendorId, getVendorPaymentsSuccessfn, filters ) => {

  return useInfiniteQuery({ 

    queryKey: [`vendorPayments-${vendorId}`, filters], 
    queryFn:({queryKey, pageParam})=>getAllVendorPayments({ vendorId, getVendorPaymentsSuccessfn, filters: queryKey[1], pageParam }),
    initialPageParam:null, 
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

// ******************************************************************** GET VENDOR PURCHASE ORDERS *********************************************************************//

const getAllVendorPO = async({ vendorId, getVendorPOSuccessfn, filters, pageParam }) => {

  try {

    let body = {
      filters: JSON.parse(filters),
      nextCursor: pageParam,
      previousCursor: null,
      limit: 100 // or whatever page size you need
    } 

    let res = await Axios.post(`/VendorPO/getall/${vendorId}`, body)

    if(res.data.success){

      console.log(res.data.data)
      let VendorPOArr = [...res.data.data]

      if(getVendorPOSuccessfn){
      
        getVendorPOSuccessfn(VendorPOArr)

      }
   
      return res.data
    
    }else{
      throw new Error('Failed to fetch all vendor po', vendorId)
    }

  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch all vendor po', vendorId)
  }

}

export const useGetVendorPO = ( vendorId, getVendorPOSuccessfn, filters ) => {

  return useInfiniteQuery({ 

    queryKey: [`vendorPOs-${vendorId}`, filters], 
    queryFn:({queryKey, pageParam})=>getAllVendorPO({ vendorId, getVendorPOSuccessfn, filters: queryKey[1], pageParam }),
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


// ******************************************************************** ADD VENDOR HOOK *********************************************************************//

const createNewVendor = async ( data ) => {

    try {

      let body = {
        ...data
      }

      let res = await Axios.post(`/Vendor/add`, body)

      if(res.data.success){
        return res.data
       
      }else{
        throw new Error('Failed to create vendor');
      }

    } catch (error) {
      console.log(error)
      throw new Error('Failed to create vendor');
    }

  }

  export const useAddVendor = (addVendorSuccessfn) => {
   return useMutation({

      mutationFn: (data) => createNewVendor(data), 
      onSuccess: () =>addVendorSuccessfn(),
  })
  }




// ******************************************************************** ADD VENDOR BILL HOOK *********************************************************************//

const addVendorBill = async ( data , vendorId, product_type ) => {

  try {

    let body = {
      ...data,
      vendorId,
      product_type
    }

    let res = await Axios.post(`/VendorBill/add`, body )

    if(res.data.success){
      return res.data
     
    }else{
      throw new Error('Failed to create vendor');
    }

  } catch (error) {
    console.log(error)
    throw new Error('Failed to create vendor');
  }

}

export const useAddVendorBill = (addVendorBillSuccessfn) => {

 return useMutation({

    mutationFn: ({data, vendorId, product_type} ) => addVendorBill(data, vendorId, product_type), 
    onSuccess: () =>addVendorBillSuccessfn(),
})

}

// ******************************************************************** ADD VENDOR PAYMENT HOOK *********************************************************************//

const addVendorPayment = async ( data , vendorId ) => {
 console.log(data, vendorId)
  try {

    let body = {
      ...data,
      vendorId
    }

    let res = await Axios.post(`/VendorPayment/add`, body )

    if(res.data.success){
      return res.data
     
    }else{
      throw new Error('Failed to create vendor');
    }

  } catch (error) {
    console.log(error)
    throw new Error('Failed to create vendor');
  }

}

export const useAddVendorPayment = (addVendorPaymentSuccessfn) => {

 return useMutation({

    mutationFn: ({ data, vendorId }) => addVendorPayment( data, vendorId ), 
    onSuccess: () =>addVendorPaymentSuccessfn(),
})

}

// ******************************************************************** ADD VENDOR PO HOOK *********************************************************************//

const addVendorPO = async ( data , vendorId ) => {
  console.log(data, vendorId)
   try {

    let body = {
      ...data,
      vendorId
    }

    let res = await Axios.post(`/VendorPO/add`, body )
 
     if(res.data.success){
       return res.data
      
     }else{
       throw new Error('Failed to create vendor');
     }
 
   } catch (error) {
     console.log(error)
     throw new Error('Failed to create vendor');
   }
 
 }
 
 export const useAddVendorPO = ( addVendorPOSuccessfn ) => {
 
  return useMutation({
 
     mutationFn: ({ data, vendorId }) => addVendorPO( data, vendorId ), 
     onSuccess: () => addVendorPOSuccessfn()
 })
 
 }

  // ******************************************************************** UPDATE VENDOR HOOK *********************************************************************//

const updateVendor = async(data) => {
   
    try {

      let body = {

        vendor_id: `${data.Vendorid}`, 
        ...data.data
      }

      let res = await Axios.post( `/Vendor/update`, body )
      if(res.data.success){
        return res.data
    
      }else{
        throw new Error('Failed to update vendor');
      }

    } catch (error) {

      console.log(error)
      throw new Error('Failed to update vendor');

    }

  }  

export const useUpdateVendor = (updateVendorSuccessfn) => {

    return useMutation({
 
       mutationFn: (data) => updateVendor(data), 
       onSuccess: () =>updateVendorSuccessfn(),
   })

   }

 // ******************************************************************** UPDATE VENDOR BILL HOOK *********************************************************************//   


   const updateVendorBill = async( data, product_type ) => {
    console.log(data)
    try {

      let body = {
          billId: `${data.Billid}`, 
          product_type,
        ...data.data
      }

      let res = await Axios.post( `/VendorBill/update`, body )
      if(res.data.success){
         return res.data
      }else{
        throw new Error('Failed to update vendor');
      }

    } catch (error) {
      console.log(error)
      throw new Error('Failed to update vendor');
    }

  }   

  export const useUpdateVendorBill = (updateVendorBillSuccessfn) => {

    return useMutation({
 
       mutationFn: ({data, product_type}) => updateVendorBill(data, product_type), 
       onSuccess: () => updateVendorBillSuccessfn()
   })

   }


 // ******************************************************************** UPDATE VENDOR PAYMENT HOOK *********************************************************************//   


 const updateVendorPayment = async( data ) => {
  console.log(data)

  try {

    let body = {
      paymentId: `${data.Paymentid}`, 
      
    ...data.data
  }

  let res = await Axios.post( `/VendorPayment/update`, body )
    if(res.data.success){
       return res.data
    }else{
      throw new Error('Failed to update vendor');
    }

  } catch (error) {
    console.log(error)
    throw new Error('Failed to update vendor');
  }

}   

export const useUpdateVendorPayment = (updateVendorPaymentSuccessfn) => {

  return useMutation({

     mutationFn: (data) => updateVendorPayment(data), 
     onSuccess: () => updateVendorPaymentSuccessfn()
 })

}   

 // ******************************************************************** UPDATE VENDOR PO HOOK *********************************************************************//   


 const updateVendorPO = async( data ) => {
  console.log(data)

  try {

    let body = {
      poId: `${data.POid}`, 
      
    ...data.data
  }

  let res = await Axios.post( `/VendorPO/update`, body )

    if(res.data.success){
       return res.data
    }else{
      throw new Error('Failed to update vendor');
    }

  } catch (error) {
    console.log(error)
    throw new Error('Failed to update vendor');
  }

}   

export const useUpdateVendorPO = ( updateVendorPOSuccessfn ) => {

  return useMutation({

     mutationFn: (data) => updateVendorPO(data), 
     onSuccess: () => updateVendorPOSuccessfn()
 })

}   

  // ******************************************************************** DELETE VENDOR HOOK *********************************************************************//

const deleteVendor = async(Vendor, Vendorarr) => {
    try {
      const selctedVendorRow = Vendorarr.filter((row)=>row.id===Vendor[0].id)[0] || null
      if(!selctedVendorRow){
        console.log(selctedVendorRow)
        return 
      }

    let res = await Axios.delete(`/Vendor/delete?vendor_id=${selctedVendorRow.id}`)

    if(res.data.success){
        return res.data
    }else{
      throw new Error('Failed to delete vendor');
    }

    } catch (error) {
      console.log(error)
      throw new Error('Failed to delete vendor');
    }

  }  

export const useDeleteVendor = (deleteVendorSuccessfn) => {

    return useMutation({
       mutationFn: ({Vendor, Vendorarr }) => deleteVendor(Vendor, Vendorarr), 
       onSuccess: ()=>deleteVendorSuccessfn()
   })

}

 // ******************************************************************** DELETE VENDOR BILL HOOK *********************************************************************//

const deleteVendorBill = async( VendorBill, VendorBillsarr ) => {

  try {

    const selctedVendorBillsRow = VendorBillsarr.filter((row)=>row.id===VendorBill[0].id)[0] || null
    if(!selctedVendorBillsRow){
      console.log(selctedVendorBillsRow)
      return 
    }
    let res = await Axios.delete(`/VendorBill/delete?billId=${selctedVendorBillsRow.id}`)

    if(res.data.success){
      return res.data
  }else{
    throw new Error('Failed to delete vendor bill');
  }

  } catch (error) {
    console.log(error)
    throw new Error('Failed to delete vendor bill');
  }

}

export const useDeleteVendorBill = ( deleteVendorBillSuccessfn ) => {

  return useMutation({

     mutationFn: ({ VendorBill, VendorBillsarr }) => deleteVendorBill( VendorBill, VendorBillsarr ), 
     onSuccess: () => deleteVendorBillSuccessfn()
 })

}

 // ******************************************************************** DELETE VENDOR PAYMENT HOOK *********************************************************************//

 const deleteVendorPayment = async( VendorPayment, VendorPaymentsarr ) => {

  try {

    const selctedVendorPaymentsRow = VendorPaymentsarr.filter((row)=>row.id===VendorPayment[0].id)[0] || null
    if(!selctedVendorPaymentsRow){
      console.log(selctedVendorPaymentsRow)
      return 
    } 

    let res = await Axios.delete(`/VendorPayment/delete?paymentId=${selctedVendorPaymentsRow.id}`)

  if(res.data.success){
      return res.data
  }else{
    throw new Error('Failed to delete vendor payment');
  }

  } catch (error) {
    console.log(error)
    throw new Error('Failed to delete vendor payment');
  }

}

export const useDeleteVendorPayment = ( deleteVendorPaymentSuccessfn ) => {

  return useMutation({

     mutationFn: ({ VendorPayment, VendorPaymentsarr }) => deleteVendorPayment( VendorPayment, VendorPaymentsarr ), 
     onSuccess: () => deleteVendorPaymentSuccessfn()

 })

}


 // ******************************************************************** DELETE VENDOR PO HOOK *********************************************************************//

 const deleteVendorPO = async( VendorPO, VendorPOsarr) => {

  try {

    const selctedVendorPOsRow = VendorPOsarr.filter((row)=>row.id===VendorPO[0].id)[0] || null
        if(!selctedVendorPOsRow){
          console.log(selctedVendorPOsRow)
          return 
        }
        let res = await Axios.delete(`/VendorPO/delete?poId=${selctedVendorPOsRow.id}`)

  if(res.data.success){
      return res.data
  }else{
    throw new Error('Failed to delete vendor payment');
  }

  } catch (error) {
    console.log(error)
    throw new Error('Failed to delete vendor payment');
  }

}

export const useDeleteVendorPO = ( deleteVendorPOSuccessfn ) => {

  return useMutation({

     mutationFn: ({ VendorPO, VendorPOsarr }) => deleteVendorPO( VendorPO, VendorPOsarr ), 
     onSuccess: () => deleteVendorPOSuccessfn()

 })

}



  // ******************************************************************** GET ALL VENDOR *********************************************************************//