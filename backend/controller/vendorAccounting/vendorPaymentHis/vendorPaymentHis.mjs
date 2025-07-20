import { asyncHandler } from "../../../middleware/asynchandler.mjs";
import { queryDB } from "../../../db.mjs";
import Joi from "joi";
import { deleteDirectory, generateRandomId, getFilesInDirectory, saveFilesToLocalDisk } from "../../../utils/commonFunction.mjs";

const vendorPaymentsApi = {
    
    getVendorPaymentsByVendorId: asyncHandler(async (req, res, next) => {
        const vendorId = req.params.vendorId;
    
        const schema = Joi.object({
            vendorId: Joi.number().integer().required(),
            filters: Joi.object().required(),
            nextCursor: Joi.number().integer().allow(null), // Cursor for pagination
            previousCursor: Joi.number().integer().allow(null), // Cursor for pagination
            limit: Joi.number().integer().default(10) // Page size
        });

        let body = {...req.params, ...req.body};
    
        const { error, value } = schema.validate(body);
    
        if (error) {
            console.log(error.details);
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: error.details,
            });
        }

        const { previousCursor, nextCursor } = value
    
        const getVendorPaymentsQuery = `
            SELECT * FROM vendor_payments AS vp 
            WHERE 
            vendor_id = $1
            AND ($2::date IS NULL OR vp.payment_date >= $2::date)
            AND ($3::date IS NULL OR vp.payment_date <= $3::date)
            AND ($4::numeric IS NULL OR vp.amount >= $4::numeric)
            AND ($5::numeric IS NULL OR vp.amount <= $5::numeric)
            AND ($6::text IS NULL OR vp.note ILIKE '%' || $6::text || '%')
            ${nextCursor ? `AND id > ${nextCursor}` : ''}
            ${previousCursor ? `AND id < ${previousCursor}` : ''}
            ORDER BY
               vp.id ASC
            LIMIT
             $7;`;
    
        try {

            const { filters, limit } = value;


            const queryParams = [
              value.vendorId,
              filters.payment_date.minValue || null,
              filters.payment_date.maxValue || null,
              filters.amount.minValue || null,
              filters.amount.maxValue || null,
              filters.note || null,
              limit
            ]

            let vendorPayments = (
                await queryDB(getVendorPaymentsQuery, queryParams)
            ).rows;

            vendorPayments = vendorPayments.map((payment) => {
                return {
                    ...payment,
                    images: getFilesInDirectory(payment.attachment_path) 
                }
            });
    
            if (vendorPayments) {

                const nextCursor = vendorPayments[vendorPayments.length - 1]?.id || null;
                const previousCursor = vendorPayments[0]?.id || null;

                res.status(200).json({
                    success: true,
                    message: "Vendor payments retrieved successfully",
                    data: vendorPayments,
                    nextCursor: vendorPayments.length === limit ? nextCursor : null, // Indicate if there are more results
                    previousCursor: vendorPayments.length === limit ? previousCursor : null, // Indicate if there are previous results
                });

            } else {

                res.status(404).json({
                    success: false,
                    message: "No vendor payments found",
                    data: [],
                    nextCursor: null, 
                    previousCursor: null
                });

            }

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error retrieving vendor payments",
                error: error.message,
            });
        }
    }),

    getAllVendorPayments: asyncHandler(async (req, res, next) => {
       // BODY VALIDATION
   const market_id = req.market.market_id;

   const schema = Joi.object({
     market_id: Joi.number().integer().required(),
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
        const getVendorPaymentsQuery = `
        SELECT
        vp.*,
        v.vendor_name,
        v.product_type,
        v.contact_person
    FROM
        vendor_payments AS vp
    INNER JOIN
        vendors AS v ON vp.vendor_id = v.id
    WHERE
        v.market_id = $1;`;
    
        try {
            
            let vendorPayments = (
                await queryDB(getVendorPaymentsQuery, [value.market_id])
            ).rows;

            vendorPayments = vendorPayments.map((payment) => {
                return {
                    ...payment,
                    images: getFilesInDirectory(payment.attachment_path) 
                }
            });
    
            if (vendorPayments) {
                res.status(200).json({
                    success: true,
                    message: "Vendor payments retrieved successfully",
                    data: vendorPayments,
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "No vendor payments found",
                    data: [],
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error retrieving vendor payments",
                error: error.message,
            });
        }
    }),

    addPaymentByVendorId: asyncHandler(async (req, res, next) => {
        const { payment_date, images, amount, note, vendorId } = req.body;
    
        const schema = Joi.object({
            payment_date: Joi.date().required(),
            images: Joi.array().min(1).required(),
            amount: Joi.number().required(),
            note: Joi.string().allow('').required(),
            vendorId: Joi.number().integer().required()
        });

        const body = {
            ...req.body
        }
    
        const { error, value } = schema.validate(body);
    
        if (error) {
            console.log(error.details);
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: error.details,
            });
        }
    
        const addPaymentQuery = `
            INSERT INTO vendor_payments (payment_date, attachment_path, amount, note, vendor_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;`;
    
        try {
            let files = images;
            let itemId = `P-${generateRandomId(7)}`;
            let itemPath = `./Uploads/${Date.now()}/vendorID-${vendorId}/PaymentID-${itemId}`;

            const addedPayment = (
                await queryDB(addPaymentQuery, [payment_date, itemPath, amount, note, vendorId])
            ).rows[0]?.id;
    
            console.log("files --->", files);
            saveFilesToLocalDisk(files, itemPath); // saving files to path
    
            if (addedPayment) {
                res.status(201).json({
                    success: true,
                    message: "Payment added successfully",
                    data: addedPayment,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: "Error adding payment",
                    data: null,
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error adding payment",
                error: error.message,
            });
        }
    }),

    updatePaymentByVendorId: asyncHandler(async (req, res, next) => {
        const { payment_date, images, amount, note, paymentId } = req.body;
    
        const schema = Joi.object({
            paymentId: Joi.number().integer().required(),
            payment_date: Joi.date().required(),
            images: Joi.array().min(1).required(),
            amount: Joi.number().required(),
            note: Joi.string().allow('').required(),
        });

        const body = {
            ...req.body
        }
    
        const { error, value } = schema.validate(body);
    
        if (error) {
            console.log(error.details);
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: error.details,
            });
        }

        const getPaymentByIdQuery = `SELECT attachment_path FROM vendor_payments WHERE id = $1;`;
    
        const updatePaymentQuery = `
            UPDATE vendor_payments 
            SET payment_date = $1, attachment_path = $2, amount = $3, note = $4
            WHERE id = $5
            RETURNING *;`;
    
        try {
            
            const prevPath = (
                await queryDB(getPaymentByIdQuery, [paymentId])
            ).rows[0]?.attachment_path;
    
            let files = images;

            const updatedPayment = (
                await queryDB(updatePaymentQuery, [payment_date, prevPath, amount, note, paymentId])
            ).rows[0]?.id;
    
            console.log("files --->", files);
            deleteDirectory(prevPath);
            saveFilesToLocalDisk(files, prevPath); // saving files to path
    
            if (updatedPayment) {
                res.status(200).json({
                    success: true,
                    message: "Payment updated successfully",
                    data: updatedPayment,
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "Payment not found or cannot be updated",
                    data: null,
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error updating payment",
                error: error.message,
            });
        }
    }),
    
    deletePaymentByVendorId: asyncHandler(async (req, res, next) => {
        const { paymentId } = req.query;
    
        const schema = Joi.object({
            paymentId: Joi.number().integer().required(),
        });

        const body = {
            paymentId: Number(paymentId)
        }
    
        const { error, value } = schema.validate(body);
    
        if (error) {
            console.log(error.details);
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: error.details,
            });
        }
    
        const deletePaymentQuery = `
            DELETE FROM vendor_payments
            WHERE id = $1 
            RETURNING *;`;
    
        try {
            const deletedPayment = (
                await queryDB(deletePaymentQuery, [value.paymentId])
            ).rows[0];

            const attachmentPath = deletedPayment.attachment_path;
            deleteDirectory(attachmentPath);
    
            if (deletedPayment) {
                res.status(200).json({
                    success: true,
                    message: "Payment deleted successfully",
                    data: deletedPayment,
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "Payment not found or cannot be deleted",
                    data: null,
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error deleting payment",
                error: error.message,
            });
        }
    })
};

const getfilteredVendorPayments = `
SELECT
    vp.*,
    v.vendor_name,
    v.product_type,
    v.contact_person
FROM
    vendor_payments AS vp
INNER JOIN
    vendors AS v ON vp.vendor_id = v.id
WHERE
    v.market_id = $1
    AND ($2::date IS NULL OR vp.payment_date >= $2::date)
    AND ($3::date IS NULL OR vp.payment_date <= $3::date)
    AND ($4::numeric IS NULL OR vp.amount >= $4::numeric)
    AND ($5::numeric IS NULL OR vp.amount <= $5::numeric)
    AND ($6::text IS NULL OR vp.note LIKE '%' || $6::text || '%');
`;


export { vendorPaymentsApi };
