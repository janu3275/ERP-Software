import Joi from "joi";
import { queryDB } from "../../db.mjs";
import {
  deleteDirectory,
  generateRandomId,
  getFilesInDirectory,
  saveFilesToLocalDisk,
} from "../../utils/commonFunction.mjs";
import { asyncHandler } from "../../middleware/asynchandler.mjs";

const paymentsForEMIsApi = {
  addPaymentForEMI: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const schema = Joi.object({
      emi_types_id: Joi.number().integer().required(),
      purpose: Joi.string(),
      payment_date: Joi.date().iso().required(),
      images: Joi.array().required(),
      paidOptionInfo: Joi.array()
        .min(1)
        .items(
          Joi.object({
            via: Joi.string().required(),
            checked: Joi.boolean().required(),
            amount: Joi.number().required(),
          })
        ),
      note: Joi.string().allow("").optional(),
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

    // PROCEEDING TOWARDS ADDING PAYMENT FOR EMI
    const addPaymentQuery = `
            INSERT INTO payments_for_emis (emi_types_id, attachment_path, payment_date, cash, upi, cheque, other, note)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;`;

    let item_Id = `I-${generateRandomId(7)}`;
    let itemPath = `./Uploads/${Date.now()}/EMIPaymentID-${item_Id}`;

    try {
      await queryDB("BEGIN");

      let files = value.images;

      const cash = body.paidOptionInfo[0]?.amount || 0;
      const upi = body.paidOptionInfo[1]?.amount || 0;
      const cheque = body.paidOptionInfo[2]?.amount || 0;
      const others = body.paidOptionInfo[3]?.amount || 0;

      const addedPayment = (
        await queryDB(addPaymentQuery, [
          value.emi_types_id,
          itemPath,
          value.payment_date,
          cash,
          upi,
          cheque,
          others,
          value.note || "",
        ])
      ).rows[0];

      if (addedPayment) {
        saveFilesToLocalDisk(files, itemPath); // saving files to path
      }

      await queryDB("COMMIT");

      if (addedPayment) {
        res.status(200).json({
          success: true,
          message: "Payment for EMI added successfully",
          data: addedPayment,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in adding payment for EMI",
          data: addedPayment,
        });
      }
    } catch (error) {
      await queryDB("ROLLBACK");
      deleteDirectory(itemPath);
      return res
        .status(200)
        .json({ success: false, message: "Adding error", error: error });
    }
  }),

  updatePaymentForEMI: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const schema = Joi.object({
      payment_id: Joi.number().integer().required(),
      purpose: Joi.string(),
      emi_types_id: Joi.number().integer().required(),
      payment_date: Joi.date().iso().required(),
      images: Joi.array().required(),
      paidOptionInfo: Joi.array()
        .min(1)
        .items(
          Joi.object({
            via: Joi.string().required(),
            checked: Joi.boolean().required(),
            amount: Joi.number().required(),
          })
        ),
      note: Joi.string().allow("").optional(),
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

    // PROCEEDING TOWARDS UPDATING PAYMENT FOR EMI
    const updatePaymentQuery = `
            UPDATE payments_for_emis
            SET emi_types_id = $1, attachment_path = $2, payment_date = $3, cash = $4, upi = $5, cheque = $6, other = $7, note = $8
            WHERE id = $9
            RETURNING *;`;

    try {
      await queryDB("BEGIN");

      const cash = body.paidOptionInfo[0]?.amount || 0;
      const upi = body.paidOptionInfo[1]?.amount || 0;
      const cheque = body.paidOptionInfo[2]?.amount || 0;
      const others = body.paidOptionInfo[3]?.amount || 0;

      const prevPath = (
        await queryDB(`SELECT attachment_path FROM payments_for_emis WHERE id = $1`, [value.payment_id])
      ).rows[0]?.attachment_path;

      const updatedPayment = (
        await queryDB(updatePaymentQuery, [
          value.emi_types_id,
          prevPath,
          value.payment_date,
          cash,
          upi,
          cheque,
          others,
          value.note || "",
          value.payment_id,
        ])
      ).rows[0];

      if (!updatedPayment) {
        res.status(200).json({
          success: false,
          message: "Problem in updating payment for EMI",
          data: updatedPayment,
        });
      }

      const files = value.images;

      deleteDirectory(prevPath);
      saveFilesToLocalDisk(files, prevPath); // saving files to path

      await queryDB("COMMIT");

      if (updatedPayment) {
        res.status(200).json({
          success: true,
          message: "Payment for EMI updated successfully",
          data: updatedPayment,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in updating payment for EMI",
          data: updatedPayment,
        });
      }
    } catch (error) {
      await queryDB("ROLLBACK");
      return res
        .status(200)
        .json({ success: false, message: "Updating error", error: error });
    }
  }),

  deletePaymentForEMI: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const schema = Joi.object({
      payment_id: Joi.number().integer().required(),
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

    // PROCEEDING TOWARDS DELETING PAYMENT FOR EMI
    const deletePaymentQuery = `
            DELETE FROM payments_for_emis WHERE id = $1
            RETURNING *;`;

    try {
      await queryDB("BEGIN");

      const deletedPayment = (
        await queryDB(deletePaymentQuery, [value.payment_id])
      ).rows[0];

      await queryDB("COMMIT");

      if (deletedPayment) {
        if (deletedPayment.attachment_path) {
          deleteDirectory(deletedPayment.attachment_path);
        }
        res.status(200).json({
          success: true,
          message: "Payment for EMI deleted successfully",
          data: deletedPayment,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in deleting payment for EMI",
          data: deletedPayment,
        });
      }
    } catch (error) {
      await queryDB("ROLLBACK");
      return res
        .status(200)
        .json({ success: false, message: "Deleting error", error: error });
    }
  }),

  getAllPaymentsForEMIs: asyncHandler(async (req, res, next) => {

     // BODY VALIDATION
     const market_id = req.market.market_id;

     const schema = Joi.object({
       market_id: Joi.number().integer().required(),
     });
    
     let body = { market_id };
     const { error, value } = schema.validate(body);
   
     // HANDLE VALIDATION ERROR
   
     if (error) {
       console.log(error.details);
       return res
         .status(200)
         .json({
           success: false,
           message: "Validation error",
           error: error.details,
         });
     }

    // PROCEEDING TOWARDS FETCHING ALL PAYMENTS FOR EMIs
    const getPaymentsQuery = `SELECT
    pe.id AS id,
    et.purpose AS purpose,
    pe.emi_types_id AS emi_types_id,
    pe.attachment_path AS attachment_path,
    pe.payment_date AS payment_date,
    (SELECT json_build_object(
        'cash', pe.cash,
        'upi', pe.upi,
        'cheque', pe.cheque,
        'other', pe.other
    )) AS payment_info,
    pe.note AS note
FROM
    payments_for_emis AS pe
JOIN
    emi_types AS et
ON
    pe.emi_types_id = et.id
WHERE
    et.market_id = $1;
`;

    try {

      const payments = (await queryDB(getPaymentsQuery, [value.market_id])).rows;

      const fPayments = payments.map((payment) => {

        return {
          ...payment,
          images: getFilesInDirectory(payment.attachment_path),
        };
        
      });

      if (fPayments.length > 0) {
        res.status(200).json({
          success: true,
          message: "Payments for EMIs retrieved successfully",
          data: convertData(fPayments),
        });
      } else {
        res.status(200).json({
          success: true,
          message: "No payments for EMIs found",
          data: [],
        });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "Fetching error", error: error });
    }
  }),
};

