import { asyncHandler } from "../../../middleware/asynchandler.mjs";
import { queryDB } from "../../../db.mjs";
import bcrypt from "bcrypt";
import Joi from "joi";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const colorApi = {

 addcolor : asyncHandler(async (req, res, next) => {
  // BODY VALIDATION
   const companyid = req.company.companyid;
   const market_id = req.market.market_id;
   const userid = req.user.userid;

   const schema = Joi.object({

   color: Joi.string().required(),
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

  // PROCEEDING TOWARDS ADDING color ---------
  let addcolorqry = `INSERT INTO glass_colors ( color, market_id) VALUES ($1, $2) returning * ;`
  try {
    const addedcolor = (await queryDB(addcolorqry, [body.color, body.market_id])).rows[0]
    if(addedcolor){
        res
        .status(200)
        .json({
          success: true,
          message: "color added successfully",
          data: addedcolor,
        });
    }else{
        res
        .status(200)
        .json({
          success: false,
          message: "problem in creating new color",
          data: addedcolor,
        });
    }
  } catch (error) {
    return res
      .status(200)
      .json({ success: false, message: "creating error", error: error });
  }
}),

 updatecolor : asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const companyid = req.company.companyid;
    const market_id = req.market.market_id;
    const userid = req.user.userid;
  
    const schema = Joi.object({
        colorid: Joi.number().integer().required(),
        color: Joi.string().required(),
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
  
    // PROCEEDING TOWARDS UPDATING color ---------
    let updatecolorQry = `UPDATE glass_colors SET color = $1 WHERE id = $2 returning *;`

    try {
      const updatedcolor = (await queryDB(updatecolorQry, [ body.color, body.colorid])).rows[0]
      if(updatedcolor){
          res
          .status(200)
          .json({
            success: true,
            message: "color updated successfully",
            data:  updatedcolor,
          });
      }else{
          res
          .status(200)
          .json({
            success: false,
            message: "problem in updating color",
            data:  updatedcolor,
          });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "updating error", error: error });
    }
  }),
  
 deletecolor : asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const companyid = req.company.companyid;
    const market_id = req.market.market_id;
    const userid = req.user.userid;
  
    const schema = Joi.object({
      colorid:  Joi.number().integer().required(),
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
  
    // PROCEEDING TOWARDS UPDATING color ---------
    let deletecolorQry = `DELETE FROM glass_colors WHERE id = $1 returning *;`
    try {
      const deletedcolor = (await queryDB(deletecolorQry, [body.colorid])).rows[0]
      if(deletedcolor){
          res
          .status(200)
          .json({
            success: true,
            message: "color deleted successfully",
            data: deletedcolor,
          });
      }else{
          res
          .status(200)
          .json({
            success: false,
            message: "problem in deleting color",
            data: deletedcolor,
          });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "deleting error", error: error });
    }
  }),

 getAllcolor : asyncHandler(async (req, res, next) => {
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
  
    // PROCEEDING TOWARDS UPDATING color ---------
    let getcolorQry = `select * FROM glass_colors WHERE market_id = $1;`

    try {
      const allcolors = (await queryDB(getcolorQry, [body.market_id])).rows
      if(allcolors){
          res
          .status(200)
          .json({
            success: true,
            message: "request successfully",
            data: allcolors,
          });
      }else{
          res
          .status(200)
          .json({
            success: false,
            message: "problem in getting color",
            data: allcolors,
          });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "updating error", error: error });
    }
  }),   

}



export { colorApi };