import PropTypes from 'prop-types';
import './profileimageUpload.css';
import { forwardRef } from 'react';
import { returnBase64OrBinaryfromfile, returnCompressedImages } from '../../../commonfn';
import ProfileImage from '../../singlecomponents/profileimage/profileImage';


const ProfileImageUpload = forwardRef(({  name , value, onChange,  errors, ...rest}, forwardedRef) => {

    console.log(errors, value)

    

    const uploadImage = async (files) => {

        let filearr = Array.from(files)
        filearr = await returnCompressedImages(filearr)
        console.log(filearr)
        let imgArr = await returnBase64OrBinaryfromfile(filearr, 'base64')
        // let imgBinaryArr = await returnBase64OrBinaryfromfile(filearr, 'binary') // not needed yet
        console.log(imgArr, filearr[0], filearr)
        
        let imageArr = imgArr.map((image) => {
          return { uploadProgress: "100%", ...image }
        })
    
        const images = [...imageArr]
    
        onChange(images[0])
    
    
      }
    
      
    
    


  return (  
 
  
    <div style={{display:"flex", flexDirection:"column", gap:"5px"}}>
    {/* <input placeholder={placeholder} min={0}  className={textfieldclassname + " Input"} type={type} id={name} {...register(name, { required: true })}   /> */}
    <input
                  name={name}
                  style={{display:"none"}}
                  type="file"
                  id="profileupload"
                  onChange={(e)=>uploadImage(e.target.files)}
                  accept="image/*"
                  ref={forwardedRef}
                  {...rest}
                  
                />
               
                <ProfileImage uploadedImage={value}   />
           
    <div style={{height:"1rem"}}>{errors[name] && <div style={{fontSize:"0.8rem", color:"red"}}>{errors[name].message}</div>}</div>
    </div>
  
  )

                });
                
ProfileImageUpload.displayName = 'ProfileImageUpload';

ProfileImageUpload.propTypes = {
    name: PropTypes.string.isRequired,
    errors:PropTypes.object.isRequired,
    value: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired
}

export default ProfileImageUpload;