import { asyncHandler } from "../../../middleware/asynchandler.mjs";
import { queryDB } from "../../../db.mjs";
import Joi from "joi";

const positionApi = {
    addPosition: asyncHandler(async (req, res, next) => {
        const market_id = req.market.market_id;
        // BODY VALIDATION
        const schema = Joi.object({
            position_name: Joi.string().required(),
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

        // PROCEEDING TOWARDS ADDING POSITION
        const addPositionQuery = `
            INSERT INTO positions (position_name, market_id)
            VALUES ($1, $2)
            RETURNING *;`;

        try {
            const addedPosition = (await queryDB(addPositionQuery, [value.position_name, value.market_id])).rows[0];
            if (addedPosition) {
                res.status(200).json({
                    success: true,
                    message: "Position added successfully",
                    data: addedPosition,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in creating new position",
                    data: addedPosition,
                });
            }
        } catch (error) {
            return res.status(200).json({ success: false, message: "Creating error", error: error });
        }
    }),

    updatePosition: asyncHandler(async (req, res, next) => {
        // BODY VALIDATION
        const schema = Joi.object({
            position_id: Joi.number().integer().required(),
            position_name: Joi.string().required(),
          
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

        // PROCEEDING TOWARDS UPDATING POSITION
        const updatePositionQuery = `
            UPDATE positions
            SET position_name = $1
            WHERE id = $2 
            RETURNING *;`;

        try {
            const updatedPosition = (await queryDB(updatePositionQuery, [value.position_name, value.position_id])).rows[0];
            if (updatedPosition) {
                res.status(200).json({
                    success: true,
                    message: "Position updated successfully",
                    data: updatedPosition,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in updating position",
                    data: updatedPosition,
                });
            }
        } catch (error) {
            return res.status(200).json({ success: false, message: "Updating error", error: error });
        }
    }),

    deletePosition: asyncHandler(async (req, res, next) => {
        // BODY VALIDATION
        const schema = Joi.object({
            position_id: Joi.number().integer().required()
           
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

        // PROCEEDING TOWARDS DELETING POSITION
        const deletePositionQuery = `
            DELETE FROM positions
            WHERE id = $1 
            RETURNING *;`;

        try {
            const deletedPosition = (await queryDB(deletePositionQuery, [value.position_id])).rows[0];
            if (deletedPosition) {
                res.status(200).json({
                    success: true,
                    message: "Position deleted successfully",
                    data: deletedPosition,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in deleting position",
                    data: deletedPosition,
                });
            }
        } catch (error) {
            return res.status(200).json({ success: false, message: "Deleting error", error: error });
        }
    }),

    getAllPositions: asyncHandler(async (req, res, next) => {
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
        // PROCEEDING TOWARDS FETCHING POSITIONS
        const getPositionQuery = `
            SELECT * FROM positions WHERE market_id = $1;`;

        try {
            const allPositions = (await queryDB(getPositionQuery, [value.market_id])).rows;
            if (allPositions) {
                res.status(200).json({
                    success: true,
                    message: "Request successful",
                    data: allPositions,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in getting positions",
                    data: allPositions,
                });
            }
        } catch (error) {
            return res.status(200).json({ success: false, message: "Fetching error", error: error });
        }
    })
};

export { positionApi };
