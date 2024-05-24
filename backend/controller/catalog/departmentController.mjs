import { asyncHandler } from "../../middleware/asynchandler.mjs";
import { queryDB } from "../../db.mjs";
import Joi from "joi";

const departmentApi = {
    addDepartment: asyncHandler(async (req, res, next) => {
        const market_id = req.market.market_id;

        // BODY VALIDATION
        const schema = Joi.object({
            department_name: Joi.string().required(),
            market_id: Joi.number().integer().required(),
        });

        let body = {
            ...req.body,
            market_id
        }

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

        // PROCEEDING TOWARDS ADDING DEPARTMENT
        const addDepartmentQuery = `
            INSERT INTO departments (department_name, market_id)
            VALUES ($1, $2)
            RETURNING *;`;

        try {
            const addedDepartment = (await queryDB(addDepartmentQuery, [value.department_name, value.market_id])).rows[0];
            if (addedDepartment) {
                res.status(200).json({
                    success: true,
                    message: "Department added successfully",
                    data: addedDepartment,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in creating new department",
                    data: addedDepartment,
                });
            }
        } catch (error) {
            return res.status(200).json({ success: false, message: "Creating error", error: error });
        }
    }),

    updateDepartment: asyncHandler(async (req, res, next) => {

        // BODY VALIDATION
        const schema = Joi.object({
            department_id: Joi.number().integer().required(),
            department_name: Joi.string().required(),
            
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

        // PROCEEDING TOWARDS UPDATING DEPARTMENT
        const updateDepartmentQuery = `
            UPDATE departments
            SET department_name = $1
            WHERE id = $2 
            RETURNING *;`;

        try {
            const updatedDepartment = (await queryDB(updateDepartmentQuery, [value.department_name, value.department_id])).rows[0];
            if (updatedDepartment) {
                res.status(200).json({
                    success: true,
                    message: "Department updated successfully",
                    data: updatedDepartment,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in updating department",
                    data: updatedDepartment,
                });
            }
        } catch (error) {
            return res.status(200).json({ success: false, message: "Updating error", error: error });
        }
    }),

    deleteDepartment: asyncHandler(async (req, res, next) => {
        // BODY VALIDATION
        const schema = Joi.object({
            department_id: Joi.number().integer().required(),
           
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

        // PROCEEDING TOWARDS DELETING DEPARTMENT
        const deleteDepartmentQuery = `
            DELETE FROM departments
            WHERE id = $1 
            RETURNING *;`;

        try {
            const deletedDepartment = (await queryDB(deleteDepartmentQuery, [value.department_id])).rows[0];
            if (deletedDepartment) {
                res.status(200).json({
                    success: true,
                    message: "Department deleted successfully",
                    data: deletedDepartment,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in deleting department",
                    data: deletedDepartment,
                });
            }
        } catch (error) {
            return res.status(200).json({ success: false, message: "Deleting error", error: error });
        }
    }),

    getAllDepartments: asyncHandler(async (req, res, next) => {
        const market_id = req.market.market_id;
         // BODY VALIDATION
         const schema = Joi.object({
            
            market_id: Joi.number().integer().required(),
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
                error: error.details,
            });
        }
        // PROCEEDING TOWARDS FETCHING DEPARTMENTS
        const getDepartmentQuery = `
            SELECT * FROM departments WHERE market_id = $1;`;

        try {
            const allDepartments = (await queryDB(getDepartmentQuery, [value.market_id])).rows;
            if (allDepartments) {
                res.status(200).json({
                    success: true,
                    message: "Request successful",
                    data: allDepartments,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in getting departments",
                    data: allDepartments,
                });
            }
        } catch (error) {
            return res.status(200).json({ success: false, message: "Fetching error", error: error });
        }
    })
};

export { departmentApi };
