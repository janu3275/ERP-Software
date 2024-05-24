// Import necessary modules
import { asyncHandler } from "../../../middleware/asynchandler.mjs";
import { queryDB } from "../../../db.mjs";
import Joi from "joi";

// Define the delivery service API object
const deliveryServiceApi = {
    // Add delivery service
    addDeliveryService: asyncHandler(async (req, res, next) => {
        // Extract necessary data from request
        
        const market_id = req.market.market_id;

        // Validate request body
        const schema = Joi.object({
            service_name: Joi.string().required(),
            description: Joi.string().allow(null),
            vehicle_type: Joi.string().required(),
            rate_per_km: Joi.number().required(),
            market_id: Joi.number().integer().required(),
        });

        const body = {
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

        // Proceed with adding delivery service
        const addServiceQuery = `
            INSERT INTO delivery_service (service_name, description, vehicle_type, rate_per_km, market_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;`;

        try {
            const addedService = (await queryDB(addServiceQuery, [value.service_name, value.description, value.vehicle_type, value.rate_per_km, value.market_id])).rows[0];
            if (addedService) {
                res.status(200).json({
                    success: true,
                    message: "Delivery service added successfully",
                    data: addedService,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in creating new delivery service",
                    data: addedService,
                });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: "Creating error", error: error });
        }
    }),

    // Update delivery service
    updateDeliveryService: asyncHandler(async (req, res, next) => {
        // Extract necessary data from request
       

        // Validate request body
        const schema = Joi.object({
            service_id: Joi.number().integer().required(),
            service_name: Joi.string().required(),
            description: Joi.string().allow(null),
            vehicle_type: Joi.string().required(),
            rate_per_km: Joi.number().required()
            
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

        // Proceed with updating delivery service
        const updateServiceQuery = `
            UPDATE delivery_service
            SET service_name = $1, description = $2, vehicle_type = $3, rate_per_km = $4
            WHERE id = $5
            RETURNING *;`;

        try {
            const updatedService = (await queryDB(updateServiceQuery, [value.service_name, value.description, value.vehicle_type, value.rate_per_km, value.service_id])).rows[0];
            if (updatedService) {
                res.status(200).json({
                    success: true,
                    message: "Delivery service updated successfully",
                    data: updatedService,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in updating delivery service",
                    data: updatedService,
                });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: "Updating error", error: error });
        }
    }),

    // Delete delivery service
    deleteDeliveryService: asyncHandler(async (req, res, next) => {
        // Extract necessary data from request
        

        // Validate request body
        const schema = Joi.object({
            service_id: Joi.number().integer().required(),
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

        // Proceed with deleting delivery service
        const deleteServiceQuery = `
            DELETE FROM delivery_service WHERE id = $1
            RETURNING *;`;

        try {
            const deletedService = (await queryDB(deleteServiceQuery, [value.service_id])).rows[0];
            if (deletedService) {
                res.status(200).json({
                    success: true,
                    message: "Delivery service deleted successfully",
                    data: deletedService,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in deleting delivery service",
                    data: deletedService,
                });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: "Deleting error", error: error });
        }
    }),

    // Get all delivery services
    getAllDeliveryServices: asyncHandler(async (req, res, next) => {
        // Extract necessary data from request
        const market_id = req.market.market_id;

        // Validate request body
        const schema = Joi.object({
            market_id: Joi.number().integer().required(),
        });

        const body = {
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

        // Proceed with fetching all delivery services
        const getAllServicesQuery = `SELECT * FROM delivery_service WHERE market_id = $1;`;

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
                    message: "Problem in getting delivery services",
                    data: allServices
                });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: "Fetching error", error: error });
        }
    }),
};

// Export the delivery service API object
export { deliveryServiceApi };
