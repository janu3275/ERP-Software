import { asyncHandler } from "../../middleware/asynchandler.mjs";
import { queryDB } from "../../db.mjs";
import bcrypt from "bcrypt";
import Joi from "joi";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const unitApi = {

 addUnit : asyncHandler(async (req, res, next) => {
  // BODY VALIDATION
  
   const market_id = req.market.market_id;


   const schema = Joi.object({

   unit: Joi.string().required(),
   market_id: Joi.number().integer().required(),
  

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

  // PROCEEDING TOWARDS ADDING Unit ---------
  let addUnitqry = `INSERT INTO unitinfo ( unit, market_id) VALUES ($1, $2) returning * ;`
  try {
    const addedUnit = (await queryDB(addUnitqry, [body.unit, body.market_id])).rows[0]
    if(addedUnit){
        res
        .status(200)
        .json({
          success: true,
          message: "Unit added successfully",
          data: addedUnit,
        });
    }else{
        res
        .status(200)
        .json({
          success: false,
          message: "problem in creating new Unit",
          data: addedUnit,
        });
    }
  } catch (error) {
    return res
      .status(200)
      .json({ success: false, message: "creating error", error: error });
  }
}),

 updateUnit : asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const companyid = req.company.companyid;
    const market_id = req.market.market_id;
    const userid = req.user.userid;
  
    const schema = Joi.object({
        unitid: Joi.number().integer().required(),
        unit: Joi.string().required(),
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
  
    // PROCEEDING TOWARDS UPDATING UNIT ---------
    let updateUnitQry = `UPDATE unitinfo SET unit = $1 WHERE id = $2 returning *;`

    try {
      const updatedUnit = (await queryDB(updateUnitQry, [ body.unit, body.unitid])).rows[0]
      if(updatedUnit){
          res
          .status(200)
          .json({
            success: true,
            message: "Unit updated successfully",
            data:  updatedUnit,
          });
      }else{
          res
          .status(200)
          .json({
            success: false,
            message: "problem in updating Unit",
            data:  updatedUnit,
          });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "updating error", error: error });
    }
  }),
  
 deleteUnit : asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const companyid = req.company.companyid;
    const market_id = req.market.market_id;
    const userid = req.user.userid;
  
    const schema = Joi.object({
      unitid:  Joi.number().integer().required(),
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
  
    // PROCEEDING TOWARDS UPDATING Unit ---------
    let deleteUnitQry = `DELETE FROM unitinfo WHERE id = $1 returning *;`
    try {
      const deletedUnit = (await queryDB(deleteUnitQry, [body.unitid])).rows[0]
      if(deletedUnit){
          res
          .status(200)
          .json({
            success: true,
            message: "Unit deleted successfully",
            data: deletedUnit,
          });
      }else{
          res
          .status(200)
          .json({
            success: false,
            message: "problem in deleting Unit",
            data: deletedUnit,
          });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "deleting error", error: error });
    }
  }),

 getAllUnit : asyncHandler(async (req, res, next) => {
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
  
    // PROCEEDING TOWARDS UPDATING Unit ---------
    let getUnitQry = `select * FROM unitinfo WHERE market_id = $1;`

    try {
      const allUnits = (await queryDB(getUnitQry, [body.market_id])).rows
      if(allUnits){
          res
          .status(200)
          .json({
            success: true,
            message: "request successfully",
            data: allUnits,
          });
      }else{
          res
          .status(200)
          .json({
            success: false,
            message: "problem in getting Unit",
            data: allUnits,
          });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "updating error", error: error });
    }
  }),   

}



export { unitApi };