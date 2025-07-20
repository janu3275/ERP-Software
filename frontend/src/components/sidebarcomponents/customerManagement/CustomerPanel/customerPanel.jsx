import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import { toCamelCase } from "../../../../commonfn";
import Stextfield from "../../../../assets/singlecomponents/singletextfield/stextfield";
import PanelButton from "../../../../assets/singlecomponents/panelButton/panelbutton";
import { useGetPanelCustomers } from "../customerQueryHooks";
import debounce from 'lodash.debounce';
import { usePanelFilterStore } from "../../../../../strore/notificationStore";


const CustomerPanel = ({ selectCustomer, selectSummaryTab, selectedTab , selectCatalogTab}) => {


    const [searchvalue, setsearchValue] = useState('');
    const setPanelFilterData = usePanelFilterStore(state=>state.setPanelFilterData);
    const storePanelFilterData = usePanelFilterStore(state => state['Customer-panel']);
    const customerPanelRef = useRef(null)


    const returnStringfilter = (filter) => { 
      return filter?JSON.stringify(filter):JSON.stringify({
       name: null,
       mobile_number: null,
       whatsapp_number: null,
       email_address: null,
       address: null,
       gstin: null,
       pan: null,
       adhaar_number: null,
       note: null
     })
   }

    const { data , fetchNextPage, hasNextPage, isFetchingNextPage, fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage, error: getCustomererr, isLoading: getCustomerIsLoading } = useGetPanelCustomers(null, returnStringfilter(storePanelFilterData));
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

 

  

      const setFilterValue = (e, name, index) => {
        let val = e.target.value

        const filter = {
          name: val,
          mobile_number: null,
          whatsapp_number: null,
          email_address: null,
          address: null,
          gstin: null,
          pan: null,
          adhaar_number: null,
          note: null
        }

        debouncedSetPanelFilterData(filter)
        // setPanelFilterData('Customer-panel', filter)
        setsearchValue(val)
       

      }

      const debouncedSetPanelFilterData = useMemo(
        () => debounce((filter) => {
          setPanelFilterData('Customer-panel', filter);
        }, 500),
        []
      );
      

    



     

  console.log(data)
  
    return (
       
      <div className="OuterComp">

      
        <div className="Comp">
        <div className="sidebartopdiv" >

        <PanelButton selected={selectedTab.summary} name="Customer account"  funct={selectSummaryTab}
        icon={<Icon
          icon="carbon:account"
          style={{
            width: "1.3rem",
            height: "1.3rem",
            color: "rgb(60, 137, 255)",
            cursor:"pointer"
            
            }}
        />}
        />
        <PanelButton selected={selectedTab.catalog} name="Customers"  funct={selectCatalogTab} 
        icon={<Icon
          icon="bi:people"
          style={{
            width: "1.3rem",
            height: "1.3rem",
            color: "rgb(30, 171, 7)",
            cursor:"pointer"
            
            }}
        />}
        />
       
       
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
        {Customers.length>0 && Customers.map((Customer, index)=>
        <PanelButton key={index} selected={selectedTab.CustomerId==Customer.id} name={(Customer.name)}  funct={selectCustomer} functprop={Customer.id} 
        icon={<Icon
          icon="ic:sharp-account-circle"
          style={{
            width: "2rem",
            height: "2rem",
            color: "rgb(170 170 170)",
            cursor:"pointer"
            
            }}
        />}
        left="-48px"
        color="rgb(228, 123, 78)"
        />
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