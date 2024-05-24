import { asyncHandler } from "../../../middleware/asynchandler.mjs";
import { queryDB } from "../../../db.mjs";
import Joi from "joi";

const otherProductApi = {
    addOtherProduct: asyncHandler(async (req, res, next) => {
        const market_id = req.market.market_id;
        
        // BODY VALIDATION
        const schema = Joi.object({
            name: Joi.string().required(),
            unit: Joi.string().required(),
            unitid: Joi.number().integer().required(),
            stock: Joi.number().required(),
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

        // PROCEEDING TOWARDS ADDING OTHER PRODUCT
        const addProductQuery = `
            INSERT INTO other_products (name, unitid, stock, market_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *;`;

        try {
            const addedProduct = (await queryDB(addProductQuery, [value.name, value.unitid, value.stock, value.market_id])).rows[0];
            if (addedProduct) {
                res.status(200).json({
                    success: true,
                    message: "Other product added successfully",
                    data: addedProduct,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in creating new other product",
                    data: addedProduct,
                });
            }
        } catch (error) {
            return res.status(200).json({ success: false, message: "Creating error", error: error });
        }
    }),

    updateOtherProduct: asyncHandler(async (req, res, next) => {
        // BODY VALIDATION
        const schema = Joi.object({
            product_id: Joi.number().integer().required(),
            name: Joi.string().required(),
            unit: Joi.string().required(),
            unitid: Joi.number().integer().required(),
            stock: Joi.number().required()
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

        // PROCEEDING TOWARDS UPDATING OTHER PRODUCT
        const updateProductQuery = `
            UPDATE other_products
            SET name = $1, unitid = $2, stock = $3
            WHERE id = $4
            RETURNING *;`;

        try {
            const updatedProduct = (await queryDB(updateProductQuery, [value.name, value.unitid, value.stock, value.product_id])).rows[0];
            if (updatedProduct) {
                res.status(200).json({
                    success: true,
                    message: "Other product updated successfully",
                    data: updatedProduct,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in updating other product",
                    data: updatedProduct,
                });
            }
        } catch (error) {
            return res.status(200).json({ success: false, message: "Updating error", error: error });
        }
    }),

    deleteOtherProduct: asyncHandler(async (req, res, next) => {
        // BODY VALIDATION
        const schema = Joi.object({
            product_id: Joi.number().integer().required(),
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

        // PROCEEDING TOWARDS DELETING OTHER PRODUCT
        const deleteProductQuery = `
            DELETE FROM other_products WHERE id = $1
            RETURNING *;`;

        try {
            const deletedProduct = (await queryDB(deleteProductQuery, [value.product_id])).rows[0];
            if (deletedProduct) {
                res.status(200).json({
                    success: true,
                    message: "Other product deleted successfully",
                    data: deletedProduct
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in deleting other product",
                    data: deletedProduct
                });
            }
        } catch (error) {
            return res.status(200).json({ success: false, message: "Deleting error", error: error });
        }
    }),

    getAllOtherProducts: asyncHandler(async (req, res, next) => {
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

        // PROCEEDING TOWARDS FETCHING OTHER PRODUCTS
        const getProductQuery = `
        SELECT 
            op.id,
            op.name,
            op.unitid,
            op.stock,
            u.unit
        FROM 
            other_products op
        LEFT JOIN 
            unitinfo u ON op.unitid = u.id    
        WHERE 
            op.market_id=$1;`;

        try {
            const allProducts = (await queryDB(getProductQuery, [value.market_id])).rows;
            if (allProducts) {
                res.status(200).json({
                    success: true,
                    message: "Other products retrieved successfully",
                    data: allProducts,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in getting other products",
                    data: allProducts,
                });
            }
        } catch (error) {
            return res.status(200).json({ success: false, message: "Fetching error", error: error });
        }
    })
};

export { otherProductApi };
