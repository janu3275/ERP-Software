// Import necessary modules
import { asyncHandler } from "../../../middleware/asynchandler.mjs";
import { queryDB } from "../../../db.mjs";
import Joi from "joi";

// Define the measurement service API object
const measurementServiceApi = {
    // Add measurement service
    addMeasurementService: asyncHandler(async (req, res, next) => {
        // Extract necessary data from request
        const market_id = req.market.market_id;
        // Validate request body
        const schema = Joi.object({
            service_name: Joi.string().required(),
            description: Joi.string().allow(null),
            rate_per_hour_per_person: Joi.number().required(),
            rate_per_km: Joi.number().required(),
            market_id: Joi.number().integer().required()
        });
        

        let body = {
            ...req.body,
               market_id
           }

        const { error, value } = schema.validate(body);

        // Handle validation error
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: error.details,
            });
        }

        // Proceed with adding measurement service
        const addServiceQuery = `
            INSERT INTO measurement_service (service_name, description, rate_per_hour_per_person, rate_per_km, market_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;`;

        try {
            const addedService = (await queryDB(addServiceQuery, [value.service_name, value.description, value.rate_per_hour_per_person, value.rate_per_km, value.market_id])).rows[0];
            if (addedService) {
                res.status(200).json({
                    success: true,
                    message: "Measurement service added successfully",
                    data: addedService
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in creating new measurement service",
                    data: addedService,
                });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: "Creating error", error: error });
        }
    }),

    // Update measurement service
    updateMeasurementService: asyncHandler(async (req, res, next) => {
        // Extract necessary data from request
        

        // Validate request body
        const schema = Joi.object({
            service_id: Joi.number().integer().required(),
            service_name: Joi.string().required(),
            description: Joi.string().allow(null),
            rate_per_hour_per_person: Joi.number().required(),
            rate_per_km: Joi.number().required(),
           
        });

        const body = {
            ...req.body

        }
        const { error, value } = schema.validate(body);

        // Handle validation error
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: error.details,
            });
        }

        // Proceed with updating measurement service
        const updateServiceQuery = `
            UPDATE measurement_service
            SET service_name = $1, description = $2, rate_per_hour_per_person = $3, rate_per_km = $4
            WHERE id = $5
            RETURNING *;`;

        try {
            const updatedService = (await queryDB(updateServiceQuery, [value.service_name, value.description, value.rate_per_hour_per_person, value.rate_per_km, value.service_id])).rows[0];
            if (updatedService) {
                res.status(200).json({
                    success: true,
                    message: "Measurement service updated successfully",
                    data: updatedService,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in updating measurement service",
                    data: updatedService,
                });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: "Updating error", error: error });
        }
    }),

    // Delete measurement service
    deleteMeasurementService: asyncHandler(async (req, res, next) => {
        // Extract necessary data from request
        

        // Validate request body
        const schema = Joi.object({
            service_id: Joi.number().integer().required()
        });

        const body = {
            ...req.query
        }

        const { error, value } = schema.validate(body);

        // Handle validation error
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: error.details,
            });
        }

        // Proceed with deleting measurement service
        const deleteServiceQuery = `
            DELETE FROM measurement_service WHERE id = $1
            RETURNING *;`;

        try {
            const deletedService = (await queryDB(deleteServiceQuery, [value.service_id])).rows[0];
            if (deletedService) {
                res.status(200).json({
                    success: true,
                    message: "Measurement service deleted successfully",
                    data: deletedService,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in deleting measurement service",
                    data: deletedService,
                });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: "Deleting error", error: error });
        }
    }),

    // Get all measurement services
    getAllMeasurementServices: asyncHandler(async (req, res, next) => {
        // Extract necessary data from request
        const market_id = req.market.market_id;

        // Validate request body
        const schema = Joi.object({
            market_id: Joi.number().integer().required()
        });

        let body = {
            market_id
        }

        const { error, value } = schema.validate(body);

        // Handle validation error
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: error.details,
            });
        }

        // Proceed with fetching all measurement services
        const getAllServicesQuery = `SELECT * FROM measurement_service WHERE market_id = $1;`;

        try {
            const allServices = (await queryDB(getAllServicesQuery, [value.market_id])).rows;
            if (allServices) {
                res.status(200).json({
                    success: true,
                    message: "Request successful",
                    data: allServices
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in getting measurement services",
                    data: allServices
                });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: "Fetching error", error: error });
        }
    }),
};

// Export the measurement service API object
export { measurementServiceApi };
