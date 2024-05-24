import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import { toCamelCase } from "../../../../commonfn";
import Stextfield from "../../../../assets/singlecomponents/singletextfield/stextfield";
import PanelButton from "../../../../assets/singlecomponents/panelButton/panelbutton";
import { useGetPanelCustomers } from "../customerQueryHooks";
import { returnStringifiedFilter } from "../customerFilterFunctions";
import debounce from 'lodash.debounce';


const CustomerPanel = ({ selectCustomer, selectSummaryTab, selectedTab , selectCatalogTab}) => {


    const [searchvalue, setsearchValue] = useState('');
    const customerPanelRef = useRef(null)

    const { data , fetchNextPage, hasNextPage, isFetchingNextPage, fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage, error: getCustomererr, isLoading: getCustomerIsLoading } = useGetPanelCustomers(null, returnStringifiedFilter(null));
    console.log(data)
    const Customers = (data?.pages ?? []).flatMap(page => page?.data ?? []);

          // Infinite scroll event handler for loading next page
  const loadNextPage = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Infinite scroll event handler for loading previous page
  // const loadPreviousPage = () => {
  //   if (hasPreviousPage && !isFetchingPreviousPage) {  
  //     fetchPreviousPage();
  //   }
  // };


   // Attach scroll event for loading next or previous page on list scroll
   useEffect(() => {
  
    const onScroll = debounce(() => {
      const list = customerPanelRef.current;
      if (list) {
        const { scrollTop, clientHeight, scrollHeight } = list;
        console.log(scrollTop, clientHeight, scrollHeight, hasNextPage,!isFetchingNextPage, hasPreviousPage, !isFetchingPreviousPage) 
        // if (scrollTop === 0 && hasPreviousPage && !isFetchingPreviousPage) {
        //   loadPreviousPage();
        // } else 
        if (scrollTop + clientHeight + 20 >= scrollHeight && hasNextPage && !isFetchingNextPage) {
          loadNextPage();
        }
      }
    }, 200);

    const list = customerPanelRef.current;

    if (list) {
      list.addEventListener('scroll', onScroll);
      return () => list.removeEventListener('scroll', onScroll);
    }

  }, [hasNextPage, hasPreviousPage, isFetchingNextPage, isFetchingPreviousPage]);

 

      const returnfilterCustomers = (customers, searchvalue) => {
        console.log(customers, searchvalue)
         if(!customers){
          return []
         }
         if(!searchvalue){
          return customers
         }
        
          const filterCustomers =  customers.filter((emp)=>emp.name.toLowerCase().includes(searchvalue.toLowerCase()))
          if(!filterCustomers){
            return []
          }
          return filterCustomers
        
      }

      const setFilterValue = (e, name, index)=> {
        let val = e.target.value
        setsearchValue(val)
      }

     

  console.log(data)
  
    return (
       
      <div className="OuterComp">

      
        <div className="Comp">
        <div className="sidebartopdiv" >
       
        <PanelButton selected={selectedTab.summary} name="Summary"  funct={selectSummaryTab}/>
   
         <PanelButton selected={selectedTab.catalog} name="Catalog"  funct={selectCatalogTab}/>
    
         
         </div>
         <div className="sidebarmiddiv" ref={customerPanelRef} >
        <div style={{width:"100%", position:"sticky", top:"0", backgroundColor:"white", zIndex:"1", paddingTop:"10px", marginLeft:"-15px", paddingLeft:"15px"}}>
         <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:"20px", width:"-webkit-fill-available", color:"#9f9f9f", fontSize:"14px", padding:"10px 0px", paddingTop:"0"}}>
        <div>All customers</div> 
        </div> 
        <div style={{width:"-webkit-fill-available", marginBottom:"10px" }}>
        <Stextfield
          name='Customer'
          label=""
          value={searchvalue}
          type="text"
          labelclassname=""
          textfieldclassname="primarytextfieldclass"
          divclassname="primarytextdivclass"
          placeholder="search Customer .."
          onChange={setFilterValue}
          index={-1}
          disabled={false}
          error={undefined}
        />
        </div> 
        </div>
        {returnfilterCustomers(Customers, searchvalue).length>0 && returnfilterCustomers(Customers, searchvalue).map((Customer, index)=>
        <PanelButton key={index} selected={selectedTab.CustomerId==Customer.id} name={toCamelCase(Customer.name)}  funct={selectCustomer} functprop={Customer.id} />
        )}
   
        </div>
        </div>
       </div>
     
  )
}

CustomerPanel.propTypes = {

    selectSummaryTab: PropTypes.func.isRequired,
    selectCustomer: PropTypes.func.isRequired,
    selectedTab: PropTypes.object.isRequired,
    selectCatalogTab: PropTypes.func.isRequired
    

  };


export default CustomerPanel;