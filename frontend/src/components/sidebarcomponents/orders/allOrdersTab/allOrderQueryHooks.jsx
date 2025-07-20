import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Axios } from "../../../../../utils/axios.mjs";
import { sendWhatsappMessageForOrdeDilevered, sendWhatsappMessageForOrderConfirmation } from "../../../../commonfn";



// ******************************************************************** GET ALL ORDER INFINITE HOOK *********************************************************************//
const returnAllOrder = async({ getOrderSuccessfn, filters, pageParam }) => {
  console.log("kjbs", getOrderSuccessfn, filters, pageParam)

  try {

    let body = {
        filters: JSON.parse(filters),
        nextCursor: pageParam,
        previousCursor: null,
        limit: 100 // or whatever page size you need
    }

    let res = await Axios.post(`/Order/getallOrders`, body)

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

 export const useGetOrdersAll = ( getOrderSuccessfn, filters ) => { // When fetchNextPage is executed pageParam takes value of getNextPageParam, when fetchPreviousPage is executed it takes value from getPreviousPageParam 
  
  return useInfiniteQuery({ 

    queryKey: [`Orders-all`, filters], 
    queryFn:({queryKey, pageParam }) => returnAllOrder({getOrderSuccessfn, filters : queryKey[1], pageParam}),
    initialPageParam:null,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 10,
    // placeholderData: keepPreviousData,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
     console.log(lastPage, allPages, lastPageParam, allPageParams)
     return lastPage?.nextCursor || undefined
    },
    // getPreviousPageParam: (firstPage) => firstPage?.prevCursor || undefined,
    maxPages:3
    
    

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




