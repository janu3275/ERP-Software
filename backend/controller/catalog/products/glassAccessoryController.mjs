import { asyncHandler } from "../../../middleware/asynchandler.mjs";
import { queryDB } from "../../../db.mjs";
import Joi from "joi";

const glassAccessoryApi = {
    addGlassAccessory: asyncHandler(async (req, res, next) => {
        
        const market_id = req.market.market_id;
        
        // BODY VALIDATION
        const schema = Joi.object({
            name: Joi.string().required(),
            unitid: Joi.number().integer().required(),
            unit: Joi.string().required(),
            unit_selling_price: Joi.number().required(),
            stock: Joi.number().integer().required(),
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

        // PROCEEDING TOWARDS ADDING GLASS ACCESSORY
        const addAccessoryQuery = `
            INSERT INTO glass_accessory ( name, unitid, unit_selling_price, stock, market_id )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;`;

        try {
            const addedAccessory = (await queryDB(addAccessoryQuery, [value.name, value.unitid, value.unit_selling_price, value.stock, value.market_id])).rows[0];
            if (addedAccessory) {
                res.status(200).json({
                    success: true,
                    message: "Glass accessory added successfully",
                    data: addedAccessory,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in creating new glass accessory",
                    data: addedAccessory,
                });
            }
        } catch (error) {
            return res.status(200).json({ success: false, message: "Creating error", error: error });
        }
    }),

    updateGlassAccessory: asyncHandler(async (req, res, next) => {

        // BODY VALIDATION
        const schema = Joi.object({
            accessory_id: Joi.number().integer().required(),
            name: Joi.string().required(),
            unitid: Joi.number().integer().required(),
            unit: Joi.string().required(),
            unit_selling_price: Joi.number().required(),
            stock: Joi.number().integer().required()
            
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

        // PROCEEDING TOWARDS UPDATING GLASS ACCESSORY
        const updateAccessoryQuery = `
            UPDATE glass_accessory
            SET name = $1, unitid = $2, unit_selling_price = $3, stock = $4
            WHERE id = $5
            RETURNING *;`;

        try {
            const updatedAccessory = (await queryDB(updateAccessoryQuery, [value.name, value.unitid, value.unit_selling_price, value.stock, value.accessory_id])).rows[0];
            if (updatedAccessory) {
                res.status(200).json({
                    success: true,
                    message: "Glass accessory updated successfully",
                    data: updatedAccessory,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in updating glass accessory",
                    data: updatedAccessory,
                });
            }
        } catch (error) {
            return res.status(200).json({ success: false, message: "Updating error", error: error });
        }
    }),

    deleteGlassAccessory: asyncHandler(async (req, res, next) => {
        // BODY VALIDATION
        const schema = Joi.object({
            accessory_id: Joi.number().integer().required(),
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

        // PROCEEDING TOWARDS DELETING GLASS ACCESSORY
        const deleteAccessoryQuery = `
            DELETE FROM glass_accessory WHERE id = $1
            RETURNING *;`;

        try {
            const deletedAccessory = (await queryDB(deleteAccessoryQuery, [value.accessory_id])).rows[0];
            if (deletedAccessory) {
                res.status(200).json({
                    success: true,
                    message: "Glass accessory deleted successfully",
                    data: deletedAccessory
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in deleting glass accessory",
                    data: deletedAccessory
                });
            }
        } catch (error) {
            return res.status(200).json({ success: false, message: "Deleting error", error: error });
        }
    }),

    getAllGlassAccessory: asyncHandler(async (req, res, next) => {
        
        const market_id = req.market.market_id;
       
        // BODY VALIDATION
        const schema = Joi.object({
            market_id: Joi.number().integer().required()
        });

        let body = {
            market_id
        }
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

        // PROCEEDING TOWARDS FETCHING GLASS ACCESSORIES
        const getAccessoryQuery = `
        SELECT 
        ga.id,
        ga.name,
        ga.unitid,
        ga.unit_selling_price,
        ga.stock,
        ga.market_id,
        u.unit
    FROM 
        glass_accessory ga
    LEFT JOIN 
        unitinfo u ON ga.unitid = u.id
    WHERE 
       ga.market_id=$1;
    `;

        try {
            const allAccessories = (await queryDB(getAccessoryQuery, [value.market_id])).rows;
            if (allAccessories) {
                res.status(200).json({
                    success: true,
                    message: "Glass accessories retrieved successfully",
                    data: allAccessories,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in getting glass accessories",
                    data: allAccessories,
                });
            }
        } catch (error) {
            return res.status(200).json({ success: false, message: "Fetching error", error: error });
        }
    })
};

export { glassAccessoryApi };
