import Joi from "joi";
import { queryDB } from "../../db.mjs";
import {
  deleteDirectory,
  generateRandomId,
  getFilesInDirectory,
  saveFilesToLocalDisk,
} from "../../utils/commonFunction.mjs";
import { asyncHandler } from "../../middleware/asynchandler.mjs";

const custPaymentHistoryApi = {
  addCustomerPayment: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const schema = Joi.object({
      customer_id: Joi.number().integer().required(),
      payment_date: Joi.date().iso().required(),
      images: Joi.array().min(1).required(),
      paidOptionInfo: Joi.array()
        .min(1)
        .items(
          Joi.object({
            via: Joi.string().required(),
            checked: Joi.boolean().required(),
            amount: Joi.number().required(),
          })
        ),
      description: Joi.string().allow("").optional(),
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

    // PROCEEDING TOWARDS ADDING CUSTOMER PAYMENT TRANSACTION
    const addPaymentQuery = `
            INSERT INTO cust_payment_history (customer_id, payment_date, attachment_path,  description)
            VALUES ($1, $2, $3, $4)
            RETURNING *;`;

    const addPaymentInfoQuery = `
            INSERT INTO cust_paymentinfo (cash, upi, cheque, other, custpayhistoryid)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;`;

    try {
      await queryDB("BEGIN");

      let files = value.images;
      let item_Id = `I-${generateRandomId(7)}`;
      let itemPath = `./Uploads/${Date.now()}/customerID-${
        value.customer_id
      }/PaymentID-${item_Id}`;

      const addedPayment = (
        await queryDB(addPaymentQuery, [
          value.customer_id,
          value.payment_date,
          itemPath,
          value.description,
        ])
      ).rows[0];

      if (addedPayment) {
        saveFilesToLocalDisk(files, itemPath); // saving files to path
      }

      const addedpaymentId = addedPayment.id;

      // adding payment info for each payment of payment history of customer

      const cash = body.paidOptionInfo[0]?.amount || 0;
      const upi = body.paidOptionInfo[1]?.amount || 0;
      const cheque = body.paidOptionInfo[2]?.amount || 0;
      const others = body.paidOptionInfo[3]?.amount || 0;

      const paymentId = (
        await queryDB(addPaymentInfoQuery, [
          cash,
          upi,
          cheque,
          others,
          addedpaymentId,
        ])
      ).rows[0]?.id;

      await queryDB("COMMIT");
      if (addedPayment) {
        res.status(200).json({
          success: true,
          message: "Customer payment added successfully",
          data: addedPayment,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in adding customer payment",
          data: addedPayment,
        });
      }
    } catch (error) {
      await queryDB("ROLLBACK");
      return res
        .status(200)
        .json({ success: false, message: "Adding error", error: error });
    }
  }),

  updatePayment: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const schema = Joi.object({
      payment_id: Joi.number().integer().required(),
      payment_date: Joi.date().iso().required(),
      images: Joi.array().min(1).required(),
      paidOptionInfo: Joi.array()
        .min(1)
        .items(
          Joi.object({
            via: Joi.string().required(),
            checked: Joi.boolean().required(),
            amount: Joi.number().required(),
          })
        ),
      description: Joi.string().allow("").optional(),
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

    const getPaymentByIdQry = `select attachment_path from cust_payment_history where id = $1`;

    // PROCEEDING TOWARDS UPDATING CUSTOMER PAYMENT TRANSACTION
    const updatePaymentQuery = `
            UPDATE cust_payment_history
            SET payment_date = $1, description = $2
            WHERE id = $3
            RETURNING *;`;

    const UpdatePaymentInfoQuery = `
            UPDATE cust_paymentinfo
            SET cash=$1, upi=$2, cheque=$3, other=$4
            WHERE custpayhistoryid = $5
            RETURNING *;`;

    try {
      const prevPath = (await queryDB(getPaymentByIdQry, [value.payment_id]))
        .rows[0]?.attachment_path;

      const updatedPayment = (
        await queryDB(updatePaymentQuery, [
          value.payment_date,
          value.description,
          value.payment_id,
        ])
      ).rows[0];

      if (!updatedPayment) {
        res.status(200).json({
          success: false,
          message: "Problem in updating customer payment",
          data: updatedPayment,
        });
      }

      const files = value.images;

      deleteDirectory(prevPath);
      saveFilesToLocalDisk(files, prevPath); // saving files to path

      const paymenthisId = updatedPayment.id;

      // update payment info for payment of payment history of customer

      const cash = body.paidOptionInfo[0]?.amount || 0;
      const upi = body.paidOptionInfo[1]?.amount || 0;
      const cheque = body.paidOptionInfo[2]?.amount || 0;
      const others = body.paidOptionInfo[3]?.amount || 0;

      console.log( cash, upi, cheque, others, paymenthisId )

      const paymentId = (
        await queryDB(UpdatePaymentInfoQuery, [
          cash,
          upi,
          cheque,
          others,
          paymenthisId
        ])
      ).rows[0]?.id;

      if (updatedPayment) {
        res.status(200).json({
          success: true,
          message: "Customer payment updated successfully",
          data: updatedPayment,
        });

      } else {
        res.status(200).json({
          success: false,
          message: "Problem in updating customer payment",
          data: updatedPayment,
        });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "Updating error", error: error });
    }
  }),

  deletePayment: asyncHandler(async (req, res, next) => {
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

    // PROCEEDING TOWARDS DELETING CUSTOMER PAYMENT TRANSACTION
    const deletePaymentQuery = `
            DELETE FROM cust_payment_history WHERE id = $1
            RETURNING *;`;

    try {
      const deletedPayment = (
        await queryDB(deletePaymentQuery, [value.payment_id])
      ).rows[0];

      if (deletedPayment) {
        const prevPath = deletedPayment.attachment_path;
        deleteDirectory(prevPath);

        res.status(200).json({
          success: true,
          message: "Customer payment deleted successfully",
          data: deletedPayment,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in deleting customer payment",
          data: deletedPayment,
        });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "Deleting error", error: error });
    }
  }),

  getAllPaymentsByCustomer: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const schema = Joi.object({
      customer_id: Joi.number().integer().required(),
    });

    let body = req.params;
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

    // PROCEEDING TOWARDS FETCHING CUSTOMER PAYMENT TRANSACTIONS
    const getPaymentsQuery = `SELECT
    ph.id AS id,
    ph.customer_id,
    ph.payment_date,
    ph.attachment_path,
    ph.description,
    (SELECT json_build_object(
        'cash', pi.cash,
        'upi', pi.upi,
        'cheque', pi.cheque,
        'other', pi.other
    )) AS payment_info
FROM
    cust_payment_history AS ph
INNER JOIN
    cust_paymentinfo AS pi ON ph.id = pi.custpayhistoryid
WHERE ph.customer_id = $1    
`;

    try {
      console.log("customer_id", value.customer_id);

      let customerPayments = (
        await queryDB(getPaymentsQuery, [value.customer_id])
      ).rows;

      console.log("jkhk", customerPayments);
      const fcustomerPayments = customerPayments.map((payment) => {
        
        return {
          ...payment,
          images: getFilesInDirectory(payment.attachment_path),
        };
      });

      console.log("klnkl", fcustomerPayments);
      if (customerPayments) {
        res.status(200).json({
          success: true,
          message: "Customer payments retrieved successfully",
          data: convertData(fcustomerPayments),
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in getting customer payments",
          data: customerPayments,
        });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "Fetching error", error: error });
    }
  }),

  getAllCustomerPayments: asyncHandler(async (req, res, next) => {
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

    // PROCEEDING TOWARDS FETCHING CUSTOMER PAYMENT TRANSACTIONS
//     const getPaymentsQuery = `SELECT
//     ph.id AS id,
//     ci.name AS customer_name,
//     ph.customer_id,
//     ph.payment_date,
//     ph.attachment_path,
//     ph.description,
//     (
//         SELECT json_build_object(
//             'cash', pi.cash,
//             'upi', pi.upi,
//             'cheque', pi.cheque,
//             'other', pi.other
//         )
//     ) AS payment_info
// FROM
//     cust_payment_history AS ph
// INNER JOIN
//     cust_paymentinfo AS pi ON ph.id = pi.custpayhistoryid
// INNER JOIN
//     customerinfo AS ci ON ph.customer_id = ci.id
// WHERE
//     ci.market_id = $1;

// `;

const getPaymentsQuery = `SELECT
ph.id AS id,
ph.customer_id,
ph.payment_date,
ph.attachment_path,
ph.description,
(
  SELECT
    json_build_object(
      'cash', COALESCE(pi.cash, 0),
      'upi', COALESCE(pi.upi, 0),
      'cheque', COALESCE(pi.cheque, 0),
      'other', COALESCE(pi.other, 0)
    )
) AS payment_info,
(
  COALESCE(pi.cash, 0) +
  COALESCE(pi.upi, 0) +
  COALESCE(pi.cheque, 0) +
  COALESCE(pi.other, 0)
) AS total_amount
FROM
cust_payment_history AS ph
INNER JOIN cust_paymentinfo AS pi ON ph.id = pi.custpayhistoryid
WHERE
ph.customer_id = $1
AND (
  $2 IS NULL
  OR ph.payment_date >= $2
)
AND (
  $3 IS NULL
  OR ph.payment_date <= $3
)
AND (
  $4 IS NULL
  OR ph.description LIKE '%' || $4 || '%'
)
AND (
  $5 IS NULL
  OR (
    COALESCE(pi.cash, 0) +
    COALESCE(pi.upi, 0) +
    COALESCE(pi.cheque, 0) +
    COALESCE(pi.other, 0)
  ) >= $5
)
AND (
  $6 IS NULL
  OR (
    COALESCE(pi.cash, 0) +
    COALESCE(pi.upi, 0) +
    COALESCE(pi.cheque, 0) +
    COALESCE(pi.other, 0)
  ) <= $6
);` 

    try {
     const {filters} = value;

      let customerPayments = (
        await queryDB(getPaymentsQuery, [
          value.market_id,
          filters[0]?.minValue || null, // Expected to be a date
          filters[0]?.maxValue || null,   // Expected to be a date
          filters[1]?.value || null,        // Expected to be a string
          filters[2]?.value || null,     // Expected to be a string
          filters[3]?.minValue || null,        // Expected to be a number
          filters[3]?.maxValue|| null,        // Expected to be a number
          filters[4]?.minValue || null,       // Expected to be a number
          filters[4]?.maxValue || null        // Expected to be a number
        ])
      ).rows;

      console.log("jkhk", customerPayments);
      const fcustomerPayments = customerPayments.map((payment) => {
        
        return {
          ...payment,
          images: getFilesInDirectory(payment.attachment_path),
        };
      });

      console.log("klnkl", fcustomerPayments);
      if (customerPayments) {
        res.status(200).json({
          success: true,
          message: "Customer payments retrieved successfully",
          data: convertData(fcustomerPayments),
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in getting customer payments",
          data: customerPayments,
        });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "Fetching error", error: error });
    }
  }),
};

