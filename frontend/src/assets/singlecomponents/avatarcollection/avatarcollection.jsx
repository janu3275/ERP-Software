
import PropTypes from 'prop-types';
import "./avatarcollection.css";
import { Cross2Icon } from '@radix-ui/react-icons';
import { Icon } from '@iconify/react';


const AvatarCollection = ({ avatararr, chooseAvatar , closeAvatarColection, chosenavatar}) => {

  

  return (
  
     
    <div className='avatar-container'>
    <div style={{position:"absolute", marginLeft:"10px",top:"0", color:"#000000a1"}}><h2>Pick an avatar</h2></div>
          <button className="IconButton" aria-label="Close" onClick={closeAvatarColection} >
          <Cross2Icon />
          </button>
      
        {avatararr.map((avatar,index)=>
        <div
        style={{position:"relative"}} 
        key={index}>
        <div className={ chosenavatar===avatar ? 'avatar selected':'avatar' }
         style={{
          width:"80px",
          height:"80px",
          margin:"10px 10px",
         
          boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
          
         }} 
         onClick={()=>chooseAvatar(avatar)}
          
         >

         <img
         src={avatar}
         alt='avatar'
         
         />
           {chosenavatar!==avatar && <div className='shadow'></div> }
        </div>
       
        {chosenavatar===avatar  && <Icon
                    icon="mdi:tick-circle"
                    style={{
                      width: "2rem",
                      height: "2rem",
                      color: "#5f005f",
                      cursor:"pointer",
                      position:"absolute",
                      top:0,
                      right:0,
                      marginTop:"10px",
                      marginRight:"5px",
                      background:"white",
                      borderRadius:"50%"
                    }}
                  />}



        </div>
        )}

        <div>
    

        </div>
   
      </div>
    
    )

}



AvatarCollection.propTypes = {

    avatararr: PropTypes.array,
    chooseAvatar: PropTypes.func,
    closeAvatarColection: PropTypes.func,
    chosenavatar: PropTypes.any
};


export default AvatarCollection;