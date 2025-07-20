
import PropTypes from 'prop-types';
import "./markets.css";
import { Icon } from '@iconify/react';
import { useState } from 'react';
import PopoverDemo from '../popover/popover';



const Marketplaces = ({ marketrarr, selectmarket, openlayout, chooseMarketToEdit, deleteMarketPlace }) => {

  const [openActionpop, setOpenActionpop] = useState(false)

  const closeActionpop = ()=>{
    setOpenActionpop(false)
  }
  
console.log(marketrarr)

  return (

    <div className='market-container'>

       <button
        className='singlemarketplace Button'
        onClick={openlayout}
       >

        <div 
         style={{
          height:"100px",
          width:"100px"
        }}
        className='avatar' >
        <Icon
                    icon="gala:add"
                    style={{
                      width: "6rem",
                      height: "6rem",
                      color: "rgb(8 191 22)",
                      cursor:"pointer",
                      // margin:"30px",
                      

                      
                    }}
                    />
        

        </div>
        <div style={{ fontWeight:"500", color:"#414141", paddingBottom:"10px"}}>Add marketplace</div>
        </button>

     { marketrarr.map((market, index) =>

        <button
        className='singlemarketplace'
        
        key={index}>
        {/* <div style={{display:"flex", flexDirection:"column", position:"absolute", top:"15px", right:"2px", justifyContent:"center", alignItems:"center"}}>
          <div onClick={()=>chooseMarketToEdit(market)} className='marketicons'>
          <Icon
            icon="mage:edit"
            style={{
              width: "1rem",
              height: "1rem",
              color: "rgb(0 45 85)",
              cursor:"pointer"
              
              }}
                    />
          </div>
          <div  onClick={()=> deleteMarketPlace(market.id)} className='marketicons'>
          <Icon
            icon="mingcute:delete-fill"
            style={{
              width: "1.2rem",
              height: "1.2rem",
              color: "red",
              cursor:"pointer"
             
              }}
                    />
          </div>
        </div> */}

        <PopoverDemo
          Open={openActionpop}
          setOpen={setOpenActionpop}
          contentclass="dot-pop-content"
          btnclass=""
          side="bottom"
          icon={
            // <button className={"primarybtn"} aria-label="Update dimensions"  style={{paddingBottom:0}}>
            <button className='dotsbtn' style={{padding:"2px 2px", position:"absolute", top:"15px", right:"10px"}}>
            <Icon
              icon="pepicons-pop:dots-y"
              style={{
                width: "1.3rem",
                height: "1.3rem",
                color: "#7b7978b0",
                cursor: "pointer"
              }}
            />
           
            </button>
           
          }
        >
         
          {/* <Actions functs={functs} closeActionpop={closeActionpop} row={row} /> */}
          <div className="action-container">
        <button key={index} style={{width:"-webkit-fill-available", color:"rgb(82 78 70)", fontWeight:"400"}} className="primarybtndiv" onClick={()=>{
            chooseMarketToEdit(market)
            closeActionpop()
            }}>  <Icon
            icon="mage:edit"
            style={{
              width: "1rem",
              height: "1rem",
              color: "rgb(82 78 70)",
              cursor:"pointer"
              
              }}
                    /> Edit</button>
          <button key={index} style={{width:"-webkit-fill-available", color:"red", fontWeight:"400"}} className="primarybtndiv" onClick={()=>{
            deleteMarketPlace(market.id)
            closeActionpop()
            }}> <Icon
            icon="mingcute:delete-fill"
            style={{
              width: "1.2rem",
              height: "1.2rem",
              color: "red",
              cursor:"pointer"
             
              }}
                    /> Delete</button>
     </div>
         
        </PopoverDemo>

        <div 
        style={{
          height:"120px",
          width:"120px"
        }}

         className='avatar' 
         onClick={() => selectmarket(market)}  >

         <img
         src={market.image_src}
         alt='market'
        
         />

        </div>
        <div style={{  fontWeight:"500", color:"#414141", paddingBottom:"10px"}} className='truncate'><div style={{margin:"auto", width:"fit-content"}}>{market.name}</div></div>
        </button>
        
        )}
       
        <div>
      

        </div>
   
      </div>
    )

}



Marketplaces.propTypes = {

    marketrarr: PropTypes.array,
    selectmarket: PropTypes.func,
    openlayout: PropTypes.func,
    chooseMarketToEdit: PropTypes.func.isRequired, 
    deleteMarketPlace : PropTypes.func.isRequired
    
};


export default Marketplaces;