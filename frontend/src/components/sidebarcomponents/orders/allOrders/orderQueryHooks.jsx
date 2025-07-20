import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Axios } from "../../../../../utils/axios.mjs";
import { sendWhatsappMessageForOrdeDilevered, sendWhatsappMessageForOrderConfirmation } from "../../../../commonfn";



// ******************************************************************** GET ALL ORDER INFINITE HOOK *********************************************************************//
const returnAllOrder = async({ getOrderSuccessfn, filters, pageParam, status }) => {
  console.log("kjbs", getOrderSuccessfn, filters, pageParam)

  try {

    let body = {
        filters: JSON.parse(filters),
        nextCursor: pageParam,
        previousCursor: null,
        limit: 100 // or whatever page size you need
    }

    let res = await Axios.post(`/Order/getall?status=${status}`, body)

    if(res.data.success){
    console.log(res.data);
    const Orderarr = [...res.data.data];
    console.log("🚀 ~ returnAllOrder ~ Orderarr:", Orderarr)
   
    if(getOrderSuccessfn){
      getOrderSuccessfn(Orderarr)
    }

    return res.data

    }else{

      throw new Error('Failed to fetch orders')
      
    }

  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch orders', error)
  }

 }

 export const useGetOrders = (getOrderSuccessfn, filters, status) => { // When fetchNextPage is executed pageParam takes value of getNextPageParam, when fetchPreviousPage is executed it takes value from getPreviousPageParam 
  
  return useInfiniteQuery({ 

    queryKey: [`Orders-${status}`, filters], 
    queryFn:({queryKey, pageParam }) => returnAllOrder({getOrderSuccessfn, filters : queryKey[1], pageParam, status}),
    initialPageParam:null,
    // staleTime: 1000 * 60 * 60,
    // gcTime: 1000 * 60 * 10,
    // placeholderData: keepPreviousData,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
     console.log(lastPage, allPages, lastPageParam, allPageParams)
     return lastPage?.nextCursor || undefined
    },
    // getPreviousPageParam: (firstPage) => firstPage?.prevCursor || undefined,
    maxPages:3,
    
    

  })

};



// ******************************************************************** GET ORDER BY ID HOOK *********************************************************************//

// const returnOrderInfoById = async(orderid, component) => { 
//   console.log(orderId)
//   try {
//       let res = await Axios.get(`/Order/getbyid/${orderId}`)
//       if(res.data.success){
//         console.log(res.data.data)
//         let Orderinfo = res.data.data

//         if(getOrderSuccessfn){
//           getOrderSuccessfn()
//         }
//         return Orderinfo
        
//       }else{
//         throw new Error('Failed to fetch order by id', orderId)
//       }
//     } catch (error) {
//       console.log(error)
//       throw new Error('Failed to fetch order by id', orderId)
//     }
// }

// export const useGetOrderByID = ( getOrderSuccessfn, orderId ) => {

//   return useQuery({ 
//     queryKey: [`orders-${orderId}`], 
//     queryFn:({orderid, component})=>returnOrderInfoById( orderid, component ),
//     staleTime: 1000 * 60 * 60,
//     gcTime: 1000 * 60 * 10

//   })

// };




// ******************************************************************** ADD ORDER HOOK *********************************************************************//

const createNewOrder = async ( data ) => {

    try {

      let body = {
        ...data
      }

      let res = await Axios.post(`/Order/add`, body)

      if(res.data.success){
        return res.data
       
      }else{
        throw new Error('Failed to create order');
      }

    } catch (error) {
      console.log(error)
      throw new Error('Failed to create order');
    }

  }

  export const useAddOrder = (addOrderSuccessfn) => {
   return useMutation({

      mutationFn: (data) => createNewOrder(data), 
      onSuccess: () =>addOrderSuccessfn(),
  })
  }




  // ******************************************************************** UPDATE ORDER HOOK *********************************************************************//

const updateOrder = async(data) => {
   
    try {

      let body = {

        orderid: `${data.orderid}`, 
        ...data.data
      }

      let res = await Axios.post( `/Order/update`, body )
      if(res.data.success){
        return res.data
    
      }else{
        throw new Error('Failed to update order');
      }

    } catch (error) {

      console.log(error)
      throw new Error('Failed to update order');

    }

  }  

export const useUpdateOrder = (updateOrderSuccessfn) => {

    return useMutation({
 
       mutationFn: (data) => updateOrder(data), 
       onSuccess: () =>updateOrderSuccessfn(),
   })

   }


    // ******************************************************************** UPDATE ORDER STATUS HOOK *********************************************************************//

    const updateOrderStatus = async({ orderid, status, Order, Orderarr }) => {

      const selctedOrderRow = Orderarr.filter((row)=>row.id===Order[0].id)[0] || null

      if(!selctedOrderRow){
        console.log(selctedOrderRow)
        return 
      } 

      const { customer_name, customer_whatsapp_number, order_number, completion_date } = selctedOrderRow
      const recipient = "91" + customer_whatsapp_number

      const body = {
        orderid,
        status
      }

      try {
        let res = await Axios.post(`/Order/updateOrderStatus`, body)
        if(res.data.success){
          
          if(status==='In process'){
            sendWhatsappMessageForOrderConfirmation(recipient, customer_name, order_number, orderid, completion_date)
          }else if(status==='dilevered'){
            sendWhatsappMessageForOrdeDilevered(recipient, customer_name, order_number)
          }
          return res.data
        }else{
          throw new Error('Failed to update order status');
        }
      } catch (error) {
        console.log(error)
      }


    }

export const useUpdateOrderStatus = ( updateOrderSuccessfn ) => {

  return useMutation({

     mutationFn: ({ orderid, status, Order, Orderarr }) => updateOrderStatus({ orderid, status, Order, Orderarr }), 
     onSuccess: () =>updateOrderSuccessfn(),
 })

 }

 
  // ******************************************************************** DELETE ORDER HOOK *********************************************************************//

const deleteOrder = async(Order, Orderarr) => {
    try {
        const selctedOrderRow = Orderarr.filter((row)=>row.id===Order[0].id)[0] || null
        if(!selctedOrderRow){
          console.log(selctedOrderRow)
          return 
        }
        let res = await Axios.delete(`/Order/delete?orderid=${selctedOrderRow.id}`)

    if(res.data.success){
        return res.data
    }else{
      throw new Error('Failed to delete order');
    }

    } catch (error) {
      console.log(error)
      throw new Error('Failed to delete order');
    }

  }  

export const useDeleteOrder = (deleteOrderSuccessfn) => {

    return useMutation({
       mutationFn: ({Order, Orderarr }) => deleteOrder(Order, Orderarr), 
       onSuccess: ()=>deleteOrderSuccessfn()
   })

}


  // ******************************************************************** DELETE ALL ORDER HOOK *********************************************************************//

  const deleteAll = async(orderArr) => {

    let orderIdArr = orderArr.map((order)=>order[0].id)
    const body = {
      orderIdArr
    }
    try {
      let res = await Axios.post(`/Order/multipleDelete`, body)

    if(res.data.success){
        return res.data
    }else{
      throw new Error('Failed to delete order');
    }

    } catch (error) {
      console.log(error)
      throw new Error('Failed to delete order');
    }

  }  

export const useDeleteAllOrder = ( deleteOrderSuccessfn ) => {

    return useMutation({
       mutationFn: ({ orderArr }) => deleteAll(orderArr), 
       onSuccess: ()=>deleteOrderSuccessfn()
   })

}

