
import PropTypes from 'prop-types';
import { Icon } from "@iconify/react";
import "../imagecomponent/imagecomponent.css";
import { returnUrlfromBase64 } from '../../../commonfn';
import ViewImages from '../viewimages/viewimages';
import "./stackedimages.css";
import { useState } from 'react';
import DialogDemo from '../dialog/dialog';

const StackedImages = ({ images, imageSize }) => {
    const [openViewPage, setOpenViewPage] = useState(false)
  
  const overlap = 5; // Adjust the overlap distance here

  const closeDialog = () => {
    console.log("close")
    setOpenViewPage(false)
    
  }

  console.log(openViewPage)

  return (
    <>
    {images.length>0?<div style={{ position: 'relative', height: `${imageSize}px`, cursor:"pointer" }} onClick={(e)=>{
      e.stopPropagation()
      setOpenViewPage(true)
      }} >
      {images.map((image, index) => index < 2 && (
        <img
          key={index}
          src={image.imageSrc}
          alt={`Image ${index + 1}`}
          style={{
            position: 'absolute',
            top: `-${index * overlap * 0.5}px`,
            left: `${index * overlap * 0.5}px`,
            width: `${imageSize}px`,
            height: `${imageSize}px`,
            zIndex: index,
          }}
        />
      ))}
               
    
    </div>:<div>No attachments</div>}
    <DialogDemo
                  Open={openViewPage}
                  setOpen={setOpenViewPage}
                  buttontext=""
                  contentclass='imagesDialogClass'
                  btnclass = 'primarybtndiv'
                >
                  {(props) => (
                   openViewPage ? <ViewImages  images={images} closeDialog={closeDialog} />: <></> 
                  )}

   </DialogDemo> 
    </>
  );
};



StackedImages.propTypes = { 
    images: PropTypes.array,
    imageSize: PropTypes.any
   
};


export default StackedImages;