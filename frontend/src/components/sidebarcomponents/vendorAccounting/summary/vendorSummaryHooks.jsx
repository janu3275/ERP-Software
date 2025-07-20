import { useInfiniteQuery } from "@tanstack/react-query";
import { Axios } from "../../../../../utils/axios.mjs";


const getAllVendorSummary = async({ getVendorsSuccessfn, filters, pageParam }) => {

    try {

      let body = {
        filters: JSON.parse(filters),
        nextCursor: pageParam,
        previousCursor: null,
        limit: 100 // or whatever page size you need
      }  
  
     let res = await Axios.post(`/Vendor/getvendorsummary`, body)
  
      if(res.data.success){
  
        console.log(res.data.data)
        let Vendorsarr = [...res.data.data]

          
    if(getVendorsSuccessfn){
      
        getVendorsSuccessfn(Vendorsarr)

      }
  
      return res.data
     
     }else{

        throw new Error('Failed to fetch all customer Orders summary')

      }
  
    } catch (error) {
      console.log(error)
      throw new Error('Failed to fetch all customer Orders summary')
    }
  
  }
  
  export const useGetVendorSummary = ( getVendorsSuccessfn, filters ) => {
  
    return useInfiniteQuery({ 
  
      queryKey: [`vendorSummary`, filters], 
      queryFn:({queryKey, pageParam}) => getAllVendorSummary({ getVendorsSuccessfn, filters : queryKey[1], pageParam }),
      initialPageParam:null, 
      staleTime: 1000 * 60 * 60,
      gcTime: 1000 * 60 * 10,
      getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
        console.log(lastPage, allPages, lastPageParam, allPageParams)
        return lastPage?.nextCursor || undefined
       },
       // getPreviousPageParam: (firstPage) => firstPage?.prevCursor || undefined,
       maxPages:3
  
    })

  
  };

 
  
  