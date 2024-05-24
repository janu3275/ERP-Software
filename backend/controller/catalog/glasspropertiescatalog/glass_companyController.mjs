import { asyncHandler } from "../../../middleware/asynchandler.mjs";
import { queryDB } from "../../../db.mjs";
import bcrypt from "bcrypt";
import Joi from "joi";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const glassCompanyApi = {

 addglassCompany : asyncHandler(async (req, res, next) => {
  // BODY VALIDATION
   const companyid = req.company.companyid;
   const market_id = req.market.market_id;
   const userid = req.user.userid;

   const schema = Joi.object({

   glassCompany: Joi.string().required(),
   market_id: Joi.number().integer().required(),
   companyid: Joi.number().integer().required(),
   userid: Joi.number().integer().required()

});

let body = {
  ...req.body,
  market_id,
  companyid,
  userid
  
}
 

  const { error, value } = schema.validate(body);

  // HANDLE VALIDATION ERROR

  if (error) {
    console.log(error.details);
    return res
      .status(200)
      .json({
        success: false,
        message: "Validation error",
        error: error.details
      });
  }

  // PROCEEDING TOWARDS ADDING glassCompany ---------
  let addglassCompanyqry = `INSERT INTO glass_company ( glass_company, market_id) VALUES ($1, $2) returning * ;`
  try {
    const addedglassCompany = (await queryDB(addglassCompanyqry, [body.glassCompany, body.market_id])).rows[0]
    if(addedglassCompany){
        res
        .status(200)
        .json({
          success: true,
          message: "glassCompany added successfully",
          data: addedglassCompany,
        });
    }else{
        res
        .status(200)
        .json({
          success: false,
          message: "problem in creating new glassCompany",
          data: addedglassCompany,
        });
    }
  } catch (error) {
    return res
      .status(200)
      .json({ success: false, message: "creating error", error: error });
  }
}),

 updateglassCompany : asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const companyid = req.company.companyid;
    const market_id = req.market.market_id;
    const userid = req.user.userid;
  
    const schema = Joi.object({
        glassCompanyid: Joi.number().integer().required(),
        glassCompany: Joi.string().required(),
        market_id: Joi.number().integer().required(),
        companyid: Joi.number().integer().required(),
        userid: Joi.number().integer().required()
    });
   
    let body = {
      ...req.body,
      companyid,
      market_id,
      userid
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
  
    // PROCEEDING TOWARDS UPDATING glassCompany ---------
    let updateglassCompanyQry = `UPDATE glass_company SET glass_company = $1 WHERE id = $2 returning *;`

    try {
      const updatedglassCompany = (await queryDB(updateglassCompanyQry, [ body.glassCompany, body.glassCompanyid])).rows[0]
      if(updatedglassCompany){
          res
          .status(200)
          .json({
            success: true,
            message: "glassCompany updated successfully",
            data:  updatedglassCompany,
          });
      }else{
          res
          .status(200)
          .json({
            success: false,
            message: "problem in updating glassCompany",
            data:  updatedglassCompany,
          });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "updating error", error: error });
    }
  }),
  
 deleteglassCompany : asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const companyid = req.company.companyid;
    const market_id = req.market.market_id;
    const userid = req.user.userid;
  
    const schema = Joi.object({
      glassCompanyid:  Joi.number().integer().required(),
      market_id: Joi.number().integer().required(),
      companyid: Joi.number().integer().required(),
      userid: Joi.number().integer().required()
    });
   
    let body = {
      ...req.query,
      companyid,
      market_id,
      userid
    }
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
  
    // PROCEEDING TOWARDS UPDATING glassCompany ---------
    let deleteglassCompanyQry = `DELETE FROM glass_company WHERE id = $1 returning *;`
    try {
      const deletedglassCompany = (await queryDB(deleteglassCompanyQry, [body.glassCompanyid])).rows[0]
      if(deletedglassCompany){
          res
          .status(200)
          .json({
            success: true,
            message: "glassCompany deleted successfully",
            data: deletedglassCompany,
          });
      }else{
          res
          .status(200)
          .json({
            success: false,
            message: "problem in deleting glassCompany",
            data: deletedglassCompany,
          });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "deleting error", error: error });
    }
  }),

 getAllglassCompany : asyncHandler(async (req, res, next) => {
    // BODY VALIDATION

    const companyid = req.company.companyid;
    const market_id = req.market.market_id;
    const userid = req.user.userid;
    
    const schema = Joi.object({
      market_id: Joi.number().integer().required(),
      companyid: Joi.number().integer().required(),
      userid: Joi.number().integer().required()
    });
   
    let body = {
       ...req.query,
       companyid,
       market_id,
       userid
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
  
    // PROCEEDING TOWARDS UPDATING glassCompany ---------
    let getglassCompanyQry = `select * FROM glass_company WHERE market_id = $1;`

    try {
      const allglassCompanys = (await queryDB(getglassCompanyQry, [body.market_id])).rows
      if(allglassCompanys){
          res
          .status(200)
          .json({
            success: true,
            message: "request successfully",
            data: allglassCompanys,
          });
      }else{
          res
          .status(200)
          .json({
            success: false,
            message: "problem in getting glassCompany",
            data: allglassCompanys,
          });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "updating error", error: error });
    }
  }),   

}



export { glassCompanyApi };