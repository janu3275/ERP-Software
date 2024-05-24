import { asyncHandler } from "../../../middleware/asynchandler.mjs";
import { queryDB } from "../../../db.mjs";
import bcrypt from "bcrypt";
import Joi from "joi";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const thicknessApi = {
  addthickness: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const companyid = req.company.companyid;
    const market_id = req.market.market_id;
    const userid = req.user.userid;

    const schema = Joi.object({
      thickness: Joi.number().required(),
      unitid: Joi.number().integer().required(),
      market_id: Joi.number().integer().required(),
      companyid: Joi.number().integer().required(),
      userid: Joi.number().integer().required(),
    });

    let body = {
      ...req.body,
      market_id,
      companyid,
      userid,
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

    // PROCEEDING TOWARDS ADDING thickness ---------
    let addthicknessqry = `INSERT INTO glass_thickness ( thickness, unitid, market_id ) VALUES ($1, $2, $3) returning * ;`;
    try {
      const addedthickness = (
        await queryDB(addthicknessqry, [
          body.thickness,
          body.unitid,
          body.market_id,
        ])
      ).rows[0];
      if (addedthickness) {
        res.status(200).json({
          success: true,
          message: "thickness added successfully",
          data: addedthickness,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "problem in creating new thickness",
          data: addedthickness,
        });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "creating error", error: error });
    }
  }),

  updatethickness: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const companyid = req.company.companyid;
    const market_id = req.market.market_id;
    const userid = req.user.userid;

    const schema = Joi.object({
      thicknessid: Joi.number().integer().required(),
      thickness: Joi.number().required(),
      unitid: Joi.number().integer().required(),
      market_id: Joi.number().integer().required(),
      companyid: Joi.number().integer().required(),
      userid: Joi.number().integer().required(),
    });

    let body = {
      ...req.body,
      companyid,
      market_id,
      userid,
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

    // PROCEEDING TOWARDS UPDATING thickness ---------

    let updatethicknessQry = `UPDATE glass_thickness SET
     thickness = $1,
     unitid = $2  
     WHERE 
     id = $3
     returning *;`;

    try {
      const updatedthickness = (
        await queryDB(updatethicknessQry, [
          body.thickness,
          body.unitid,
          body.thicknessid,
        ])
      ).rows[0];
      if (updatedthickness) {
        res.status(200).json({
          success: true,
          message: "thickness updated successfully",
          data: updatedthickness,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "problem in updating thickness",
          data: updatedthickness,
        });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "updating error", error: error });
    }
  }),

  deletethickness: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const companyid = req.company.companyid;
    const market_id = req.market.market_id;
    const userid = req.user.userid;

    const schema = Joi.object({
      thicknessid: Joi.number().integer().required(),
      market_id: Joi.number().integer().required(),
      companyid: Joi.number().integer().required(),
      userid: Joi.number().integer().required(),
    });

    let body = {
      ...req.query,
      companyid,
      market_id,
      userid,
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

    // PROCEEDING TOWARDS UPDATING thickness ---------
    let deletethicknessQry = `DELETE FROM glass_thickness WHERE id = $1 returning *;`;
    try {
      const deletedthickness = (
        await queryDB(deletethicknessQry, [body.thicknessid])
      ).rows[0];
      if (deletedthickness) {
        res.status(200).json({
          success: true,
          message: "thickness deleted successfully",
          data: deletedthickness,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "problem in deleting thickness",
          data: deletedthickness,
        });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "deleting error", error: error });
    }
  }),

  getAllthickness: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION

    const companyid = req.company.companyid;
    const market_id = req.market.market_id;
    const userid = req.user.userid;

    const schema = Joi.object({
      market_id: Joi.number().integer().required(),
      companyid: Joi.number().integer().required(),
      userid: Joi.number().integer().required(),
    });

    let body = {
      ...req.query,
      companyid,
      market_id,
      userid,
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

    // PROCEEDING TOWARDS UPDATING thickness ---------
    let getthicknessQry = `SELECT gt.id, gt.thickness, gt.unitid, ui.unit
    FROM glass_thickness gt
    JOIN unitinfo ui ON gt.unitid = ui.id
    WHERE gt.market_id = $1;`;

    try {
      const allthickness = (await queryDB(getthicknessQry, [body.market_id]))
        .rows;
      if (allthickness) {
        res.status(200).json({
          success: true,
          message: "request successfully",
          data: allthickness,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "problem in getting thickness",
          data: allthickness,
        });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "updating error", error: error });
    }
  }),
};

export { thicknessApi };
