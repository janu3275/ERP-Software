import { asyncHandler } from "../../middleware/asynchandler.mjs";
import { queryDB } from "../../db.mjs";
import Joi from "joi";

const emiTypeApi = {
    addEmiType: asyncHandler(async (req, res, next) => {
        const market_id = req.market.market_id;
        // BODY VALIDATION
        const schema = Joi.object({
            purpose: Joi.string().required(),
            market_id: Joi.number().integer().required()
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

        // PROCEEDING TOWARDS ADDING EMI TYPE
        const addEmiTypeQuery = `
            INSERT INTO emi_types (purpose, market_id)
            VALUES ($1, $2)
            RETURNING *;`;

        try {
            const addedEmiType = (await queryDB(addEmiTypeQuery, [value.purpose, value.market_id])).rows[0];
            if (addedEmiType) {
                res.status(200).json({
                    success: true,
                    message: "EMI Type added successfully",
                    data: addedEmiType,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in creating new EMI Type",
                    data: addedEmiType,
                });
            }
        } catch (error) {
            return res.status(200).json({ success: false, message: "Creating error", error: error });
        }
    }),

    updateEmiType: asyncHandler(async (req, res, next) => {
        // BODY VALIDATION
        const schema = Joi.object({
            emi_type_id: Joi.number().integer().required(),
            purpose: Joi.string().required(),
          
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

        // PROCEEDING TOWARDS UPDATING EMI TYPE
        const updateEmiTypeQuery = `
            UPDATE emi_types
            SET purpose = $1
            WHERE id = $2 
            RETURNING *;`;

        try {
            const updatedEmiType = (await queryDB(updateEmiTypeQuery, [value.purpose, value.emi_type_id])).rows[0];
            if (updatedEmiType) {
                res.status(200).json({
                    success: true,
                    message: "EMI Type updated successfully",
                    data: updatedEmiType,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in updating EMI Type",
                    data: updatedEmiType,
                });
            }
        } catch (error) {
            return res.status(200).json({ success: false, message: "Updating error", error: error });
        }
    }),

    deleteEmiType: asyncHandler(async (req, res, next) => {
        // BODY VALIDATION
        const schema = Joi.object({
            emi_type_id: Joi.number().integer().required()
           
        });

        let body = req.query;
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

        // PROCEEDING TOWARDS DELETING EMI TYPE
        const deleteEmiTypeQuery = `
            DELETE FROM emi_types
            WHERE id = $1 
            RETURNING *;`;

        try {
            const deletedEmiType = (await queryDB(deleteEmiTypeQuery, [value.emi_type_id])).rows[0];
            if (deletedEmiType) {
                res.status(200).json({
                    success: true,
                    message: "EMI Type deleted successfully",
                    data: deletedEmiType,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in deleting EMI Type",
                    data: deletedEmiType,
                });
            }
        } catch (error) {
            return res.status(200).json({ success: false, message: "Deleting error", error: error });
        }
    }),

    getAllEmiTypes: asyncHandler(async (req, res, next) => {
        const market_id = req.market.market_id;
        // BODY VALIDATION
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
            return res.status(200).json({
                success: false,
                message: "Validation error",
                error: error.details,
            });
        }
        // PROCEEDING TOWARDS FETCHING EMI TYPES
        const getEmiTypeQuery = `
            SELECT * FROM emi_types WHERE market_id = $1;`;

        try {
            const allEmiTypes = (await queryDB(getEmiTypeQuery, [value.market_id])).rows;
            if (allEmiTypes) {
                res.status(200).json({
                    success: true,
                    message: "Request successful",
                    data: allEmiTypes,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in getting EMI Types",
                    data: allEmiTypes,
                });
            }
        } catch (error) {
            return res.status(200).json({ success: false, message: "Fetching error", error: error });
        }
    })
};

export { emiTypeApi };