// this filter query is for getAllPaymentsByCustomer.
const allfilteredPaymentByCustomerQry = `SELECT
ph.id AS id,
ph.customer_id,
ph.payment_date,
ph.attachment_path,
ph.description,
(
  SELECT
    json_build_object(
      'cash', COALESCE(pi.cash, 0),
      'upi', COALESCE(pi.upi, 0),
      'cheque', COALESCE(pi.cheque, 0),
      'other', COALESCE(pi.other, 0)
    )
) AS payment_info,
(
  COALESCE(pi.cash, 0) +
  COALESCE(pi.upi, 0) +
  COALESCE(pi.cheque, 0) +
  COALESCE(pi.other, 0)
) AS total_amount
FROM
cust_payment_history AS ph
INNER JOIN cust_paymentinfo AS pi ON ph.id = pi.custpayhistoryid
WHERE
ph.customer_id = $1
AND (
  $2 IS NULL
  OR ph.payment_date >= $2
)
AND (
  $3 IS NULL
  OR ph.payment_date <= $3
)
AND (
  $4 IS NULL
  OR ph.description LIKE '%' || $4 || '%'
)
AND (
  $5 IS NULL
  OR (
    COALESCE(pi.cash, 0) +
    COALESCE(pi.upi, 0) +
    COALESCE(pi.cheque, 0) +
    COALESCE(pi.other, 0)
  ) >= $5
)
AND (
  $6 IS NULL
  OR (
    COALESCE(pi.cash, 0) +
    COALESCE(pi.upi, 0) +
    COALESCE(pi.cheque, 0) +
    COALESCE(pi.other, 0)
  ) <= $6
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
          checked: true,
          amount: parseFloat(payment.cash) ? parseFloat(payment.cash) : 0,
        },
        {
          via: "UPI",
          label: "Google Pay UPI",
          checked: true,
          amount: parseFloat(payment.upi) ? parseFloat(payment.upi) : 0,
        },
        {
          via: "Cheque",
          label: "Cheque",
          checked: true,
          amount: parseFloat(payment.cheque) ? parseFloat(payment.cheque) : 0,
        },
        {
          via: "Other",
          label: "Other",
          checked: true,
          amount: parseFloat(payment.other) ? parseFloat(payment.other) : 0,
        },
      ],
    };
  });

  return newpayments;
}

export { custPaymentHistoryApi };
