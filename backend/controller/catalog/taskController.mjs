import { asyncHandler } from "../../middleware/asynchandler.mjs";
import { queryDB } from "../../db.mjs";
import Joi from "joi";

const taskApi = {

    addTask: asyncHandler(async (req, res, next) => {

        const schema = Joi.object({
            
            task_name: Joi.string().required(),
            description: Joi.string().allow(null),
            min_personnel: Joi.number().integer().required(),
            measured_per_unit_id: Joi.number().integer().required(),
            completion_time_per_unit: Joi.number().integer().required(),
            marketid: Joi.number().integer().required()
            
        });

        const { error, value } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: error.details
            });
        }

        const { task_name, description, min_personnel, measured_per_unit_id, completion_time_per_unit, marketid } = value;

        const addTaskQuery = `
            INSERT INTO tasks (task_name, description, min_personnel, measured_per_unit_id, completion_time_per_unit, market_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;`;

        try {
            const addedTask = (await queryDB(addTaskQuery, [task_name, description, min_personnel, measured_per_unit_id, completion_time_per_unit, marketid])).rows[0];

            res.status(200).json({
                success: true,
                message: "Task added successfully",
                data: addedTask,
            });
        } catch (error) {
            console.error("Error adding task:", error);
            res.status(500).json({
                success: false,
                message: "Error adding task",
                error: error.message,
            });
        }
    }),

    updateTask: asyncHandler(async (req, res, next) => {
        const schema = Joi.object({
            task_id: Joi.number().integer().required(),
            task_name: Joi.string().required(),
            description: Joi.string().allow(null),
            min_personnel: Joi.number().integer().required(),
            measured_per_unit_id: Joi.number().integer().required(),
            completion_time_per_unit: Joi.number().integer().required()
        });

        const { error, value } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: error.details,
            });
        }

        const { task_id, task_name, description, min_personnel, measured_per_unit_id, completion_time_per_unit } = value;

        const updateTaskQuery = `
            UPDATE tasks
            SET
                task_name = $1,
                description = $2,
                min_personnel = $3,
                measured_per_unit_id = $4,
                completion_time_per_unit = $5
            WHERE
                id = $6
            RETURNING *;`;

        try {
            const updatedTask = (await queryDB(updateTaskQuery, [task_name, description, min_personnel, measured_per_unit_id, completion_time_per_unit, task_id])).rows[0];

            res.status(200).json({
                success: true,
                message: "Task updated successfully",
                data: updatedTask,
            });
        } catch (error) {
            console.error("Error updating task:", error);
            res.status(500).json({
                success: false,
                message: "Error updating task",
                error: error.message,
            });
        }
    }),

    deleteTask: asyncHandler(async (req, res, next) => {
        const schema = Joi.object({
            task_id: Joi.number().integer().required(),
        });

        const { error, value } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: error.details,
            });
        }

        const { task_id } = value;

        const deleteTaskQuery = `
            DELETE FROM tasks
            WHERE
                id = $1
            RETURNING *;`;

        try {
            const deletedTask = (await queryDB(deleteTaskQuery, [task_id])).rows[0];

            res.status(200).json({
                success: true,
                message: "Task deleted successfully",
                data: deletedTask,
            });
        } catch (error) {
            console.error("Error deleting task:", error);
            res.status(500).json({
                success: false,
                message: "Error deleting task",
                error: error.message,
            });
        }
    }),

    getAllTasks: asyncHandler(async (req, res, next) => {

        const schema = Joi.object({
            marketid: Joi.number().integer().required(),
        });

        const { error, value } = schema.validate(req.query);

        if (error) {
            console.log(error.details);
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: error.details,
            });
        }

        const {marketid} = value;

        const getAllTasksQuery = `
            SELECT * FROM tasks where market_id = $1;`;

        try {
            
            const allTasks = (await queryDB(getAllTasksQuery,[marketid])).rows;

            res.status(200).json({
                success: true,
                message: "All tasks retrieved successfully",
                data: allTasks,
            });

        } catch (error) {

            console.error("Error getting all tasks:", error);

            res.status(500).json({
                success: false,
                message: "Error getting all tasks",
                error: error.message,
            });

        }
    }),
};

export { taskApi };