const getFilteredEMIpamentqry = `SELECT
pe.id AS id,
et.purpose AS purpose,
pe.emi_types_id AS emi_types_id,
pe.attachment_path AS attachment_path,
pe.payment_date AS payment_date,
(
  SELECT
    json_build_object(
      'cash', COALESCE(pe.cash, 0),
      'upi', COALESCE(pe.upi, 0),
      'cheque', COALESCE(pe.cheque, 0),
      'other', COALESCE(pe.other, 0)
    )
) AS payment_info,
pe.note AS note,
(
  COALESCE(pe.cash, 0) +
  COALESCE(pe.upi, 0) +
  COALESCE(pe.cheque, 0) +
  COALESCE(pe.other, 0)
) AS total_amount
FROM
payments_for_emis AS pe
JOIN emi_types AS et ON pe.emi_types_id = et.id
WHERE
et.market_id = $1
AND (
  $2 IS NULL
  OR et.purpose LIKE '%' || $2 || '%'
)
AND (
  $3 IS NULL
  OR pe.payment_date >= $3
)
AND (
  $4 IS NULL
  OR pe.payment_date <= $4
)
AND (
  $5 IS NULL
  OR pe.note LIKE '%' || $5 || '%'
)
AND (
  $6 IS NULL
  OR (
    COALESCE(pe.cash, 0) +
    COALESCE(pe.upi, 0) +
    COALESCE(pe.cheque, 0) +
    COALESCE(pe.other, 0)
  ) >= $6
)
AND (
  $7 IS NULL
  OR (
    COALESCE(pe.cash, 0) +
    COALESCE(pe.upi, 0) +
    COALESCE(pe.cheque, 0) +
    COALESCE(pe.other, 0)
  ) <= $7
);`

function convertData(allpayments) {
  let newpayments = allpayments.map((paymentobj) => {
    let payment = paymentobj.payment_info;
    let paydate = new Date(paymentobj.payment_date);

    return {
      ...paymentobj,

      payment_date: paydate.toISOString().split("T")[0],
      paidOptionInfo: [
        {
          via: "Cash",
          label: "Cash",
          checked: parseFloat(payment.cash) ? true : false,
          amount: parseFloat(payment.cash) ? parseFloat(payment.cash) : 0,
        },
        {
          via: "UPI",
          label: "Google Pay UPI",
          checked: parseFloat(payment.upi) ? true : false,
          amount: parseFloat(payment.upi) ? parseFloat(payment.upi) : 0,
        },
        {
          via: "Cheque",
          label: "Cheque",
          checked: parseFloat(payment.cheque) ? true : false,
          amount: parseFloat(payment.cheque) ? parseFloat(payment.cheque) : 0,
        },
        {
          via: "Other",
          label: "Other",
          checked: parseFloat(payment.other) ? true : false,
          amount: parseFloat(payment.other) ? parseFloat(payment.other) : 0,
        },
      ],
    };
  });

  return newpayments;
}

export { paymentsForEMIsApi };
