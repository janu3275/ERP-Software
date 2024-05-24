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
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { setMarketSession } from "../commonfn";
import { useCommonInfoStore } from "../../strore/notificationStore";
import Marketplaces from "../assets/singlecomponents/markets/markets";
import PopoverDemo from "../assets/singlecomponents/popover/popover";
import MarketPlaceAdditionform from "../authforms/marketPlaceAdditionform";
import AvatarCollection from "../assets/singlecomponents/avatarcollection/avatarcollection";
import Navbar from "../components/globalcomponents/navbar";


const MarketPlaces = () => {
  const {setMarketInfo} = useCommonInfoStore();
  const navigate = useNavigate();

  const [chosenavatar, setchosenavatar] = useState(shopIcon);
  const [showAvatarCollection, setshowAvatarCollection] = useState(false);
  const [markets, setmarkets] = useState([]);

  const [openLoginLayout, setOpenLoginLayout] = useState(false);

  const avatararr = [
    factoryfive,
    factoryfour,
    factoryone,
    factoryseven,
    factorysix,
    factorythree,
    factorytwo,
    shopIcon,
  ];

  useEffect(()=>{
  getAllUsersMarkets()
  },[])

  const chooseAvatar = (avatar) => {
    setchosenavatar(avatar);
  };

  const closeAvatarColection = () => {
    setshowAvatarCollection(false);
  };

  const openlayout = ()=>{
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
      }
    } catch (error) {
      console.log(error);
    }
  };

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



  return (
    <>
    <Navbar />
    <div className="mainlayout">
      <div
      style={{padding:"0px 40px", fontSize:"xx-large", width:"calc(100% - 400px)"}}
      ><h1>My marketplaces !</h1></div>
      <Marketplaces marketrarr={markets} selectmarket={selectMarket} openlayout={openlayout} />

      <div className= {openLoginLayout?"formlayout opensideform":"formlayout"} 
      style={{
        right:0
      }}
      >
        <button
        className="IconButton"
        style={{
          padding:"5px",
          left:"20px"
        }}
        onClick={closelayout}
        >
           <Icon
                    icon="fa-solid:arrow-right"
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      color: "rgb(95, 0, 95)",
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
           <MarketPlaceAdditionform addNewMarketPlace={addNewMarketPlace} />
        </div>
        }
      </div>
    </div>
    </>
  );
};

export default MarketPlaces;
