import { asyncHandler } from "../../middleware/asynchandler.mjs";
import { queryDB } from "../../db.mjs";
import bcrypt from "bcrypt";
import Joi from "joi";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { orderQueries } from "../../queries/orderqueries.mjs";
import { deleteDirectory, generateRandomId, getFilesInDirectory, returnInvoicePDF, saveFilesToLocalDisk } from "../../utils/commonFunction.mjs";
import { s3Apis } from "../awsS3Controller.mjs";


dotenv.config();









const orderApi = {

  addNewOrder: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    console.log(req.body);
    const market_id = req.market.market_id;
    const schema = Joi.object({
      market_id: Joi.number().integer().required(),
      orderno: Joi.string().required(),
      date: Joi.date().required(),
      completionDate: Joi.date().required(),
      customer: Joi.object({
        name: Joi.string().required(),
        id: Joi.number().required(),
      }),
      measuredby: Joi.string().required(),
      products: Joi.array().items(
        Joi.object({
          id: Joi.string().required().allow(""),
          product_id: Joi.number().integer().required(),
          servicearr: Joi.array().items(Joi.number().integer()).required(),
          sizearr: Joi.array().items(
            Joi.object({
              length: Joi.number().required(),
              width: Joi.number().required(),
              area: Joi.number().required(),
              quantity: Joi.number().required(),
              charge: Joi.number().required(),
              total: Joi.number().required(),
              images: Joi.array()
            })
          ),
          accessoryarr: Joi.array().items(

            Joi.object({
              accessory_id: Joi.number().integer().required(),
              quantity: Joi.number().required(),
              total: Joi.number().required()
            })
          ),
        })
      ),
      payment: Joi.object({
        productCharge: Joi.number().required(),
        MeasurementCharge: Joi.string().required(),
        labourCharge: Joi.number().required(),
        fittingCharge: Joi.string().required(),
        DileveryCharge: Joi.string().required(),
        // paid: Joi.number().required(),
        // paidOptionInfo: Joi.array().items(
        //   Joi.object({
        //     via: Joi.string().required(),
        //     checked: Joi.boolean().required(),
        //     amount: Joi.number().required(),
        //   })
        // ),
        discount: Joi.number().required(),
        note: Joi.string().required()
      }),
    });

    let body = {
      ...req.body,
      market_id
    };
    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR

    if (error) {
      console.log(error.details);
      return res.status(200).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    // PROCEEDING TOWARDS ADDING ORDER ---------

    try { 
      // STARTING TRANSACTION
      await queryDB("BEGIN");

      const addedOrderId = (
        await queryDB(orderQueries.addorderinfoqry, [ 

          body.orderno,
          body.customer.id,
          body.date,
          body.completionDate,
          body.measuredby,
          body.payment.productCharge,
          body.payment.MeasurementCharge,
          body.payment.DileveryCharge,
          body.payment.labourCharge,
          body.payment.fittingCharge,
          body.payment.discount,
          'Not yet started',
          body.market_id
          
        ])
      ).rows[0]?.id;
      
      console.log("1")
      for (let i = 0; i < body.products.length; i++) {
        const productobj = body.products[i];
        const productId = (
          await queryDB(orderQueries.addOrderProductsqry, [
            productobj.product_id,
            addedOrderId
          ])
        ).rows[0]?.id;

        const servicearr = body.products[i].servicearr;

        for(let l = 0; l < servicearr.length; l++){

          await queryDB(orderQueries.addOrderProductServiceqry, [
            servicearr[l],
            productId
          ])
        }

        for (let j = 0; j < body.products[i].sizearr.length; j++) {
          let itemobj = body.products[i].sizearr[j];
          let files = itemobj.images
          let item_Id = `I-${generateRandomId(7)}`
          let itemPath = `./Uploads/${Date.now()}/customerID-${body.customer.id}/OrderID-${body.orderno}/ProductID-${productId}/ItemID-${item_Id}`
          const itemId = (
            await queryDB(orderQueries.addOrderProductItemsqry, [
              itemobj.length,
              itemobj.width,
              itemobj.area,
              itemobj.quantity,
              itemobj.charge,
              itemobj.total,
              itemPath,
              item_Id,
              productId,
              addedOrderId
            ])
          ).rows[0]?.id;
          console.log("files --->", files)
          saveFilesToLocalDisk(files, itemPath) // saving files to path
          console.log("2")
        }


        console.log("3")
        for (let k = 0; k < body.products[i].accessoryarr.length; k++) {
          let accessoryobj = body.products[i].accessoryarr[k];
          const accessoryId = (
            await queryDB(orderQueries.addOrderProductAccessoryqry, [
              accessoryobj.accessory_id,
              accessoryobj.quantity,
              accessoryobj.total,
              productId
            ])
          ).rows[0]?.id;
        }
      }



      // const cash = body.payment.paidOptionInfo[0]?.amount || 0;
      // const upi = body.payment.paidOptionInfo[1]?.amount || 0;
      // const cheque = body.payment.paidOptionInfo[2]?.amount || 0;
      // const others = body.payment.paidOptionInfo[3]?.amount || 0;

      // const paymentId = (
      //   await queryDB(orderQueries.addPaymentqry, [
      //     cash,
      //     upi,
      //     cheque,
      //     others,
      //     body.date,
      //     body.payment.note,
      //     addedOrderId
      //   ])
      // ).rows[0]?.id;

      // for (let i = 0; i < body.payment.paidOptionInfo.length; i++) {
      //   let paidOptionbj = body.payment.paidOptionInfo[i];
      //   const Id = (
      //     await queryDB(orderQueries.addPaymentMediumqry, [
      //       paidOptionbj.amount,
      //       paidOptionbj.via,
      //       paymentId,
      //       addedOrderId,
      //       body.companyid,
      //     ])
      //   ).rows[0]?.id;
      // }

      // ENDING TRANSACTION


      
      
      
      await queryDB("COMMIT");
      return res
        .status(200)
        .json({ success: true, message: "order created successfully" });
    } catch (error) {
      console.log("error in creating order", error)
      await queryDB("ROLLBACK");
      return res
        .status(200)
        .json({ success: false, message: "creating error", error: error });
    }
  }),

  addPaymentHis: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    console.log(req.body);

    
    const schema = Joi.object({
      orderid: Joi.number().required(),
      
      date: Joi.date().required(),
      note: Joi.string().allow('').required(),
      paidOptionInfo: Joi.array().items(
        Joi.object({
          via: Joi.string().required(),
          checked: Joi.boolean().required(),
          amount: Joi.number().required(),
        })
      )
    });

    let body = {
      ...req.body
      
    };

    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR

    if (error) {
      console.log(error.details);
      return res.status(200).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    // PROCEEDING TOWARDS ADDING ORDER ---------

    try {
      // STARTING TRANSACTION
      await queryDB("BEGIN");

      const cash = body.paidOptionInfo[0].amount || 0;
      const upi = body.paidOptionInfo[1].amount || 0;
      const cheque = body.paidOptionInfo[2].amount || 0;
      const others = body.paidOptionInfo[3].amount || 0;
      console.log("started payment")
      const payment = (
        await queryDB(orderQueries.addPaymentqry, [
          cash,
          upi,
          cheque,
          others,
          body.date,
          body.note,
          body.orderid
        ])
      ).rows[0];
      console.log("end payment")
      // for (let i = 0; i < body.paidOptionInfo.length; i++) {
      //   let paidOptionbj = body.paidOptionInfo[i];
      //   const paymedium = (
      //     await queryDB(orderQueries.addPaymentMediumqry, [
      //       paidOptionbj.amount,
      //       paidOptionbj.via,
      //       payment.id,
      //       body.orderid,
      //       body.companyid,
      //     ])
      //   ).rows[0];
       
      // }
      // ENDING TRANSACTION
      await queryDB("COMMIT");
      console.log(payment)
      if(payment){
        return res
        .status(200)
        .json({ success: true, message: "New Payment added successfully", data:convertPaymenthis(payment) });
      }else{
        return res
        .status(200)
        .json({ success: false, message: "problem in ading payment", data:payment });
      }
     
    } catch (error) {
      await queryDB("ROLLBACK");
      return res
        .status(200)
        .json({ success: false, message: "creating error", error: error });
    }
  }),

  addProduct: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    console.log(req.body);
    

    const schema = Joi.object({
      orderid: Joi.number().required(),
      orderno: Joi.string().required(),
   
      customer: Joi.object({
        name: Joi.string().required(),
        id: Joi.number().integer().required(),
      }),
      product: Joi.object({
        product_id: Joi.number().integer().required(),
        servicearr: Joi.array().items(Joi.number().integer()).required(),
        sizearr: Joi.array().items(
          Joi.object({
            length: Joi.number().required(),
            width: Joi.number().required(),
            area: Joi.number().required(),
            quantity: Joi.number().required(),
            charge: Joi.number().required(),
            total: Joi.number().required(),
            images: Joi.array()
          })
        ),
        accessoryarr: Joi.array().items(
          Joi.object({
            accessory_id: Joi.number().integer().required(),
            quantity: Joi.number().required(),
            total: Joi.number().required(),
          }).empty()
        ),
      }),
      productCharge: Joi.number().required()
    });

    let body = {
      ...req.body
      
    };
    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR

    if (error) {
      console.log(error.details);
      return res.status(200).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    // PROCEEDING TOWARDS ADDING ORDER ---------
    let updateOrderInfoQry = `UPDATE order_info
    SET
      product_charges = $1
    WHERE
      id = $2
      returning *;`;
      
    try {

      // STARTING TRANSACTION
      await queryDB("BEGIN");
      // product_id,
      // orderid
      
        let productobj = body.product;
        const productId = (
          await queryDB(orderQueries.addOrderProductsqry, [
            productobj.product_id,
            body.orderid,
          ])
        ).rows[0]?.id;

        const servicearr = productobj.servicearr;

        for(let l = 0; l < servicearr.length; l++){

          await queryDB(orderQueries.addOrderProductServiceqry, [
            servicearr[l],
            productId
          ])
        }

        for (let j = 0; j < body.product.sizearr.length; j++) {
          let itemobj = body.product.sizearr[j];
          let files = itemobj.images
          let item_Id = `I-${generateRandomId(7)}`
          let itemPath = `./Uploads/${Date.now()}/customerID-${body.customer.id}/OrderID-${body.orderno}/ProductID-${productId}/ItemID-${item_Id}`
          const itemId = (
            await queryDB(orderQueries.addOrderProductItemsqry, [
              itemobj.length,
              itemobj.width,
              itemobj.area,
              itemobj.quantity,
              itemobj.charge,
              itemobj.total,
              itemPath,
              item_Id,
              productId,
              body.orderid
            ])
          ).rows[0]?.id;
          console.log("files --->", files)
          saveFilesToLocalDisk(files, itemPath) // saving files to path
        }
        for (let k = 0; k < body.product.accessoryarr.length; k++) {
          let accessoryobj = body.product.accessoryarr[k];
          const accessoryId = (
            await queryDB(orderQueries.addOrderProductAccessoryqry, [
              accessoryobj.accessory_id,
              accessoryobj.quantity,
              accessoryobj.total,
              productId,
            
            ])
          ).rows[0]?.id;
        }
      
        const updatedGeneralInfo = (
          await queryDB(updateOrderInfoQry, [body.productCharge, body.orderid])
        ).rows[0];
    

      // ENDING TRANSACTION
      await queryDB("COMMIT");
      return res
        .status(200)
        .json({ success: true, message: "Product added successfully", data:body });
    } catch (error) {
      await queryDB("ROLLBACK");
      return res
        .status(200)
        .json({ success: false, message: "creating error", error: error });
    }
  }),

  updateGeneralInfo: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION

    const schema = Joi.object({
      orderid: Joi.number().required(),
      completionDate: Joi.date().required(),
      measuredby: Joi.string().required(),
      customer: Joi.object({
        name: Joi.string().required(),
        id: Joi.number().required(),
      }),
    });

    let body = req.body;
    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR

    if (error) {
      console.log(error.details);
      return res.status(200).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    // PROCEEDING TOWARDS UPDATING ORDERINFO ---------
    let updateOrderInfoQry = `UPDATE order_info
      SET
        completion_date = $1,
        measuredby = $2,
        customer_id = $3
      WHERE
        id = $4
        returning *;`;

    try {
      const updatedService = (
        await queryDB(updateOrderInfoQry, [
          body.completionDate,
          body.measuredby,
          body.customer.id,
          body.orderid
        ])
      ).rows[0];
      if (updatedService) {
        res.status(200).json({
          success: true,
          message: "General Info updated successfully",
          data: body,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "problem in updating Service",
          data: updatedService,
        });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "updating error", error: error });
    }
  }),

  updateproducts: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION

    const schema = Joi.object({
      
      orderno: Joi.string().required(),
      orderid: Joi.number().required(),
      
      customer: Joi.object({
        name: Joi.string().required(),
        id: Joi.number().required(),
      }),
      product: Joi.object({
        id: Joi.number().required(),
        product_id: Joi.number().integer().required(),
        servicearr: Joi.array().items(Joi.number().integer()).required(),
        sizearr: Joi.array().items(
          Joi.object({
            length: Joi.number().required(),
            width: Joi.number().required(),
            area: Joi.number().required(),
            quantity: Joi.number().required(),
            charge: Joi.number().required(),
            total: Joi.number().required(),
            id: Joi.number(),
            images: Joi.array()
           
          
          })
        ),
        accessoryarr: Joi.array().items(
          Joi.object({
            accessory_id: Joi.number().integer().required(),
            quantity: Joi.number().required(),
            total: Joi.number().required(),
          })
        ),
      }),
      productCharge: Joi.number().required()
    });

    let body = req.body;
    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR

    if (error) {
      console.log(error.details);
      return res.status(200).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    // PROCEEDING TOWARDS UPDATING ORDER_PRODUCTS INFO ---------
    let delexistingProdqry = `DELETE FROM order_products WHERE id = $1 returning *;`;
    let getimg_pathFromProdId = `SELECT img_path from order_prod_items where order_products_id = $1`
    let updateOrderInfoQry = `UPDATE order_info
      SET
        product_charges = $1
      WHERE
        id = $2
        returning *;`;

    try {
      await queryDB("BEGIN");

      const imgPathrows = (await queryDB(getimg_pathFromProdId, [body.product.id])).rows
      
      imgPathrows.forEach((row) => {
        row.img_path && deleteDirectory(row.img_path)    // DELETING IMAGES SAVED FOR THE PARTICULAR PRODUCTID
      })

      const deletedProduct = (
        await queryDB(delexistingProdqry, [body.product.id])
      ).rows[0];

      let productobj = body.product;
      const productId = (
        await queryDB(orderQueries.addOrderProductsqry, [
          productobj.product_id,
          body.orderid
      
        ])
      ).rows[0]?.id;

      const servicearr = productobj.servicearr;

      for(let l = 0; l < servicearr.length; l++){

        await queryDB(orderQueries.addOrderProductServiceqry, [
          servicearr[l],
          productId
        ])
      }

      for (let j = 0; j < body.product.sizearr.length; j++) {
        let itemobj = body.product.sizearr[j];
        let files = itemobj.images;
        let item_Id = `I-${generateRandomId(7)}`;
        let itemPath = `./Uploads/${Date.now()}/customerID-${body.customer.id}/OrderID-${body.orderno}/ProductID-${productId}/ItemID-${item_Id}`;
        const itemId = (
          await queryDB(orderQueries.addOrderProductItemsqry, [
            itemobj.length,
            itemobj.width,
            itemobj.area,
            itemobj.quantity,
            itemobj.charge,
            itemobj.total,
            itemPath,
            item_Id,
            productId,
            body.orderid
          ])
        ).rows[0]?.id;

        console.log("files --->", files)

        saveFilesToLocalDisk(files, itemPath) // saving files to path
    
      }

      for (let k = 0; k < body.product.accessoryarr.length; k++) {
        let accessoryobj = body.product.accessoryarr[k];
        const accessoryId = (
          await queryDB(orderQueries.addOrderProductAccessoryqry, [
            accessoryobj.accessory_id,
            accessoryobj.quantity,
            accessoryobj.total,
            productId
          ])
        ).rows[0]?.id;
      }

      const updatedGeneralInfo = (
        await queryDB(updateOrderInfoQry, [body.productCharge, body.orderid])
      ).rows[0];
      console.log(updatedGeneralInfo)
      await queryDB("COMMIT");

      res.status(200).json({
        success: true,
        message: "Products updated successfully",
        data: body
      });
    } catch (error) {
      console.log("update product error", error)
      await queryDB("ROLLBACK");
      return res
        .status(200)
        .json({ success: false, message: "updating error", error: error });
    }
  }),

  updatePayment: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION

    const schema = Joi.object({
      orderid: Joi.number().required(),
      productCharge: Joi.number().required(),
      MeasurementCharges: Joi.string().required(),
      labourCharges: Joi.number().required(),
      fittingCharges: Joi.string().required(),
      DileveryCharges: Joi.string().required(),
      discount: Joi.number().required()
    });

    let body = req.body;
    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR

    if (error) {
      console.log(error.details);
      return res.status(200).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    // PROCEEDING TOWARDS UPDATING ORDERINFO ---------
    let updateOrderInfoQry = `UPDATE order_info
      SET
        product_charges = $1,
        measurement_charges = $2,
        dilevery_charges = $3,
        labour_charges = $4,
        fitting_charges = $5,
        discount= $6
      WHERE
        id = $7
        returning *;`;

    try {
      const updatedService = (
        await queryDB(updateOrderInfoQry, [
          body.productCharge,
          body.MeasurementCharges,
          body.DileveryCharges,
          body.labourCharges,
          body.fittingCharges,
          body.discount,
          body.orderid
      ])
      ).rows[0];

      if (updatedService) {
        res.status(200).json({
          success: true,
          message: "General Info updated successfully",
          data: updatedService,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "problem in updating Service",
          data: updatedService,
        });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "updating error", error: error });
    }
  }),

  updatePaymentHis: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
   
    const schema = Joi.object({
      orderid: Joi.number().integer().required(),
      
      paymentid: Joi.number().integer().required(),
      // paid: Joi.number().required(),
      date: Joi.date().required(),
      note: Joi.string().allow('').required(),
      paidOptionInfo: Joi.array().items(
        Joi.object({
          via: Joi.string().required(),
          checked: Joi.boolean().required(),
          amount: Joi.number().required(),
        })
      ),
    });

    let body = {
      ...req.body
    };

    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR

    if (error) {
      console.log(error.details);
      return res.status(200).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    // PROCEEDING TOWARDS UPDATING ORDERINFO ---------
    let delexistingPaymentqry = `DELETE FROM paymentinfo WHERE id = $1 returning *;`;

    try {
      await queryDB("BEGIN");

      const deletedPayment = (
        await queryDB(delexistingPaymentqry, [body.paymentid])
      ).rows[0];

      const cash = body.paidOptionInfo[0].amount || 0; 
      const upi = body.paidOptionInfo[1].amount || 0;
      const cheque = body.paidOptionInfo[2].amount || 0;
      const others = body.paidOptionInfo[3].amount || 0;

      const paymentId = (
        await queryDB(orderQueries.addPaymentqry, [
          cash,
          upi,
          cheque,
          others,
          body.date,
          body.note,
          body.orderid
        ])
      ).rows[0]?.id;

      // for (let i = 0; i < body.paidOptionInfo.length; i++) {
      //   let paidOptionbj = body.paidOptionInfo[i];
      //   const Id = (
      //     await queryDB(orderQueries.addPaymentMediumqry, [
      //       paidOptionbj.amount,
      //       paidOptionbj.via,
      //       paymentId,
      //       body.orderid,
      //       body.companyid,
      //     ])
      //   ).rows[0]?.id;
      // }
      await queryDB("COMMIT");
      res.status(200).json({
        success: true,
        message: "payment history updated successfully",
        data: [],
      });
    } catch (error) {
      console.log(error)
      await queryDB("ROLLBACK");
      return res
        .status(200)
        .json({ success: false, message: "updating error", error: error });
    }
  }),

  changeOrderstatus: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    
    const schema = Joi.object({
      orderid: Joi.number().integer().required(),
      status: Joi.string().required()
     
    });

    let body = {
      ...req.body,
      
    };

    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR

    if (error) {
      console.log(error.details);
      return res.status(200).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    // PROCEEDING TOWARDS UPDATING ORDERINFO ---------
    

    try {
      await queryDB("BEGIN");

      const updatedOrder = (
        await queryDB(orderQueries.updateOrderStatusqry, [body.status, body.orderid])
      ).rows[0];

   
      await queryDB("COMMIT");
      res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        data: [],
      });
    } catch (error) {
      console.log(error)
      await queryDB("ROLLBACK");
      return res
        .status(200)
        .json({ success: false, message: "updating error", error: error });
    }
  }),

  changePaymentstatus: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    
    const schema = Joi.object({
      orderid: Joi.number().integer().required(),
      status: Joi.string().required()
     
    });

    let body = {
      ...req.body,
      
    };

    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR

    if (error) {
      console.log(error.details);
      return res.status(200).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    // PROCEEDING TOWARDS UPDATING ORDERINFO ---------
    

    try {
      await queryDB("BEGIN");

      const updatedOrder = (
        await queryDB(orderQueries.updatePaymentStatusqry, [body.status, body.orderid])
      ).rows[0];

   
      await queryDB("COMMIT");
      res.status(200).json({
        success: true,
        message: "Payment status updated successfully",
        data: [],
      });
    } catch (error) {
      console.log(error)
      await queryDB("ROLLBACK");
      return res
        .status(200)
        .json({ success: false, message: "updating error", error: error });
    }
  }),


  deleteOrder: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION

    const schema = Joi.object({
      orderid: Joi.number().integer().required(),
    });

    let { orderid } = req.query;

    let body = {
      orderid
    }
    
    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR

    if (error) {
      console.log(error.details);
      return res.status(200).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    // PROCEEDING TOWARDS UPDATING Service ---------
    let deleteOrderQry = `DELETE FROM order_info WHERE id = $1 returning *;`;
    let getimg_pathFromOrderId = `SELECT img_path from order_prod_items where orderid = $1`;

    try {

      const imgPathrows = (await queryDB(getimg_pathFromOrderId, [body.orderid])).rows
      
      const deletedOrder = (await queryDB(deleteOrderQry, [body.orderid]))
        .rows[0];

      imgPathrows.forEach((row) => {
          row.img_path && deleteDirectory(row.img_path)    // DELETING IMAGES SAVED FOR THE PARTICULAR orderID
      })
        
      if (deletedOrder) {
        res.status(200).json({
          success: true,
          message: "Service deleted successfully",
          data: deletedOrder,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "problem in deleting Service",
          data: deletedOrder,
        });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "deleting error", error: error });
    }
  }),

  deleteOrders: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const schema = Joi.object({
      orderIdArr: Joi.array().items(Joi.number().integer()).min(1).required(),
    });
  
    const { error, value } = schema.validate(req.body);
  
    // HANDLE VALIDATION ERROR
    if (error) {
      console.log(error.details);
      return res.status(200).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }
  
    // PROCEEDING TOWARDS DELETING ORDERS
    const orderIds = req.body.orderIdArr;
    const deleteOrderQry = `DELETE FROM order_info WHERE id = $1 returning *;`;
    const getImgPathFromOrderIds = `SELECT img_path from order_prod_items where orderid IN (${orderIds.join(",")})`;
  
    try {
      // Begin transaction
      await queryDB("BEGIN");
  
      // Delete orders
      const imgPathRows = (await queryDB(getImgPathFromOrderIds)).rows;
      const deletePromises = orderIds.map((orderId) => queryDB(deleteOrderQry, [orderId]));
      const deletedOrders = await Promise.all(deletePromises);
  
      // DELETING IMAGES SAVED FOR THE PARTICULAR ORDER IDs
      imgPathRows.forEach((row) => {
        row.img_path && deleteDirectory(row.img_path);
      });
  
      // Commit transaction
      await queryDB("COMMIT");
  
      res.status(200).json({
        success: true,
        message: "Orders deleted successfully",
        data: deletedOrders,
      });
    } catch (error) {
      // Rollback transaction in case of error
      await queryDB("ROLLBACK");
      return res.status(200).json({ success: false, message: "Deleting error", error: error });
    }
  }),

  deleteProduct: asyncHandler(async (req, res, next) => {

    // BODY VALIDATION

    const schema = Joi.object({
      productid: Joi.string().required(),
      productCharge: Joi.number().required(),
      orderid: Joi.number().integer().required()
    });

    let {orderid, productid, productCharge} = req.query;
    let body = {
      orderid,
      productid,
      productCharge
    }
    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR

    if (error) {
      console.log(error.details);
      return res.status(200).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    // PROCEEDING TOWARDS UPDATING Service ---------
    let deleteProductQry = `DELETE FROM order_products WHERE id = $1 returning *;`;
    let getimg_pathFromProdId = `SELECT img_path from order_prod_items where order_products_id = $1`
    let updateOrderInfoQry = `UPDATE order_info
      SET
        product_charges = $1
      WHERE
        id = $2
        returning *;`;

  try {

      await queryDB("BEGIN");

      const imgPathrows = (await queryDB(getimg_pathFromProdId, [body.productid])).rows
      
      const deletedProduct = (await queryDB(deleteProductQry, [body.productid]))
        .rows[0];

      const updatedGeneralInfo = (
          await queryDB(updateOrderInfoQry, [body.productCharge, body.orderid])
        ).rows[0];  

      imgPathrows.forEach((row)=>{
          row.img_path && deleteDirectory(row.img_path)    // DELETING IMAGES SAVED FOR THE PARTICULAR PRODUCTID
        })

      await queryDB("COMMIT");
  
        res.status(200).json({
          success: true,
          message: "Product deleted successfully",
          data: deletedProduct,
        });
    
      
    } catch (error) {
      await queryDB("ROLLBACK");
      return res
        .status(200)
        .json({ success: false, message: "deleting error", error: error });
    }
  }),

  deletePaymenthis: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION

    const schema = Joi.object({
      orderid: Joi.number().integer().required(),
      paymentid: Joi.string().required()
    });

    let { orderid, paymentid} = req.query;

    let body = {
      orderid,
      paymentid
   
    }

    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR

    if (error) {
      console.log(error.details);
      return res.status(200).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

  console.log("paymenthis", body)
    // PROCEEDING TOWARDS UPDATING Service ---------
    let deletePaymentQry = `DELETE FROM paymentinfo WHERE id = $1 returning *;`;
    // let updateOrderInfoQry = `UPDATE orderinfo
    //   SET
    //     paid = $1
    //   WHERE
    //     id = $2
    //     returning *;`;

    try {
      await queryDB("BEGIN");
      const deletedPayment = (await queryDB(deletePaymentQry, [body.paymentid]))
        .rows[0];

      // const updatedGeneralInfo = (
      //     await queryDB(updateOrderInfoQry, [body.paid, body.orderid])
      //   ).rows[0];  
      await queryDB("COMMIT");
        res.status(200).json({
          success: true,
          message: "Payment deleted successfully",
          data: [],
        });
    
    } catch (error) {
      console.log(error)
      await queryDB("ROLLBACK");
      return res
        .status(200)
        .json({ success: false, message: "deleting error", error: error });
    }
  }), 

  getOrdersByOrderStatus: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const market_id = req.market.market_id;
    const schema = Joi.object({
      market_id: Joi.number().integer().required(),
      status: Joi.string().required()
    });
  

    let body = {
      ...req.query,
      market_id
    };

    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR

    if (error) {
      console.log(error.details);
      return res.status(200).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    // PROCEEDING TOWARDS GETTING ALL ORDERS ---------

    try {

      const allorderinfo = (
        await queryDB(orderQueries.getAllOrderByOrderStatusqry, [body.market_id, body.status])
      ).rows;

      console.log(allorderinfo)

      if (allorderinfo) {
        res.status(200).json({
          success: true,
          message: "request successfully",
          data: allorderinfo,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "problem in getting Service",
          data: allorderinfo,
        });
      }
      
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "updating error", error: error });
    }
  }),

  getOrdersByCustomer: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const market_id = req.market.market_id;
    const schema = Joi.object({
      market_id: Joi.number().integer().required(),
      customer_id: Joi.number().integer().required(),
    });
  

    let body = {
      ...req.query,
      market_id
    };

    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR

    if (error) {
      console.log(error.details);
      return res.status(200).json({
        success: false,
        message: "Validation error",
        error: error.details
      });
    }

    // PROCEEDING TOWARDS GETTING ALL ORDERS ---------

    try {

      const allorderinfo = (
        await queryDB(orderQueries.getAllOrderByCustomerqry, [body.market_id, body.customer_id])
      ).rows;

      console.log(allorderinfo)

      if (allorderinfo) {
        res.status(200).json({
          success: true,
          message: "request successfully",
          data: allorderinfo,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "problem in getting Service",
          data: allorderinfo,
        });
      }
      
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "updating error", error: error });
    }
  }),

  getOrderbyId: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    
    const market_id = req.market.market_id;
    const schema = Joi.object({
      market_id: Joi.number().integer().required(),
      orderid: Joi.number().integer().required(),
    });

    let body = {
      ...req.query,
      market_id
    };

    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR

    if (error) {
      console.log(error.details);
      return res.status(200).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    // PROCEEDING TOWARDS GETTING ORDER BY ID ---------
    let getcustqry = `SELECT * FROM customerinfo WHERE id=$1`;

    try {
      await queryDB("BEGIN");
      let orderInfo = (
        await queryDB(orderQueries.getOrderInfoById.OrderInfoqry, [
          body.orderid
        ])
      ).rows[0];
      let allproducts = (
        await queryDB(orderQueries.getOrderInfoById.ProductInfoqry, [
          body.orderid,
        ])
      ).rows;

      let customerName = (await queryDB(getcustqry, [orderInfo.customer_id]))
        .rows[0].name;
     
      let products = [];

      for (let i = 0; i < allproducts.length; i++) {
        let productobj = allproducts[i];

        let servicearr = (
          await queryDB(orderQueries.getOrderInfoById.Servicearr_Infoqry, [
            productobj.id,
          ])
        ).rows;  

        servicearr = servicearr.map(obj => obj.glass_custom_service_id);


        let sizearr = (
          await queryDB(orderQueries.getOrderInfoById.Prod_item_infoqry, [
            productobj.id,
          ])
        ).rows;

         sizearr = sizearr.map((sizeobj) => {
          return {
            ...sizeobj,
            images: getFilesInDirectory(sizeobj.img_path) 
          }
        })


        let accessoryarr = (
          await queryDB(orderQueries.getOrderInfoById.Prod_access_infoqry, [
            productobj.id,
          ])
        ).rows;
        products.push({ ...productobj, sizearr, accessoryarr, servicearr });
      }

      let paymenthis = [];
      // let allpayments = (
      //   await queryDB(orderQueries.getOrderInfoById.PaymentInfoqry, [
      //     body.orderid
      //   ])
      // ).rows;

      // for (let i = 0; i < allpayments.length; i++) {
      //   let paymentobj = allpayments[i];
      //   let paidOptionInfo = (
      //     await queryDB(orderQueries.getOrderInfoById.PaymentMediumInfoqry, [
      //       paymentobj.id,
      //     ])
      //   ).rows;
      //   paymenthis.push({ ...paymentobj, paidOptionInfo });
      // }
      let data = {
        orderInfo,
        products,
        // allpayments,
        customerName,
      };
      await queryDB("COMMIT");

      res.status(200).json({
        success: true,
        message: "request successfully",
        data: convertData(data),
      });
    } catch (error) {
      console.log(error)
      await queryDB("ROLLBACK");
      return res
        .status(200)
        .json({ success: false, message: "updating error", error: error });
    }
  }),

  getInvoicePDFLinkByOrder: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    
    const market_id = req.market.market_id;

    const schema = Joi.object({
      market_id: Joi.number().integer().required(),
      orderid: Joi.number().integer().required(),
    });

    let body = {
      ...req.query,
      market_id
    };

    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR

    if (error) {
      console.log(error.details);
      return res.status(200).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    

    // PROCEEDING TOWARDS GETTING ORDER BY ID ---------
    let getcustqry = `SELECT * FROM customerinfo WHERE id=$1`;

    try {
      await queryDB("BEGIN");
      let orderInfo = (
        await queryDB(orderQueries.getOrderInfoById.OrderInfoqry, [
          body.orderid
        ])
      ).rows[0];
      let allproducts = (
        await queryDB(orderQueries.getOrderInfoById.ProductInfoqry, [
          body.orderid,
        ])
      ).rows;

      let customerName = (await queryDB(getcustqry, [orderInfo.customer_id]))
        .rows[0].name;
     
      let products = [];

      for (let i = 0; i < allproducts.length; i++) {
        let productobj = allproducts[i];

        let servicearr = (
          await queryDB(orderQueries.getOrderInfoById.Servicearr_Infoqry, [
            productobj.id,
          ])
        ).rows;  

        servicearr = servicearr.map(obj => obj.glass_custom_service_id);


        let sizearr = (
          await queryDB(orderQueries.getOrderInfoById.Prod_item_infoqry, [
            productobj.id,
          ])
        ).rows;

         sizearr = sizearr.map((sizeobj) => {
          return {
            ...sizeobj,
            images: getFilesInDirectory(sizeobj.img_path) 
          }
        })


        let accessoryarr = (
          await queryDB(orderQueries.getOrderInfoById.Prod_access_infoqry, [
            productobj.id,
          ])
        ).rows;
        products.push({ ...productobj, sizearr, accessoryarr, servicearr });
      }

      let data = {
        orderInfo,
        products,
        customerName
      };

     
    

      await queryDB("COMMIT");

      res.status(200).json({
        success: true,
        message: "request successfully",
        data: convertData(data),
      });
    } catch (error) {
      console.log(error)
      await queryDB("ROLLBACK");
      return res
        .status(200)
        .json({ success: false, message: "updating error", error: error });
    }
  }),

  getallOrders: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const market_id = req.market.market_id;
    const schema = Joi.object({
      market_id: Joi.number().integer().required()
    });
  

    let body = {
      ...req.query,
      market_id
    };

    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR

    if (error) {
      console.log(error.details);
      return res.status(200).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    // PROCEEDING TOWARDS GETTING ALL ORDERS ---------

    try {

      const allorderinfo = (
        await queryDB(orderQueries.getAllOrdersqry, [body.market_id])
      ).rows;

      console.log(allorderinfo)

      if (allorderinfo) {
        res.status(200).json({
          success: true,
          message: "request successfully",
          data: allorderinfo,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "problem in getting Service",
          data: allorderinfo,
        });
      }
      
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "updating error", error: error });
    }
  }),

  getallCustomerSummary: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const market_id = req.market.market_id;
    const schema = Joi.object({
      market_id: Joi.number().integer().required()
    });
  

    let body = {
      ...req.query,
      market_id
    };

    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR

    if (error) {
      console.log(error.details);
      return res.status(200).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    // PROCEEDING TOWARDS GETTING ALL ORDERS ---------

    try {

      const allorderinfo = (
        await queryDB(orderQueries.getAllCustomerSummary, [body.market_id])
      ).rows;

      console.log(allorderinfo)

      if (allorderinfo) {
        res.status(200).json({
          success: true,
          message: "request successfully",
          data: allorderinfo,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "problem in getting Service",
          data: allorderinfo,
        });
      }
      
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "updating error", error: error });
    }
  })

};

