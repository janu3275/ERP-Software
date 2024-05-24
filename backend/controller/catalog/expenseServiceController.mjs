import { asyncHandler } from "../../middleware/asynchandler.mjs";
import { queryDB } from "../../db.mjs";
import Joi from "joi";

const expenseServiceTypeApi = {
    addExpenseServiceType: asyncHandler(async (req, res, next) => {
        const market_id = req.market.market_id;
        // BODY VALIDATION
        const schema = Joi.object({
            service_name: Joi.string().required(),
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

        // PROCEEDING TOWARDS ADDING EXPENSE SERVICE TYPE
        const addExpenseServiceTypeQuery = `
            INSERT INTO expense_service_types (service_name, market_id)
            VALUES ($1, $2)
            RETURNING *;`;

        try {
            const addedExpenseServiceType = (await queryDB(addExpenseServiceTypeQuery, [value.service_name, value.market_id])).rows[0];
            if (addedExpenseServiceType) {
                res.status(200).json({
                    success: true,
                    message: "Expense Service Type added successfully",
                    data: addedExpenseServiceType,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in creating new Expense Service Type",
                    data: addedExpenseServiceType,
                });
            }
        } catch (error) {
            return res.status(200).json({ success: false, message: "Creating error", error: error });
        }
    }),

    updateExpenseServiceType: asyncHandler(async (req, res, next) => {
        // BODY VALIDATION
        const schema = Joi.object({
            expense_service_type_id: Joi.number().integer().required(),
            service_name: Joi.string().required(),
          
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

        // PROCEEDING TOWARDS UPDATING EXPENSE SERVICE TYPE
        const updateExpenseServiceTypeQuery = `
            UPDATE expense_service_types
            SET service_name = $1
            WHERE id = $2 
            RETURNING *;`;

        try {
            const updatedExpenseServiceType = (await queryDB(updateExpenseServiceTypeQuery, [value.service_name, value.expense_service_type_id])).rows[0];
            if (updatedExpenseServiceType) {
                res.status(200).json({
                    success: true,
                    message: "Expense Service Type updated successfully",
                    data: updatedExpenseServiceType,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in updating Expense Service Type",
                    data: updatedExpenseServiceType,
                });
            }
        } catch (error) {
            return res.status(200).json({ success: false, message: "Updating error", error: error });
        }
    }),

    deleteExpenseServiceType: asyncHandler(async (req, res, next) => {
        // BODY VALIDATION
        const schema = Joi.object({
            expense_service_type_id: Joi.number().integer().required()
           
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

        // PROCEEDING TOWARDS DELETING EXPENSE SERVICE TYPE
        const deleteExpenseServiceTypeQuery = `
            DELETE FROM expense_service_types
            WHERE id = $1 
            RETURNING *;`;

        try {
            const deletedExpenseServiceType = (await queryDB(deleteExpenseServiceTypeQuery, [value.expense_service_type_id])).rows[0];
            if (deletedExpenseServiceType) {
                res.status(200).json({
                    success: true,
                    message: "Expense Service Type deleted successfully",
                    data: deletedExpenseServiceType,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in deleting Expense Service Type",
                    data: deletedExpenseServiceType,
                });
            }
        } catch (error) {
            return res.status(200).json({ success: false, message: "Deleting error", error: error });
        }
    }),

    getAllExpenseServiceTypes: asyncHandler(async (req, res, next) => {
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
        // PROCEEDING TOWARDS FETCHING EXPENSE SERVICE TYPES
        const getExpenseServiceTypeQuery = `
            SELECT * FROM expense_service_types WHERE market_id = $1;`;

        try {
            const allExpenseServiceTypes = (await queryDB(getExpenseServiceTypeQuery, [value.market_id])).rows;
            if (allExpenseServiceTypes) {
                res.status(200).json({
                    success: true,
                    message: "Request successful",
                    data: allExpenseServiceTypes,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in getting Expense Service Types",
                    data: allExpenseServiceTypes,
                });
            }
        } catch (error) {
            return res.status(200).json({ success: false, message: "Fetching error", error: error });
        }
    })
};

export { expenseServiceTypeApi };
