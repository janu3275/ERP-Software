
import PropTypes from 'prop-types';
import "./markets.css";
import { Icon } from '@iconify/react';



const Marketplaces = ({ marketrarr, selectmarket , openlayout}) => {

  

  return (

    <div className='market-container'>

          

     { marketrarr.map((market, index) =>

        <button
        className='singlemarketplace'
        
        key={index}>

        <div 
        style={{
          height:"150px",
          width:"150px"
        }}

         className='avatar' 
         onClick={() => selectmarket(market)}  >

         <img
         src={market.image_src}
         alt='market'
        
         />

        </div>
        <h4>{market.name}</h4>
        </button>
        
        )}
         <button
        className='singlemarketplace Button'
        onClick={openlayout}
       >

        <div 
         style={{
          height:"150px",
          width:"150px"
        }}
        className='avatar' onClick={() => selectmarket()} >
        <Icon
                    icon="gala:add"
                    style={{
                      width: "6rem",
                      height: "6rem",
                      color: "#5f005f",
                      cursor:"pointer",
                      margin:"30px"
                      
                    }}
                    />
        

        </div>
        <h4>Add new marketplace</h4>
        </button>
        <div>
      

        </div>
   
      </div>
    )

}



Marketplaces.propTypes = {

    marketrarr: PropTypes.array,
    selectmarket: PropTypes.func,
    openlayout: PropTypes.func
    
};


export default Marketplaces;