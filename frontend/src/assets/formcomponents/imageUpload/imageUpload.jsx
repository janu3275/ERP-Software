import PropTypes from 'prop-types';
import './imageUpload.css';
import { forwardRef } from 'react';
import { returnBase64OrBinaryfromfile, returnCompressedImages } from '../../../commonfn';
import ImageDiv from '../../singlecomponents/imagecomponent/imagecomponent';


const ImageUpload = forwardRef(({  name , value, onChange,  errors, ...rest}, forwardedRef) => {

    console.log(errors)

    

    const uploadImages = async (files) => {

        let filearr = Array.from(files)
        filearr = await returnCompressedImages(filearr)
        console.log(filearr)
        let imgArr = await returnBase64OrBinaryfromfile(filearr, 'base64')
        // let imgBinaryArr = await returnBase64OrBinaryfromfile(filearr, 'binary') // not needed yet
        console.log(imgArr, filearr[0], filearr)
        
        let imageArr = imgArr.map((image) => {
          return { uploadProgress: "100%", ...image }
        })
    
        const images = [...value, ...imageArr]
    
        onChange(images)
    
    
      }
    
      
    
      const deleteImage = async(sizeArrIndx, imageIndex) => {
        
        const images = value.filter((image, index)=>index!==imageIndex)
        onChange(images)
      
      }


  return (  
 
  
    <div style={{display:"flex", flexDirection:"column", gap:"5px"}}>
    {/* <input placeholder={placeholder} min={0}  className={textfieldclassname + " Input"} type={type} id={name} {...register(name, { required: true })}   /> */}
    <input
                  name={name}
                  style={{display:"none"}}
                  type="file"
                  id="imageupload"
                  onChange={(e)=>uploadImages(e.target.files)}
                  accept="image/*"
                  multiple
                  ref={forwardedRef}
                  {...rest}
                  
                />
                {value.length > 0 && (
                <ImageDiv uploadedImages={value} deleteImage={deleteImage}  />
              )}
    <div style={{height:"1rem"}}>{errors[name] && <div style={{fontSize:"0.8rem", color:"red"}}>{errors[name].message}</div>}</div>
    </div>
  
  )

                });
                
ImageUpload.displayName = 'ImageUpload';

ImageUpload.propTypes = {
    name: PropTypes.string.isRequired,
    errors:PropTypes.object.isRequired,
    value: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired
}

export default ImageUpload;