const convertAllordersData = (ordersArr)=>{
 return ordersArr.map((order)=>{
  return {
    ...order,
    order_date: new Date(order.order_date),
    completion_date: new Date(order.completion_date),
    measured_by: 'shaam ',
    product_charges: parseFloat(order.product_charges),
    measurement_charges: parseFloat(order.measurement_charges),
    dilevery_charges: parseFloat(order.dilevery_charges),
    labour_charges: parseFloat(order.labour_charges),
    fitting_charges: parseFloat(order.fitting_charges),
    discount: parseFloat(order.discount),
    payment_info: order.payment_info.map((payment)=>{
      return {
        ...payment,
        cash: parseFloat(payment.cash),
        cheque: parseFloat(payment.cheque),
        upi: parseFloat(payment.upi),
        other: parseFloat(payment.other),
        payment_date: new Date(payment.payment_date)
      }
    })
  }
 })
}

function convertData(data) {
  let { orderInfo, products, customerName } = data;
  const date = new Date(orderInfo.order_date);
  const completionDate = new Date(orderInfo.completion_date);

  let newproducts = products.map((product) => {
    return {
      ...product,

      // charge: parseFloat(product.charges),

      sizearr: product.sizearr.map((size) => {
        return {
          ...size,
          length: parseFloat(size.length),
          width: parseFloat(size.width),
          area: parseFloat(size.area),
          total: parseFloat(size.total),
          charge: parseFloat(size.charge),
        };
      }),

      accessoryarr: product.accessoryarr.map((access) => {
        return {
          ...access,
          total: parseFloat(access.total),
        };
      }),
    };
  });

  // let newpaymenthis = allpayments.map((payment) => {
  //   let paydate = new Date(payment.payment_date);
  //   return {
  //     ...payment,
  //     paymentid:payment.id,
      
  //     date: paydate.toISOString().split("T")[0],
  //     paidOptionInfo: [
  //       {
  //         via: "Cash",
  //         label: "Cash",
  //         checked: parseFloat(payment.cash)?true:false,
  //         amount: parseFloat(payment.cash)?parseFloat(payment.cash):0,
  //       },
  //       {
  //         via: "UPI",
  //         label: "Google Pay UPI",
  //         checked: parseFloat(payment.upi)?true:false,
  //         amount: parseFloat(payment.upi)?parseFloat(payment.upi):0,
  //       },
  //       {
  //         via: "Cheque",
  //         label: "Cheque",
  //         checked: parseFloat(payment.cheque)?true:false,
  //         amount: parseFloat(payment.cheque)?parseFloat(payment.cheque):0,
  //       },
  //       {
  //         via: "Other",
  //         label: "Other",
  //         checked: parseFloat(payment.other)?true:false,
  //         amount: parseFloat(payment.other)? parseFloat(payment.other):0
  //       }
  //     ],
  //   };
  // });
  let obj = {
    orderno: orderInfo.order_id,
    orderid: orderInfo.id,
    date: date.toISOString().split("T")[0],
    customer: {
      name: customerName,
      id: orderInfo.customer_id,
    },
    measuredby: orderInfo.measuredby,
    completionDate: completionDate.toISOString().split("T")[0],
    products: newproducts,
    payment: {
      productCharge: parseFloat(orderInfo.product_charges),
      MeasurementCharge: (orderInfo.measurement_charges),
      DileveryCharge: (orderInfo.dilevery_charges),
      fittingCharge: (orderInfo.fitting_charges),
      labourCharge: parseFloat(orderInfo.labour_charges),
      discount: parseFloat(orderInfo.discount)
     }
    // paymenthis: newpaymenthis
  };
  return obj;
}


const convertPaymenthis = (paymenthis) => {
  console.log("payhis", paymenthis)
  let paydate = new Date(paymenthis.payment_date);
  let newpaymenthis = {
      ...paymenthis,
      paymentid:paymenthis.id,
      
      date: paydate.toISOString().split("T")[0],
      paidOptionInfo: [
        {
          via: "Cash",
          label: "Cash",
          checked: true,
          amount: parseFloat(paymenthis.cash)?parseFloat(paymenthis.cash):0,
        },
        {
          via: "UPI",
          label: "Google Pay UPI",
          checked: true,
          amount: parseFloat(paymenthis.upi)?parseFloat(paymenthis.upi):0,
        },
        {
          via: "Cheque",
          label: "Cheque",
          checked:true,
          amount: parseFloat(paymenthis.cheque)?parseFloat(paymenthis.cheque):0,
        },
        {
          via: "Other",
          label: "Other",
          checked: true,
          amount: parseFloat(paymenthis.other)? parseFloat(paymenthis.other):0
        }
      ],

  };

  return newpaymenthis
}



export { orderApi };
