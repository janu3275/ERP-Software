import "./orderinput.css";
import Stextfield from "../../../../../assets/singlecomponents/singletextfield/stextfield.jsx";
import SelectDemo from "../../../../../assets/singlecomponents/select/select.jsx";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { generateRandomId, returnBase64OrBinaryfromfile, returnOtherEle, returnValue, returnid } from "../../../../../commonfn.jsx";
import { Axios } from "../../../../../../utils/axios.mjs";
import * as yup from "yup";
import ImageDiv from "../../../../../assets/singlecomponents/imagecomponent/imagecomponent.jsx";
import CheckboxDemo from "../../../../../assets/singlecomponents/checkbox/checkbox.jsx";

const Orderinput = ({ selectedobj, additem, updateitem }) => {
  //   const schema = yup.object().shape({
  //     firstName: yup.string().required(),
  //     lastName: yup.string().required(),
  //     singleselect: yup.string().required(),
  //   });
  const sizearrIndexRef = useRef(null);
  const [currentinput, setcurrentinput] = useState({
    id: "",
    product_id: null,

    servicearr: [],

    sizearr: [
      {
        length: 0,

        width: 0,

        area: 0,

        quantity: 0,

        charge: "",

        total: 0,

        images: [],
      },
    ],
    accessoryarr: [],
  });

  const [validationerr, setvalidationerr] = useState(null);

  const [productinfo, setproductinfo] = useState([]);

  const [servicesinfo, setserviceinfo] = useState([]);

  const [accessoryinfo, setAccessoryinfo] = useState([]);

  const [allProducts, setallProducts] = useState([]);

  const [allServices, setallServices] = useState([]);

  const [allAccessories, setallAccessories] = useState([]);

  const getAllProducts = async () => {
    try {
      let res = await Axios.get(
        `/glassProduct/getall`
      );
      if (res.data.success) {
        setproductinfo(res.data.data);
        let arr = [...res.data.data];
        let newarr = arr.map((item) => {
          return {
            label: returnOtherEle(`${item['thickness']}mm ${item['color']} ${item['glass_type']} ${item['glass_company']} - glass`),
            value: `${item['thickness']}mm ${item['color']} ${item['glass_type']} ${item['glass_company']} - glass`,
            id: item.id
          };
        });

        const items = [
          {
            label: "Products",
            items: newarr
          },
        ];
        setallProducts(items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllServices = async () => {
    try {
      let res = await Axios.get(
        `/glassCustomization/getall`
      );
      if (res.data.success) {
        setserviceinfo(res.data.data);
        let arr = [...res.data.data];
        let newarr = arr.map((item) => {
          return {
            label: item.service_name,
            value: item.service_name,
            id: item.id
          };
        });

        const items = [
          {
            label: "Services",
            items: newarr,
          },
        ];
        setallServices(items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllAccessories = async () => {
    try {
      let res = await Axios.get(
        `/glassAccessory/getall`
      );
      if (res.data.success) {
        setAccessoryinfo(res.data.data);
        let arr = [...res.data.data];
        let newarr = arr.map((item) => {
          return {
            label: returnOtherEle(item.name),
            value: item.name,
            id: item.id
          };
        });

        const items = [
          {
            label: "Accessories",
            items: newarr,
          },
        ];

        setallAccessories(items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addsize = () => {
    let sizeobj = {
      length: 0,
      width: 0,
      area: 0,
      quantity: 0,
      total: 0,
      images: []

    };

    setcurrentinput((prev) => {
      return {
        ...prev,
        sizearr: [...prev.sizearr, sizeobj],
      };
    });
  };

  const deletesize = (sizeindex) => {
    setcurrentinput((prev) => {
      return {
        ...prev,
        sizearr: prev.sizearr.filter((size, index) => index !== sizeindex),
      };
    });
  };

  const addaccessory = () => {
    let accessoryobj = {
      accessory_id: null,

      quantity: 0,

      total: 0,
    };

    setcurrentinput((prev) => {
      return {
        ...prev,
        accessoryarr: [...prev.accessoryarr, accessoryobj],
      };
    });
  };

  const deleteaccessory = (accessoryindex) => {
    setcurrentinput((prev) => {
      return {
        ...prev,
        accessoryarr: prev.accessoryarr.filter(
          (acc, index) => index !== accessoryindex
        ),
      };
    });
  };

  const ValidateAllFields = (state) => {
    const schema = yup.object().shape({
      id: yup.string(),
      product_id: yup.number().required("Please choose a product"),
      servicearr: yup.array(),
      sizearr: yup.array().of(
        yup.object().shape({
          length: yup
          .number()
          .typeError('Must be a number')
          .required('Required field')
          .min(1, 'Must be greater than 0'),
        width: yup
          .number()
          .typeError('Must be a number')
          .required('Required field')
          .min(1, 'Must be greater than 0'),
        area: yup
          .number()
          .typeError('Must be a number')
          .required('Required field')
          .min(1, 'Must be greater than 0'),
        quantity: yup
          .number()
          .typeError('Must be a number')
          .required('Required field')
          .min(1, 'Must be greater than 0'),
        charge: yup
          .number()
          .typeError('Must be a number')
          .required('Required field')
          .min(1, 'Must be greater than 0'),
        total: yup
          .number()
          .typeError('Must be a number')
          .required('Required field')
          .min(1, 'Must be greater than 0'),
        })
      ),
      accessoryarr: yup.array().of(
        yup.object().shape({
          accessory_id: yup.number().required("Please choose  accessory"),
          quantity: yup
          .number()
          .typeError('Must be a number')
          .required('Required field')
          .min(1, 'Must be greater than 0'),
          total: yup
          .number()
          .typeError('Must be a number')
          .required('Required field')
          .min(1, 'Must be greater than 0'),
        })
      ),
    });
  

    const validationErrors = {}; // Create a copy of the state to store validation errors

    // Populate validation errors based on schema validation
    try {
      schema.validateSync(state, { abortEarly: false });
    } catch (validationError) {
      validationError.inner.forEach((error) => {
        validationErrors[error.path] = error.message;
      });
    }
    setvalidationerr(validationErrors);
    return validationErrors; // Return the object with validation errors
  };




  const handleProductfieldchange = ( e, name, index ) => {
    console.log(e, name, index);
    const product_id = returnid(e, allProducts)

    setcurrentinput((prev) => {
      return {
        ...prev,
        product_id: product_id,
        sizearr: prev.sizearr.map((obj) => {
          return {
            ...obj,
            charge:
              returnProductCharge(product_id) +
              returnServiceCharge(prev.servicearr),
            total:
              (returnProductCharge(product_id) +
                returnServiceCharge(prev.servicearr)) *
                (parseInt(obj.length) * parseInt(obj.width)) *
                obj.quantity || 0,
          };
        }),
      };
    });


  };

  const handleServiceFieldChange = ( e , service_id ) => {
    console.log(e)
    
    if(e){
    
    if(!currentinput.servicearr.includes(service_id)){
      setcurrentinput((prev) => {
        prev.servicearr.push(service_id)
        
        
        return {
          ...prev,
          servicearr: prev.servicearr,
          sizearr: prev.sizearr.map((obj) => {
            return {
              ...obj,
              charge:
                returnProductCharge(prev.product_id) +
                returnServiceCharge(prev.servicearr),
              total:
                (returnProductCharge(prev.product_id) +
                  returnServiceCharge(prev.servicearr)) *
                  (parseInt(obj.length) * parseInt(obj.width)) *
                  obj.quantity || 0,
            };
          }),
        };
      })
    }

  }else{
      
      if(currentinput.servicearr.includes(service_id)){

    setcurrentinput((prev) => {
      const newservicearr = prev.servicearr.filter((ser)=>ser!==service_id)
      return {
        ...prev,
        servicearr: newservicearr,
        sizearr: prev.sizearr.map((obj) => {
          return {
            ...obj,
            charge:
              returnProductCharge(prev.product_id) +
              returnServiceCharge(newservicearr),
            total:
              (returnProductCharge(prev.product_id) +
                returnServiceCharge(newservicearr)) *
                (parseInt(obj.length) * parseInt(obj.width)) *
                obj.quantity || 0,
          };
        }),
      };
    })

  }
}
   
  }

  const handlesizefieldchange = ( e, name, indx ) => {
    console.log(e, name, indx);

    setcurrentinput((prev) => {
      return {
        ...prev,
        sizearr: prev.sizearr.map((size, index) => {
          if (index === indx) {
            return {
              ...size,
              [name]: e.target.value,
              area:
                parseInt(name === "length" ? e.target.value : size.length) *
                  parseInt(name === "width" ? e.target.value : size.width) ||
                0,
              charge:
                returnProductCharge(prev.product_id) +
                returnServiceCharge(prev.servicearr),
              total:
                (returnProductCharge(prev.product_id) +
                  returnServiceCharge(prev.servicearr)) *
                  parseInt(name === "length" ? e.target.value : size.length) *
                  parseInt(name === "width" ? e.target.value : size.width) *
                  (name === "quantity" ? e.target.value : size.quantity) || 0,
            };
          }
          return size;
        }),
      };
    });
  };

  const handleaccessoryfieldchange = (e, name, indx) => {
   console.log(e, name, indx )

    setcurrentinput((prev) => {
      return {
        ...prev,
        accessoryarr: prev.accessoryarr.map((acc, index) => {
          if (index === indx) {
            return {
              ...acc,
              [name]: name === "accessory_id" ? returnid(e, allAccessories) : e.target.value,
              total:
                returnAccessoryCharge(
                  name === "accessory_id" ? returnid(e, allAccessories) : acc.accessory_id
                ) * (name === "quantity" ? e.target.value : acc.quantity) || 0,
            };
          }
          return acc;
        }),
      };
    });

  };

  const returnProductCharge = ( productid ) => {
    console.log(productid)
    console.log(
      productinfo.filter((item) => item.id === productid )[0]
    );
    return (
      parseInt(
        productinfo.filter((item) => item.id === productid )[0]?.selling_rate_per_sqft
      ) || 0
    );
  };

  const returnServiceCharge = ( servicearr ) => {

    console.log(servicearr);
    let totalsum = 0;
    servicearr.forEach((serviceid) => {
      const rate =  parseInt(
        servicesinfo.filter((service) => service.id === serviceid)[0]?.rate_per_sqft
      ) || 0
      totalsum = totalsum + rate
    })

    return totalsum;

  };

  const returnAccessoryCharge = (accessoryid) => {
    return (
      parseInt(
        accessoryinfo.filter((acc) => acc?.id === accessoryid)[0]?.unit_selling_price
      ) || 0
    );
  };



  //*********************** Uploading images ***********************************************************************************/
   
  const uploadImages = async (files, indx) => {
    let filearr = Array.from(files)
    let imgArr = await returnBase64OrBinaryfromfile(filearr, 'base64')
    // let imgBinaryArr = await returnBase64OrBinaryfromfile(filearr, 'binary') // not needed yet
    console.log(imgArr, indx, filearr [0], filearr)
    let imageArr = imgArr.map((image, index) => {
    
      return { uploadProgress: "100%", ...image }
    })

    setcurrentinput((prev) => {
      return {
        ...prev,
        sizearr: prev.sizearr.map((size, index) => {
          if (index === indx) {
            return {
              ...size,
              images: [...size.images,...imageArr],
             
            };
          }
          return size;
        }),
      };
    });

  }

  const deleteImage = async(sizeArrIndx, imageIndex) => {

    setcurrentinput((prev) => {
      return {
        ...prev,
        sizearr: prev.sizearr.map((size, index) => {
          if (index === sizeArrIndx) {
            return {
              ...size,
              images: size.images.filter((image, index)=>index!==imageIndex),
             };
          }
          return size;
        }),
      };
    });
  }




  //************************************************************************************************************************* */

  useEffect(() => {
    if (selectedobj) {
      console.log(selectedobj)
      setcurrentinput(selectedobj);
    }
  }, [selectedobj]);

  useEffect(() => {
    getAllProducts();
    getAllAccessories();
    getAllServices();
  }, []);

  useEffect(() => {
    ValidateAllFields(currentinput);
  }, [currentinput]);

  console.log(currentinput, allServices);
  return (
    <>
      <div style={{ gap: "20px", flexDirection: "column", display: "flex", width:"-webkit-fill-available", padding:"0px 20px", maxWidth:"1000px", margin:"auto" }}>
       

          <SelectDemo
            placeholder="Choose product"
            divclassname="vertical"
            triggerclassname="producttrigger"
            labelclassname="primaryformsectiontitle2"
            groups={allProducts}
            label="Product"
            onChange={handleProductfieldchange}
            value={returnValue(currentinput.product_id, allProducts)}
            name="product"
            index={-1}
            error={validationerr ? validationerr[`product_id`] : undefined}
          />

        
          <div style={{ display:"flex", color:"rgb(55, 53, 47)", flexDirection:"column"}}>
          <div className="primaryformsectiontitle" style={{ marginBottom:"10px", paddingBottom:"10px", borderBottom:"1px solid rgba(55, 53, 47, 0.09)"}}>Services</div>
          <div style={{display:"flex", alignItems:"center", gap:"20px"}}>
          {allServices[0]?.items?.map((service, index)=>
          <div style={{display:"flex", alignItems:"center", gap:"5px"}} key={index}>
            <CheckboxDemo rootclass="checkclass" onChange={(e)=>handleServiceFieldChange( e , service.id )} value={currentinput.servicearr.includes(service.id)} />
            <div>{service.label}</div>
          </div>
            
            )}

          </div>
          </div>
 
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
      
              alignItems:"center"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "90%",
                marginTop:"20px"
                // borderBottom: "solid",
              }}
              className="primaryformsectiontitle"
            >
              Item size
            </div>
            <button onClick={addsize} className="tertiarybtn">
              Add size
            </button>
          </div>
          <div style={{ display: "flex", padding: "10px 0px", color:"rgb(55, 53, 47)", gap:"20px", paddingBottom:"5px" }}>
            <div style={{ width: "100px" }}>Length</div>
            <div style={{ width: "100px" }}>Width</div>
            <div style={{ width: "100px" }}>Area</div>
            <div style={{ width: "100px" }}>Quantity</div>
            <div style={{ width: "100px" }}>Charge</div>
            <div style={{ width: "100px" }}>Total</div>
          </div>
          {currentinput.sizearr.map((size, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                padding: "0px 0px",
                marginBottom: "10px",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  marginBottom: "10px",
                  gap:"20px"
                }}
              >
                <Stextfield
                  name="length"
                  label=""
                  value={size.length}
                  type="number"
                  labelclassname="sizelabelclass"
                  textfieldclassname="sizetextclass"
                  divclassname="sizedivclass"
                  placeholder="length in sqft"
                  onChange={handlesizefieldchange}
                  index={index}
                  disabled={false}
                  error={
                    validationerr
                      ? validationerr[`sizearr[${index}].length`]
                      : undefined
                  }
                />
                <Stextfield
                  name="width"
                  label=""
                  value={size.width}
                  type="number"
                  labelclassname="sizelabelclass"
                  textfieldclassname="sizetextclass"
                  divclassname="sizedivclass"
                  placeholder="width in sqft"
                  onChange={handlesizefieldchange}
                  index={index}
                  disabled={false}
                  error={
                    validationerr
                      ? validationerr[`sizearr[${index}].width`]
                      : undefined
                  }
                />

                <Stextfield
                  name="area"
                  label=""
                  value={size.area}
                  type="number"
                  labelclassname="sizelabelclass"
                  textfieldclassname="sizetextclass"
                  divclassname="sizedivclass"
                  placeholder="Area in sqft"
                  onChange={handlesizefieldchange}
                  index={index}
                  disabled={true}
                  error={
                    validationerr
                      ? validationerr[`sizearr[${index}].area`]
                      : undefined
                  }
                />
                <Stextfield
                  name="quantity"
                  label=""
                  value={size.quantity}
                  type="number"
                  labelclassname="sizelabelclass"
                  textfieldclassname="sizetextclass"
                  divclassname="sizedivclass"
                  placeholder="quantity"
                  onChange={handlesizefieldchange}
                  index={index}
                  disabled={false}
                  error={
                    validationerr
                      ? validationerr[`sizearr[${index}].quantity`]
                      : undefined
                  }
                />
                <Stextfield
                  name="charge"
                  label=""
                  value={size.charge}
                  type="number"
                  labelclassname="sizelabelclass"
                  textfieldclassname="sizetextclass"
                  divclassname="sizedivclass"
                  placeholder="charge per sqft"
                  onChange={handlesizefieldchange}
                  index={index}
                  disabled={true}
                  error={
                    validationerr
                      ? validationerr[`sizearr[${index}].charge`]
                      : undefined
                  }
                />

                <Stextfield
                  name="total"
                  label=""
                  value={size.total}
                  type="number"
                  labelclassname="sizelabelclass"
                  textfieldclassname="sizetextclass"
                  divclassname="sizedivclass"
                  placeholder="total"
                  onChange={handlesizefieldchange}
                  index={index}
                  disabled={true}
                  error={
                    validationerr
                      ? validationerr[`sizearr[${index}].total`]
                      : undefined
                  }
                />
       
                
                <button
                  style={{marginRight:"20px"}}
                 className="secondarybtn"
                  onClick={() => {
                    sizearrIndexRef.current = index
                    document.getElementById('uploads').click()
                     // implemented because document.getElementById('uploads').click() doesn't pass index to the input
                  }}
                >
                  
                   Choose files
                    
                  
                 
                </button>
               
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="uploads"
                  name="uploads"
                  accept="image/*"
                  multiple
                  onChange={(e)=>uploadImages(e.target.files, sizearrIndexRef.current)}
                />
               

               

                <button
                  style={{ display: "flex", paddingTop: "5px" }}
                  onClick={() => deletesize(index)}
                >
                  <Icon icon="typcn:delete-outline" className="deleteicon" />
                </button>
              </div>
              {size.images.length > 0 && (
                <ImageDiv uploadedImages={size.images} deleteImage={deleteImage} sizeArrIndx={index} />
              )}

            </div>
          ))}
        </div>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0px 0px",
              alignItems:"center"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "86%",
                marginTop:"20px"
                // borderBottom: "solid",
              }}
              className="primaryformsectiontitle"
            >
              Item Accessories
            </div>
            <button onClick={addaccessory} className="tertiarybtn">
              Add accessory
            </button>
          </div>
          <div style={{ display: "flex", padding: "10px 0px", color:"rgb(55, 53, 47)", gap:"20px", paddingBottom:"5px" }}>
            <div style={{ width: "170px" }}>Accessory</div>
            <div style={{ width: "100px" }}>Quantity</div>
            <div style={{ width: "100px" }}>Total</div>
          </div>
          {currentinput.accessoryarr.map((accessory, index) => (
            <div
              style={{
                display: "flex",
                padding: "0px 0px",
                marginBottom: "10px",
                gap:"20px"
              }}
              key={index}
            >
              <SelectDemo
                placeholder="Choose accessory"
                divclassname="accdivclass"
                triggerclassname="acctriggerclass"
                groups={allAccessories}
                label=""
                onChange={handleaccessoryfieldchange}
                value={returnValue(accessory.accessory_id, allAccessories)}
                name="accessory_id"
                index={index}
                error={
                  validationerr
                    ? validationerr[`accessoryarr[${index}].accessory_id`]
                    : undefined
                }
              />

              <Stextfield
                name="quantity"
                label=""
                value={accessory.quantity}
                type="number"
                labelclassname="acclabelclass"
                textfieldclassname="sizetextclass"
                divclassname="sizedivclass"
                placeholder="quantity"
                onChange={handleaccessoryfieldchange}
                index={index}
                disabled={false}
                error={
                  validationerr
                    ? validationerr[`accessoryarr[${index}].quantity`]
                    : undefined
                }
              />

              <Stextfield
                name="total"
                label=""
                value={accessory.total}
                type="number"
                labelclassname="sizelabelclass"
                  textfieldclassname="sizetextclass"
                  divclassname="sizedivclass"
                placeholder="total"
                onChange={handleaccessoryfieldchange}
                index={index}
                disabled={true}
                error={
                  validationerr
                    ? validationerr[`accessoryarr[${index}].total`]
                    : undefined
                }
              />

              <button
                style={{ display: "flex", paddingTop: "5px" }}
                onClick={() => deleteaccessory(index)}
              >
                <Icon icon="typcn:delete-outline" className="deleteicon" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div
       className="formbottomdiv"
      >
        <button
          onClick={() => {
          
            selectedobj
              ? updateitem(currentinput.id, currentinput)
              : additem(currentinput);
          }}
          disabled={
            validationerr ? !(Object.keys(validationerr).length === 0) : true
          }
          className="secondarybtn"
          
        >
          {selectedobj ? "Update item" : "Add item"}
        </button>
      </div>
    </>
  );
};

Orderinput.propTypes = {
  selectedobj: PropTypes.any,
  additem: PropTypes.func.isRequired,
  updateitem: PropTypes.func.isRequired,
};

export default Orderinput;
