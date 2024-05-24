import { asyncHandler } from "../../../middleware/asynchandler.mjs";
import { queryDB } from "../../../db.mjs";
import bcrypt from "bcrypt";
import Joi from "joi";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const sizeApi = {

 addsize : asyncHandler(async (req, res, next) => {
  // BODY VALIDATION
   const companyid = req.company.companyid;
   const market_id = req.market.market_id;
   const userid = req.user.userid;

   const schema = Joi.object({

   length: Joi.number().required(),
   width: Joi.number().required(),
   unitid: Joi.number().integer().required(),
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

  // PROCEEDING TOWARDS ADDING size ---------
  let addsizeqry = `INSERT INTO glass_sizes ( length, width, unitid, market_id ) VALUES ($1, $2, $3, $4) returning * ;`
  try {
    const addedsize = (await queryDB(addsizeqry, [body.length, body.width, body.unitid, body.market_id])).rows[0]
    if(addedsize){
        res
        .status(200)
        .json({
          success: true,
          message: "size added successfully",
          data: addedsize,
        });
    }else{
        res
        .status(200)
        .json({
          success: false,
          message: "problem in creating new size",
          data: addedsize,
        });
    }
  } catch (error) {
    return res
      .status(200)
      .json({ success: false, message: "creating error", error: error });
  }
}),

 updatesize : asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const companyid = req.company.companyid;
    const market_id = req.market.market_id;
    const userid = req.user.userid;
  
    const schema = Joi.object({
        sizeid: Joi.number().integer().required(),
        length: Joi.number().required(),
        width: Joi.number().required(),
        unitid: Joi.number().integer().required(),
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
  
    // PROCEEDING TOWARDS UPDATING size ---------
    let updatesizeQry = `UPDATE glass_sizes SET
     length = $1,
     width =  $2,
     unitid = $3  
     WHERE 
     id = $4 
     returning *;`

    try {
      const updatedsize = (await queryDB(updatesizeQry, [body.length, body.width, body.unitid, body.sizeid])).rows[0]
      if(updatedsize){
          res
          .status(200)
          .json({
            success: true,
            message: "size updated successfully",
            data:  updatedsize,
          });
      }else{
          res
          .status(200)
          .json({
            success: false,
            message: "problem in updating size",
            data:  updatedsize,
          });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "updating error", error: error });
    }
  }),
  
 deletesize : asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const companyid = req.company.companyid;
    const market_id = req.market.market_id;
    const userid = req.user.userid;
  
    const schema = Joi.object({
      sizeid:  Joi.number().integer().required(),
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
  
    // PROCEEDING TOWARDS UPDATING size ---------
    let deletesizeQry = `DELETE FROM glass_sizes WHERE id = $1 returning *;`
    try {
      const deletedsize = (await queryDB(deletesizeQry, [body.sizeid])).rows[0]
      if(deletedsize){
          res
          .status(200)
          .json({
            success: true,
            message: "size deleted successfully",
            data: deletedsize,
          });
      }else{
          res
          .status(200)
          .json({
            success: false,
            message: "problem in deleting size",
            data: deletedsize,
          });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "deleting error", error: error });
    }
  }),

 getAllsize : asyncHandler(async (req, res, next) => {
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
  
    // PROCEEDING TOWARDS UPDATING size ---------
    let getsizeQry = `SELECT gs.id, gs.length, gs.width, gs.unitid, ui.unit
    FROM glass_sizes gs
    JOIN unitinfo ui ON gs.unitid = ui.id
    WHERE gs.market_id = $1;`

    try {
      const allsizes = (await queryDB(getsizeQry, [body.market_id])).rows
      if(allsizes){
          res
          .status(200)
          .json({
            success: true,
            message: "request successfully",
            data: allsizes,
          });
      }else{
          res
          .status(200)
          .json({
            success: false,
            message: "problem in getting size",
            data: allsizes,
          });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "updating error", error: error });
    }
  }),   

}



export { sizeApi };