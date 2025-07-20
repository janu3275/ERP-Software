import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import PropTypes from "prop-types";
import { Axios } from '../../../../../utils/axios.mjs';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { returnValue } from '../../../../commonfn';


const TaskPDF = ({ selectedOrder, company }) => {

    

    console.log(selectedOrder)

    const [items, setitems] = useState({
        productItems:[],
        serviceItems:[],
        accessoryItems:[]
      })
      
      const getinitialData = async() => {
         getAllProducts()
         getAllServices()
         getAllAccessories()
      }

      
      const getAllProducts = async () => {
      
        try {
          let res = await Axios.get(
            `/glassProduct/getall`
          );
          if (res.data.success) {
            
            let arr = [...res.data.data];
            let newarr = arr.map((item) => {
              return {
                label: `${item['thickness']}mm ${item['color']} ${item['glass_type']} ${item['glass_company']} - glass`,
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
      
            setitems((prev) => {
             return {
              ...prev,
              productItems: items
             }
      
            })
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
           
            let arr = [...res.data.data];
            let newarr = arr.map((item) => {
              return {
                label: item.name,
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
      
            setitems((prev)=>{
              return {
               ...prev,
               accessoryItems: items
              }
             })
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
              }
            ];
      
            setitems((prev) => {
              return {
               ...prev,
               serviceItems: items
              }
             })
      
          }
        } catch (error) {
          console.log(error);
        }
      };


      useEffect(() => {
       getinitialData()
      }, []);

      console.log(selectedOrder.customer.name, selectedOrder.orderno)
    
    return (

    <Document>
      
      
        {selectedOrder.products.map((product, index) => {
        let productqty = product.sizearr
          .map((item) => parseInt(item.quantity))
          .reduce((acc, currentValue) => acc + currentValue, 0);

        return (
            <Page key={index} size="A4" style={styles.container}>
      
            <Text 
            style={{
                position:"absolute",
                right:"5px",
                top:"5px",
                fontSize:10
   
              }}>{company}</Text>
       
            <View
            style={{
                flexDirection: "column",
                // padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: "#E9E9E7",
                fontSize: 10
              }}
            >
              <Text style={styles.header}>Order Information {index+1}/{selectedOrder.products.length}</Text>
        <View 
        style={{
                display:"flex",
                flexDirection: "row",
                fontSize: 10,
                width:"100%",
                justifyContent:"space-between"
              }}>
        <View style={styles.row}>
          <Text style={styles.label}>Order Number:</Text>
          <Text style={styles.value}>{selectedOrder.orderno}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Customer Name:</Text>
          <Text style={styles.value}>{selectedOrder.customer.name}</Text>
        </View>
        </View>    
          <View
            style={{
              flexDirection: "row",
              padding: 10,
              borderWidth: 1,
              borderColor: "black",
              fontSize: 10,
              margin:"10px 0px",
              borderRadius:"4px"
            }}
           
          >
            
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                width: "100%",
            
              }}
            >
              <View style={{ flexDirection: "column", gap: 5 }}>
                <View style={{ flexDirection: "column", gap: 10, marginBottom: 5 }}>
                  <Text>
                    {productqty} pieces of {returnValue(product.product_id, items.productItems)}
                  </Text>
                
                </View>
                {product.sizearr.map((size, index) => (
                  <View style={{ flexDirection: "row" }} key={index}>
                    <View
                      style={{
                       
                        flexDirection: "row",
                        alignItems: "center",
                        marginRight: 10,
                      }}
                    >
                      <Text>{size.length} * </Text>
                      {/* <Text style={{ width: "1.5rem", height: "1.5rem" }}> * </Text> */}
                      <Text>{size.width}</Text>
                    </View>
                    <Text> -------- {size.quantity} pieces</Text>
                  </View>
                ))}
              </View>
            </View>
           
          </View>
          <View style={{ flexDirection: "column", gap: 10 }}>
                    {/* <Text>Glass customisation services -</Text> */}
                    {product.servicearr.map((service, index) => (
                     <View key={index} style={{ flexDirection: "column", gap: 10 }}>
                      <Text  style={{ color: "black", fontSize:15 }}>
                        {returnValue(service, items.serviceItems)}
                        
                      </Text>
                      <View style={{ flexDirection: "row" }}>
                      <Text  style={{width:"70%", height:"100px",  borderWidth: 1, borderColor: "#E9E9E7", borderRadius:"4px" }}>
                     </Text>
                     <Text  style={{width:"30%", height:"100px",  borderWidth: 1, borderColor: "#E9E9E7", borderRadius:"4px" }}>
                     </Text>
                     </View>
                      </View>
                    ))}
            </View>
          </View>
          </Page>
        );
      })}
      {/* Add more rows for other order information fields */}
    
  </Document>

  )

};

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      padding: 20

    },
    header: {
      fontSize: 18,
      marginBottom: 10,
    },
    row: {
      flexDirection: 'row',
      marginBottom: 5,
    //   fontSize: 10,
      width:"50%"
    },
    label: {
      fontWeight: 'bold',
    //   width: 100,
    marginRight:5
      
    },
    value: {
      flex: 1,
    },
  });

  TaskPDF.propTypes = {
    selectedOrder: PropTypes.object,
    company: PropTypes.string
  };

  export default TaskPDF;