import { asyncHandler } from "../../../middleware/asynchandler.mjs";
import { queryDB } from "../../../db.mjs";
import bcrypt from "bcrypt";
import Joi from "joi";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const glassTypeApi = {

 addglasstype : asyncHandler(async (req, res, next) => {
  // BODY VALIDATION
  
   const market_id = req.market.market_id;
  

   const schema = Joi.object({

   glass_type: Joi.string().required(),
   market_id: Joi.number().integer().required()
  

});

let body = {
  ...req.body,
  market_id,
 
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

  // PROCEEDING TOWARDS ADDING glass_type ---------
  let addglasstypeqry = `INSERT INTO glass_type ( glass_type, market_id) VALUES ($1, $2) returning * ;`
  try {
    const addedglass_type = (await queryDB(addglasstypeqry, [value.glass_type, value.market_id])).rows[0]
    if(addedglass_type){
        res
        .status(200)
        .json({
          success: true,
          message: "glass_type added successfully",
          data: addedglass_type,
        });
    }else{
        res
        .status(200)
        .json({
          success: false,
          message: "problem in creating new glass_type",
          data: addedglass_type,
        });
    }
  } catch (error) {
    return res
      .status(200)
      .json({ success: false, message: "creating error", error: error });
  }
}),

 updateglass_type : asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
   
  
    const schema = Joi.object({
        glassTypeid: Joi.number().integer().required(),
        glass_type: Joi.string().required(),
      
    });
   
    let body = {
      ...req.body
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
  
    // PROCEEDING TOWARDS UPDATING glass_type ---------
    let updateglasstypeQry = `UPDATE glass_type SET glass_type = $1 WHERE id = $2 returning *;`

    try {
      const updatedglass_type = (await queryDB(updateglasstypeQry, [value.glass_type, value.glassTypeid])).rows[0]
      if(updatedglass_type){
          res
          .status(200)
          .json({
            success: true,
            message: "glass_type updated successfully",
            data:  updatedglass_type,
          });
      }else{
          res
          .status(200)
          .json({
            success: false,
            message: "problem in updating glass_type",
            data:  updatedglass_type,
          });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "updating error", error: error });
    }
  }),
  
 deleteglass_type : asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
  
  
    const schema = Joi.object({
      glassTypeid:  Joi.number().integer().required(),
     
    });
   
    let body = {
      ...req.query,
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
  
    // PROCEEDING TOWARDS UPDATING glass_type ---------
    let deleteglassTypeQry = `DELETE FROM glass_type WHERE id = $1 returning *;`
    try {
      const deletedglass_type = (await queryDB(deleteglassTypeQry, [value.glassTypeid])).rows[0]
      if(deletedglass_type){
          res
          .status(200)
          .json({
            success: true,
            message: "glass_type deleted successfully",
            data: deletedglass_type,
          });
      }else{
          res
          .status(200)
          .json({
            success: false,
            message: "problem in deleting glass_type",
            data: deletedglass_type,
          });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "deleting error", error: error });
    }
  }),

 getAllglass_type : asyncHandler(async (req, res, next) => {
    // BODY VALIDATION


    const market_id = req.market.market_id;

    
    const schema = Joi.object({
      market_id: Joi.number().integer().required()
     
    });
   
    let body = {
      market_id
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
  
    // PROCEEDING TOWARDS UPDATING glass_type ---------
    let getglass_typeQry = `select * FROM glass_type WHERE market_id = $1;`

    try {
      const allglass_types = (await queryDB(getglass_typeQry, [value.market_id])).rows
      if(allglass_types){
          res
          .status(200)
          .json({
            success: true,
            message: "request successfully",
            data: allglass_types,
          });
      }else{
          res
          .status(200)
          .json({
            success: false,
            message: "problem in getting glass_type",
            data: allglass_types,
          });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "updating error", error: error });
    }
  }),   

}



export { glassTypeApi };