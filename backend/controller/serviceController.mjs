import { asyncHandler } from "../middleware/asynchandler.mjs";
import { queryDB } from "../db.mjs";
import bcrypt from "bcrypt";
import Joi from "joi";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const serviceApi = {

     addService : asyncHandler(async (req, res, next) => {
        // BODY VALIDATION
      
        const schema = Joi.object({
          name: Joi.string().required(),
          unit: Joi.string().required(),
          unitprice: Joi.string().required(),
          companyid: Joi.string().required()
      });
       
        let body = req.body;
        const { error, value } = schema.validate(body);
      
        // HANDLE VALIDATION ERROR
      
        if (error) {
          console.log(error.details);
          return res
            .status(200)
            .json({
              success: false,
              message: "Validation error",
              error: error.details,
            });
        }
      
        // PROCEEDING TOWARDS ADDING Service ---------
        let addServiceqry = `INSERT INTO serviceinfo (name, unit, unitprice, companyid) VALUES ($1, $2, $3, $4) returning *;`
        try {
          const addedService = (await queryDB(addServiceqry, [body.name, body.unit, body.unitprice, body.companyid])).rows[0]
          if(addedService){
              res
              .status(200)
              .json({
                success: true,
                message: "Service added successfully",
                data: addedService,
              });
          }else{
              res
              .status(200)
              .json({
                success: false,
                message: "problem in creating new Service",
                data: addedService,
              });
          }
        } catch (error) {
          return res
            .status(200)
            .json({ success: false, message: "creating error", error: error });
        }
      }),
      
     updateService : asyncHandler(async (req, res, next) => {
          // BODY VALIDATION
        
          const schema = Joi.object({
              serviceid: Joi.string().required(),
              name: Joi.string().required(),
              unit: Joi.string().required(),
              unitprice: Joi.string().required(),
              
        });
         
          let body = req.body;
          const { error, value } = schema.validate(body);
        
          // HANDLE VALIDATION ERROR
        
          if (error) {
            console.log(error.details);
            return res
              .status(200)
              .json({
                success: false,
                message: "Validation error",
                error: error.details,
              });
          }
        
          // PROCEEDING TOWARDS UPDATING Service ---------
          let updateServiceQry = `UPDATE serviceinfo
          SET
            name = $1,
            unit = $2,
            unitprice = $3
          WHERE
            id = $4
            returning *;`
      
          try {
            const updatedService = (await queryDB(updateServiceQry, [body.name, body.unit, body.unitprice, body.serviceid])).rows[0]
            if(updatedService){
                res
                .status(200)
                .json({
                  success: true,
                  message: "Service updated successfully",
                  data:  updatedService,
                });
            }else{
                res
                .status(200)
                .json({
                  success: false,
                  message: "problem in updating Service",
                  data:  updatedService,
                });
            }
          } catch (error) {
            return res
              .status(200)
              .json({ success: false, message: "updating error", error: error });
          }
        }),
        
     deleteService : asyncHandler(async (req, res, next) => {
          // BODY VALIDATION
          let serviceid = req.query.serviceid;
          const schema = Joi.object({
            serviceid:  Joi.string().required(),
          });
         
          let body = {
            serviceid
          };
          const { error, value } = schema.validate(body);
        
          // HANDLE VALIDATION ERROR
        
          if (error) {
            console.log(error.details);
            return res
              .status(200)
              .json({
                success: false,
                message: "Validation error",
                error: error.details,
              });
          }
        
          // PROCEEDING TOWARDS UPDATING Service ---------
          let deleteServiceQry = `DELETE FROM serviceinfo WHERE id = $1 returning *;`
          try {
            const deletedService = (await queryDB(deleteServiceQry, [body.serviceid])).rows[0]
            if(deletedService){
                res
                .status(200)
                .json({
                  success: true,
                  message: "Service deleted successfully",
                  data: deletedService,
                });
            }else{
                res
                .status(200)
                .json({
                  success: false,
                  message: "problem in deleting Service",
                  data: deletedService,
                });
            }
          } catch (error) {
            return res
              .status(200)
              .json({ success: false, message: "deleting error", error: error });
          }
        }),
      
     getAllService : asyncHandler(async (req, res, next) => {
          // BODY VALIDATION
          let companyid = req.query.companyid;
          const schema = Joi.object({
            companyid:  Joi.string().required(),
          });
         
          let body = {
            companyid
          };
          const { error, value } = schema.validate(body);
        
          // HANDLE VALIDATION ERROR
        
          if (error) {
            console.log(error.details);
            return res
              .status(200)
              .json({
                success: false,
                message: "Validation error",
                error: error.details,
              });
          }
        
          // PROCEEDING TOWARDS UPDATING Service ---------
          let getServiceQry = `select * FROM serviceinfo WHERE companyid = $1;`
      
          try {
            const allServices = (await queryDB(getServiceQry, [body.companyid])).rows
            if(allServices){
                res
                .status(200)
                .json({
                  success: true,
                  message: "request successfully",
                  data: allServices,
                });
            }else{
                res
                .status(200)
                .json({
                  success: false,
                  message: "problem in getting Service",
                  data: allServices,
                });
            }
          } catch (error) {
            return res
              .status(200)
              .json({ success: false, message: "updating error", error: error });
          }
        })
}

  



export {serviceApi};