import { useInfiniteQuery } from "@tanstack/react-query";
import { Axios } from "../../../../../../utils/axios.mjs";

const getAllCustomerOrders = async({ customerId, getCustomerOrdersSuccessfn, filters, pageParam }) => {

    try {

      let body = {
        filters: JSON.parse(filters),
        nextCursor: pageParam,
        previousCursor: null,
        limit: 100 // or whatever page size you need
      }  
  
     let res = await Axios.post(`/Order/getbycustomer/${customerId}`, body)
  
      if(res.data.success){
  
        console.log(res.data.data)
        let CustomerOrdersarr = [...res.data.data]

          
    if(getCustomerOrdersSuccessfn){
      
        getCustomerOrdersSuccessfn(CustomerOrdersarr)

      }
  
      return res.data
     
  
      
      }else{
        throw new Error('Failed to fetch all customer Orders', customerId)
      }
  
    } catch (error) {
      console.log(error)
      throw new Error('Failed to fetch all customer Orders', customerId)
    }
  
  }
  
  export const useGetCustomerOrders = ( customerId, getCustomerOrdersSuccessfn, filters ) => {
  
    return useInfiniteQuery({ 
  
      queryKey: [`customerOrders-${customerId}`, filters], 
      queryFn:({queryKey, pageParam})=>getAllCustomerOrders({ customerId, getCustomerOrdersSuccessfn, filters : queryKey[1], pageParam }),
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

 
  
  