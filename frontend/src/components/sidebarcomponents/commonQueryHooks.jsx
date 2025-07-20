import { useQuery } from "@tanstack/react-query";
import { Axios } from "../../../utils/axios.mjs";

// ******************************************************************** GET ALL Positions HOOK *********************************************************************//
const returnAllPositions = async(getPositionsSuccessfn) => {
    try {
  
      let res = await Axios.get(`/position/getall`)
  
      if(res.data.success){
      console.log(res.data.data);
      const Positionsarr = [...res.data.data];
      console.log("🚀 ~ returnAllPositions ~ Positionsarr:", Positionsarr)
      console.log("🚀 ~ returnAllPositions ~ getPositionsSuccessfn:", getPositionsSuccessfn)
      if(getPositionsSuccessfn){
        
        getPositionsSuccessfn(Positionsarr)
      }
    
      return Positionsarr
  
      }else{
  
        throw new Error('Failed to fetch Positionss')
        
      }
  
    } catch (error) {
      console.log(error)
      throw new Error('Failed to fetch Positionss', error)
    }
   }
  
   export const useGetPositions = (getPositionsSuccessfn) => {
  
    return useQuery({ 
      queryKey: ['Positions'], 
      queryFn:()=>returnAllPositions(getPositionsSuccessfn),
      staleTime: 1000 * 60 * 60,
      gcTime: 1000 * 60 * 10
  
    })
  
  };

  // ******************************************************************** GET ALL Positions HOOK *********************************************************************//
const returnAllDepartments = async(getDepartmentsSuccessfn) => {

    try {
  
      let res = await Axios.get(`/department/getall`)
  
      if(res.data.success){
      console.log(res.data.data);
      const Departmentsarr = [...res.data.data];
      console.log("🚀 ~ returnAllPositions ~ Departmentsarr:", Departmentsarr)
      console.log("🚀 ~ returnAllDepartments ~ getDepartmentsSuccessfn:", getDepartmentsSuccessfn)
      if(getDepartmentsSuccessfn){
        
        getDepartmentsSuccessfn(Departmentsarr)
      }
    
      return Departmentsarr
  
      }else{
  
        throw new Error('Failed to fetch Departments')
        
      }
  
    } catch (error) {
      console.log(error)
      throw new Error('Failed to fetch Departments', error)
    }

   }
  
   export const useGetDepartments = (getDepartmentsSuccessfn) => {
  
    return useQuery({ 
      queryKey: ['Departments'], 
      queryFn:()=>returnAllDepartments(getDepartmentsSuccessfn),
      staleTime: 1000 * 60 * 60,
      gcTime: 1000 * 60 * 10
  
    })
  
  };
