import StackedImages from "../../../../assets/singlecomponents/stackedimages/stackedimages";
// import "./Products.css";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import { returnValue } from "../../../../commonfn";
import React from 'react';

const ViewProductsinfo = ({
 
   generalInfo,
   items,
   calculateProductCharge

}) => {

  
  return (
    <>
      <div
        style={{
          marginTop: "20px",
          paddingBottom: "0",
          borderBottom: "1px solid rgb(233, 233, 231)",
          border:"1px solid rgb(233, 233, 231)",
          borderRadius:"6px",
          color:"rgb(55, 53, 47)",
        }}
        className="orderform"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0px 20px",
            paddingBottom: "20px",
            borderBottom: "1px solid rgb(233, 233, 231)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {" "}
            Product summary{" "}
           
          </div>
        </div>
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid rgb(233, 233, 231)",
            padding: "0px 20px",
          }}
        >
          <div
            style={{ width: "5%", borderRight: "1px solid rgb(233, 233, 231)", padding: "10px 0px" }}
          >
            SNo.
          </div>
          <div
            style={{
              width: "40%",
              borderRight: "1px solid rgb(233, 233, 231)",
              padding: "10px 0px",
              paddingLeft: "20px",
            }}
          >
            Product + Services
          </div>
          <div
            style={{
              width: "10%",
              borderRight: "1px solid rgb(233, 233, 231)",
              padding: "10px 20px",
              paddingLeft: "20px",
            }}
          >
            Attachments
          </div>
          <div
            style={{
              width: "20%",
              minWidth: "50px",
              borderRight: "1px solid rgb(233, 233, 231)",
              padding: "10px 20px",
            }}
          >
            Accessory
          </div>
          <div
            style={{
              width: "10%",
              minWidth: "50px",
              padding: "10px 20px",
              borderRight: "1px solid rgb(233, 233, 231)",
            }}
          >
            Total
          </div>
          
        </div>

        {generalInfo.products.map((product, index) => {
          let productqty = product.sizearr
            .map((item) => parseInt(item.quantity))
            .reduce((acc, currentValue) => acc + currentValue, 0);
          let totalofsize = product.sizearr
            .map((item) => parseInt(item.total))
            .reduce((acc, currentValue) => acc + currentValue, 0);
          let totalofaccessory = product.accessoryarr
            .map((acc) => parseInt(acc.total))
            .reduce((acc, currentValue) => acc + currentValue, 0);
          let producttotal = parseInt(totalofaccessory) + parseInt(totalofsize);

          return (
            <div
              style={{
                display: "flex",
                padding: "0px 20px",
                borderBottom: "1px solid rgb(233, 233, 231)",
              }}
              key={index}
            >
              <div
                style={{
                  width: "5%",
                  borderRight: "1px solid rgb(233, 233, 231)",
                  padding: "10px 0px",
                }}
              >
                {index + 1}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "25px",
                  width: "40%",
                  borderRight: "1px solid rgb(233, 233, 231)",
                  padding: "10px 0px",
                  paddingLeft: "20px",
                }}
                id="productsummary"
                className="productsummary"
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: "5px",
                      flexDirection:"column"
                    }}
                  >
                    <div>
                      {productqty} pieces of {returnValue(product.product_id, items.productItems)}
                    </div>
                    <div style={{display:"flex", gap:"5px"}}>
                      Glass customisation services - 
                    {product.servicearr.map((service, index)=><div key={index} style={{ color: "black" }}>{returnValue(service, items.serviceItems)}{product.servicearr.length!==index+1 && ','}</div>)}
                    </div>
                  </div>
                  {product.sizearr.map((size, index) => (
                    <div style={{ display: "flex" }} key={index}>
                      <div
                        style={{
                          minWidth: "25%",
                          display: "flex",
                          alignItems: "center",
                          marginRight: "10px",
                        }}
                      >
                        <div> {size.length} </div>
                        <Icon
                          icon="tdesign:multiply"
                          style={{ width: "1.5rem", height: "1.5rem" }}
                        />
                        <div> {size.width} </div>
                      </div>{" "}
                      -------- {size.quantity} pieces
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  width: "10%",
                  minWidth: "50px",
                  borderRight: "1px solid rgb(233, 233, 231)",
                  padding: "10px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px"
                }}
              >
                {product.sizearr.map(
                  (size, index) =>
                    size.images.length > 0 && (
                      <StackedImages key={index} images={size.images} imageSize={50} />
                    )
                )}
              </div>

              <div
                style={{
                  width: "20%",
                  minWidth: "50px",
                  borderRight: "1px solid rgb(233, 233, 231)",
                  padding: "10px 20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {product.accessoryarr.map((acc, index) => (
                    <div key={index}>
                      {acc.quantity} pieces of {returnValue(acc.accessory_id, items.accessoryItems)}
                    </div>
                  ))}
                </div>
              </div>
              <div
                style={{
                  width: "10%",
                  minWidth: "50px",
                  padding: "10px 20px",
                  borderRight: "1px solid rgb(233, 233, 231)",
                }}
              >
                {producttotal}
              </div>
           
            </div>
          );
        })}
        <div style={{ display: "flex" }}>
          <div
            style={{
              width: "calc(80% - 45.5px)",
              borderRight: "1px solid rgb(233, 233, 231)",
              padding: "10px 20px",
              display: "flex",
              justifyContent: "end",
            }}
          >
            {" "}
            Product charges
          </div>
          <div
            style={{
              width: "10%",
              minWidth: "50px",
              padding: "10px 20px",
            }}
          >
            Rs. {calculateProductCharge()}
          </div>
          <div
            style={{
              width: "10%",
              minWidth: "50px",
              padding: "10px 20px",
            }}
          ></div>
        </div>
      </div>
   </>
  );
};

ViewProductsinfo.propTypes = {
  

  generalInfo: PropTypes.object.isRequired,
  items: PropTypes.object.isRequired,
  calculateProductCharge: PropTypes.func.isRequired

};

export default ViewProductsinfo;
