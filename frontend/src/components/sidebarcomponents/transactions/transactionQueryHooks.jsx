import { useInfiniteQuery } from "@tanstack/react-query";
import { Axios } from "../../../../utils/axios.mjs";


// ******************************************************************** GET ALL ORDER INFINITE HOOK *********************************************************************//



const returnAllTransaction = async({ getTransactionSuccessfn, filters, pageParam }) => {
    console.log("kjbs", getTransactionSuccessfn, filters, pageParam)
  
    try {
  
      let body = {
          filters: JSON.parse(filters),
          nextCursor: pageParam,
          previousCursor: null,
          limit: 10 // or whatever page size you need
      }
  
      let res = await Axios.post(`/transactions/getall`, body)
  
      if(res.data.success){
      console.log(res.data);
      const Transactionarr = [...res.data.data];
      
     
      if(getTransactionSuccessfn){
        getTransactionSuccessfn(Transactionarr)
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
  
   export const useGetTransactions = (getTransactionSuccessfn, filters) => { // When fetchNextPage is executed pageParam takes value of getNextPageParam, when fetchPreviousPage is executed it takes value from getPreviousPageParam 
    
    return useInfiniteQuery({ 
  
      queryKey: [`transactions`, filters], 
      queryFn:({ queryKey, pageParam }) => returnAllTransaction({getTransactionSuccessfn, filters : queryKey[1], pageParam }),
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
  
  