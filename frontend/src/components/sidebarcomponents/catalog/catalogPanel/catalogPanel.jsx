import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import AccordionDemo from "../../../../assets/singlecomponents/accordion/accordion";



const CatalogPanel = ({  selectTab, selectedTab }) => {



    const returnHeading = (tab) => {
        console.log(tab)
        if(tab==='customers'){
          return "Customers"
        }else if(tab==='departments'){
          return "Departments"
        }else if(tab==='positions'){
          return "Positions"
        }else if(tab==='expenseServices'){
          return "Services being used"
        }else if(tab==='glassColor'){
          return "Color"
        }else if(tab==='glassCompany'){
          return "Company"
        }else if(tab==='glassSize'){
          return "Size"
        }else if(tab==='glassThickness'){
          return "Thickness"
        }else if(tab==='glassTypes'){
          return "Types"
        }else if(tab==='glassCustomisation'){
          return "Glass customisation"
        }else if(tab==='glassDilevery'){
          return "Dilevery"
        }else if(tab==='glassFitting'){
          return "Fitting"
        }else if(tab==='glassMeasurement'){
          return "Measurement"
        }else if(tab==='glassAccessory'){
          return "Glass accessory"
        }else if(tab==='glassInventory'){
          return "Glass inventory"
        }else if(tab==='glassProducts'){
          return "Glass products"
        }else if(tab==='otherProducts'){
          return "Other products"
        }else if(tab==='units'){
          return "Units"
        }else if(tab==='emiTypes'){
            return "Emi types"
          }
      }

      const Products = [ 'glassAccessory', 'glassInventory', 'glassProducts', 'otherProducts' ]
      const services = [ 'glassCustomisation', 'glassDilevery', 'glassFitting', 'glassMeasurement' ]
      const glassProperties = ['glassColor', 'glassCompany', 'glassSize', 'glassThickness', 'glassTypes']
      const expensetypes = ['expenseServices', 'emiTypes']
      const employeeItems = ['departments', 'positions' ]
      const restItems = ['units']

      const productItems = [
        {
            trigger: "Products",
            content: <>{Products.map((tab, index)=> <button key={index} className={selectedTab[tab]?"sidebarButton select":"sidebarButton"}  onClick={()=>selectTab(tab)}> 
            <div style={{paddingLeft:"20px"}} className="singlepanel">
                <div className="PanelName">{returnHeading(tab)}</div>
                <div>  
                    {selectedTab[tab] && <Icon
                icon="iconamoon:arrow-right-2-bold"
                style={{
                  width: "1.2rem",
                  height: "1.2rem",
                  color: "#515151",
                  cursor: "pointer",
                }}
                />}
                </div>
            </div>  
        </button>)}</>
        }
      ]
      const serviceItems = [
        {
            trigger: "Services offered",
            content: <>{services.map((tab, index)=> <button key={index} className={selectedTab[tab]?"sidebarButton select":"sidebarButton"}  onClick={()=>selectTab(tab)}> 
            <div style={{paddingLeft:"20px"}} className="singlepanel">
                <div className="PanelName">{returnHeading(tab)}</div>
                <div>  
                    {selectedTab[tab] && <Icon
                icon="iconamoon:arrow-right-2-bold"
                style={{
                  width: "1.2rem",
                  height: "1.2rem",
                  color: "#515151",
                  cursor: "pointer",
                }}
                />}
                </div>
            </div>  
        </button>)}</>
        }
      ]

      const glassPropertiesItems = [
        {
            trigger: "Glass properties",
            content: <>{glassProperties.map((tab, index)=> <button key={index} className={selectedTab[tab]?"sidebarButton select":"sidebarButton"}  onClick={()=>selectTab(tab)}> 
            <div style={{paddingLeft:"20px"}} className="singlepanel">
                <div className="PanelName">{returnHeading(tab)}</div>
                <div>  
                    {selectedTab[tab] && <Icon
                icon="iconamoon:arrow-right-2-bold"
                style={{
                  width: "1.2rem",
                  height: "1.2rem",
                  color: "#515151",
                  cursor: "pointer",
                }}
                />}
                </div>
            </div>  
        </button>)}</>
        }
      ]

      const expenseItems = [
        {
            trigger: "Expense types",
            content: <>{expensetypes.map((tab, index)=> <button key={index} className={selectedTab[tab]?"sidebarButton select":"sidebarButton"}  onClick={()=>selectTab(tab)}> 
            <div style={{paddingLeft:"20px"}} className="singlepanel">
                <div className="PanelName">{returnHeading(tab)}</div>
                <div>  
                    {selectedTab[tab] && <Icon
                icon="iconamoon:arrow-right-2-bold"
                style={{
                  width: "1.2rem",
                  height: "1.2rem",
                  color: "#515151",
                  cursor: "pointer",
                }}
                />}
                </div>
            </div>  
        </button>)}</>
        }
      ]


      const employItems = [
        {
            trigger: "Employee properties",
            content: <>{employeeItems.map((tab, index)=> <button key={index} className={selectedTab[tab]?"sidebarButton select":"sidebarButton"}  onClick={()=>selectTab(tab)}> 
            <div style={{paddingLeft:"20px"}} className="singlepanel">
                <div className="PanelName">{returnHeading(tab)}</div>
                <div>  
                    {selectedTab[tab] && <Icon
                icon="iconamoon:arrow-right-2-bold"
                style={{
                  width: "1.2rem",
                  height: "1.2rem",
                  color: "#515151",
                  cursor: "pointer",
                }}
                />}
                </div>
            </div>  
        </button>)}</>
        }
      ]


     

  
    return (
       
      <div className="OuterComp">
      <div className="Comp">
      <div className="sidebartopdiv">
     

     <AccordionDemo items={productItems}/>
     <AccordionDemo items={serviceItems}/>
     <AccordionDemo items={glassPropertiesItems}/>
     <AccordionDemo items={expenseItems}/>
     <AccordionDemo items={employItems}/>

     {restItems.map((tab, index)=> <button key={index} className={selectedTab[tab]?"sidebarButton select":"sidebarButton"}  onClick={()=>selectTab(tab)}> 
            <div  className="singlepanel">
                <div className="PanelName">{returnHeading(tab)}</div>
                <div>  
                    {selectedTab[tab] && <Icon
                icon="iconamoon:arrow-right-2-bold"
                style={{
                  width: "1.2rem",
                  height: "1.2rem",
                  color: "#515151",
                  cursor: "pointer",
                }}
                />}
                </div>
            </div>  
        </button>)}
       
       
        </div>
      
        </div>
      </div>
     

        
     
    )
}

CatalogPanel.propTypes = {

    selectTab: PropTypes.func.isRequired,
    selectedTab: PropTypes.object.isRequired
   
  
  };


export default CatalogPanel;