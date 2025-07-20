import { Axios } from "../../utils/axios.mjs";
import { useNavigate } from "react-router-dom";
import "./marketPlaces.css";
import shopIcon from "../assets/avatar/shop.jpeg";
import factoryone from "../assets/avatar/factoryone.jpg";
import factorytwo from "../assets/avatar/factorytwo.jpg";
import factorythree from "../assets/avatar/factorythree.jpg";
import factoryfour from "../assets/avatar/factoryfour.jpg";
import factoryfive from "../assets/avatar/factoryfive.jpg";
import factorysix from "../assets/avatar/factorysix.jpg";
import factoryseven from "../assets/avatar/factoryseven.jpg";
import shopwall from "../assets/images/shop_609752.png";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { generateRandomId, setMarketSession } from "../commonfn";
import { useCommonInfoStore, useNotificationStore } from "../../strore/notificationStore";
import Marketplaces from "../assets/singlecomponents/markets/markets";
import PopoverDemo from "../assets/singlecomponents/popover/popover";
import MarketPlaceAdditionform from "../authforms/marketPlaceAdditionform";
import AvatarCollection from "../assets/singlecomponents/avatarcollection/avatarcollection";
import Navbar from "../components/globalcomponents/navbar";


const MarketPlaces = () => {
  const {setMarketInfo} = useCommonInfoStore();
  const navigate = useNavigate();
  const {addNotification} = useNotificationStore();

  const [chosenavatar, setchosenavatar] = useState(shopIcon);
  const [showAvatarCollection, setshowAvatarCollection] = useState(false);
  const [markets, setmarkets] = useState([]);
  const [chosenMarketToEdit, setChosenMarketToEdit] = useState(null);
  const [openLoginLayout, setOpenLoginLayout] = useState(false);

  const avatararr = [
    factoryfive,
    factoryfour,
    factoryone,
    factoryseven,
    factorysix,
    factorythree,
    factorytwo,
    shopIcon
  ];

  useEffect(() => {
  getAllUsersMarkets()
  },[])

  const chooseAvatar = (avatar) => {
    setchosenavatar(avatar);
  };

  const closeAvatarColection = () => {
    setshowAvatarCollection(false);
  };

  const openlayout = ()=>{
    setChosenMarketToEdit(null)
    setchosenavatar(factorytwo)
    setOpenLoginLayout(true)
  }

  const closelayout = ()=>{
    setOpenLoginLayout(false)
  }

  const addNewMarketPlace = async (info) => {
    try {
      let payload = {
        name: info.Name,
        image_src: chosenavatar
      }
      let res = await Axios.post(`/marketplace/add`, payload);
      if(res.data.success){
        getAllUsersMarkets()
        closelayout()
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateMarketPlace = async ({data, market_id}) => {
    try {
      let payload = {
        name: data.Name,
        image_src: chosenavatar,
        id: market_id
      }
      let res = await Axios.post(`/marketplace/update`, payload);
      if(res.data.success){
        addNotification({
          id: generateRandomId(5),
          type: "success",
          message: "Marketplace updated successfully!",
          displaytime: 3000,
        });
        getAllUsersMarkets()
        closelayout()
      }else{
        addNotification({
          id: generateRandomId(5),
          type: "error",
          message: "error updating marketplace!",
          displaytime: 3000,
        })
      }
    } catch (error) {
      console.log(error);
      addNotification({
        id: generateRandomId(5),
        type: "error",
        message: `error updating marketplace!, ${error}`,
        displaytime: 3000,
      })
    }
  };


  const deleteMarketPlace = async (id) => {

    addNotification({
      id: generateRandomId(5),
      type: "warning",
      message: "Marketplace deletion is restricted, please contact your tech provider!",
      displaytime: 3000,
    });

    return

    try {
      
      let res = await Axios.delete(`/marketplace/delete?market_id=${id}`);
      if(res.data.success){
        addNotification({
          id: generateRandomId(5),
          type: "success",
          message: "Marketplace deleted successfully!",
          displaytime: 3000,
        });
        getAllUsersMarkets()
      }else{
        addNotification({
          id: generateRandomId(5),
          type: "error",
          message: "error deleting marketplace!",
          displaytime: 3000,
        })
      }
    } catch (error) {
      console.log(error);
      addNotification({
        id: generateRandomId(5),
        type: "error",
        message: `error deleting marketplace!, ${error}`,
        displaytime: 3000,
      })
    }
  }

  const getAllUsersMarkets = async () => {
    try {
 
      let res = await Axios.get(`/marketplace/getall`);
   
      if (res.data.success) {
        setmarkets(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };


  const selectMarket = async(market) => {
    console.log(market);
    const { company_id, ...otherKeys } = market;
    let payload = otherKeys
    // market will be an object - {id, name , image_src}
      try {
        let res = await Axios.post(`/marketplace/select`, payload)
        if(res.data.success){
          let {token, marketplace, image_src} = res.data.data
          setMarketSession(token);
          setMarketInfo(marketplace, image_src)
          navigate('/userLogin', {replace: true});
        }else{
          console.log(res)
        }
      
      } catch (error) {
        console.log(error)
      }
        
  };

  const chooseMarketToEdit = (info) => {
    setChosenMarketToEdit(info)
    chooseAvatar(info.image_src)
    setOpenLoginLayout(true)
  }



  return (
    <>
    <Navbar />
    <div className="mainlayout" style={{background:"white"}}>
      <div
      style={{padding:"0px 40px", fontSize:"xxx-large", width:"calc(100% - 400px)", marginBottom:"20px"}}
      ><div style={{color:"#414141", display:"flex", alignItems:"center", gap:"20px"}}> 
      {/* <img src={shopwall} alt="shop image" style={{width:"200px", height:"200px"}}/> */}
      <Icon
                    icon="flat-color-icons:shop"
                    style={{
                      width: "5rem",
                      height: "5rem",
                      color: "rgb(0 149 79)",
                      cursor:"pointer",
                      // margin:"30px",
                      

                      
                    }}
                    />
       My marketplaces !</div>
      {/* <button
        className='tertiarybtn'
        onClick={openlayout}
        
       >

       
        <Icon
                    icon="gala:add"
                    style={{
                      width: "1rem",
                      height: "1rem",
                      color: "rgb(0 149 79)",
                      cursor:"pointer",
                      // margin:"30px",
                      

                      
                    }}
                    />
        

       
        <div style={{padding:"10px", fontWeight:"500", color:"#414141", fontSize:"15px"}}>Add marketplace</div>
        </button> */}
      </div>
      <Marketplaces marketrarr={markets} selectmarket={selectMarket} openlayout={openlayout} chooseMarketToEdit={chooseMarketToEdit}  deleteMarketPlace={deleteMarketPlace} />

      <div className= {openLoginLayout?"formlayout opensideform":"formlayout"} 
      style={{
        right:0
      }}
      >
        <button
        className="iconbtn1"
        style={{
          padding:"5px",
          left:"20px",
          top:"60px"
        }}
        onClick={closelayout}
        >
           <Icon
                    icon="fa-solid:arrow-right"
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      color: "black",
                      cursor:"pointer"
                    }}
                  />
        </button>
        {openLoginLayout &&
         <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="avatar">
            <PopoverDemo
              Open={showAvatarCollection}
              setOpen={setshowAvatarCollection}
              contentclass=""
              btnclass="avatarshadow"
              side="left"
              icon={
                <button className={"PopIconButton " + "avatarshadow"} aria-label="Update dimensions">
                <Icon
                  icon="uil:edit"
                  style={{
                    width: "3rem",
                    height: "3rem",
                    color: "black",
                    cursor: "pointer",
                  }}
                />
                </button>
              }
            >
              <AvatarCollection
                chooseAvatar={chooseAvatar}
                avatararr={avatararr}
                closeAvatarColection={closeAvatarColection}
                chosenavatar={chosenavatar}
              />
            </PopoverDemo>

            <img src={chosenavatar} alt="shop" />
          </div>
           <MarketPlaceAdditionform addNewMarketPlace={addNewMarketPlace} selectedMarket={chosenMarketToEdit} updateMarketPlace={updateMarketPlace}/>
        </div>
        }
      </div>
    </div>
    </>
  );
};

export default MarketPlaces;
