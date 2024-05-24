import Joi from "joi";
import { queryDB } from "../../db.mjs";
import {
  deleteDirectory,
  generateRandomId,
  getFilesInDirectory,
  saveFilesToLocalDisk,
} from "../../utils/commonFunction.mjs";
import { asyncHandler } from "../../middleware/asynchandler.mjs";

const paymentHistoryApi = {

  addEmployeePayment: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const schema = Joi.object({
      employee_id: Joi.number().integer().required(),
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
      description: Joi.string().allow("").optional()
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

    // PROCEEDING TOWARDS ADDING SALARY TRANSACTION
    const addPaymentQuery = `
            INSERT INTO payment_history (employee_id, payment_date, attachment_path,  description)
            VALUES ($1, $2, $3, $4)
            RETURNING *;`;

    const addPaymentInfoQuery = `
            INSERT INTO employee_paymentinfo (cash, upi, cheque, other, paymenthistoryid)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;`;

    try {
      await queryDB("BEGIN");

      let files = value.images;
      let item_Id = `I-${generateRandomId(7)}`;
      let itemPath = `./Uploads/${Date.now()}/employeeID-${
        value.employee_id
      }/PaymentID-${item_Id}`;

      const addedPayment = (
        await queryDB(addPaymentQuery, [
          value.employee_id,
          value.payment_date,
          itemPath,
          value.description,
        ])
      ).rows[0];

      if (addedPayment) {
        saveFilesToLocalDisk(files, itemPath); // saving files to path
      }

      const addedpaymentId = addedPayment.id;

      // adding payment info for each payment of payment history of employee

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
          message: "Employee payment added successfully",
          data: addedPayment,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in adding payment payment",
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

    const getPaymentByIdQry = `select attachment_path from payment_history where id = $1`;

    // PROCEEDING TOWARDS UPDATING SALARY TRANSACTION
    const updatePaymentQuery = `
            UPDATE payment_history
            SET payment_date = $1, description = $2
            WHERE id = $3
            RETURNING *;`;

    const UpdatePaymentInfoQuery = `
            UPDATE employee_paymentinfo
            SET cash=$1, upi=$2, cheque=$3, other=$4
            WHERE paymenthistoryid = $5
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
          message: "Problem in updating payment payment",
          data: updatedPayment,
        });
      }

      const files = value.images;

      deleteDirectory(prevPath);
      saveFilesToLocalDisk(files, prevPath); // saving files to path

      const paymenthisId = updatedPayment.id;

      // update payment info for payment of payment history of employee

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
          message: "Salary payment updated successfully",
          data: updatedPayment,
        });

      } else {
        res.status(200).json({
          success: false,
          message: "Problem in updating payment payment",
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

    // PROCEEDING TOWARDS DELETING SALARY TRANSACTION
    const deletePaymentQuery = `
            DELETE FROM payment_history WHERE id = $1
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
          message: "Salary payment deleted successfully",
          data: deletedPayment,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in deleting payment payment",
          data: deletedPayment,
        });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "Deleting error", error: error });
    }
  }),

  getAllPaymentsByEmployee: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const schema = Joi.object({
      employee_id: Joi.number().integer().required(),
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

    // PROCEEDING TOWARDS FETCHING SALARY TRANSACTIONS
    const getPaymentsQuery = `SELECT
    ph.id AS id,
    ph.employee_id,
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
    payment_history AS ph
INNER JOIN
    employee_paymentinfo AS pi ON ph.id = pi.paymenthistoryid
WHERE ph.employee_id = $1    
`;

    try {
      console.log("employeeid", value.employee_id);

      let employeePayments = (
        await queryDB(getPaymentsQuery, [value.employee_id])
      ).rows;

      console.log("jkhk", employeePayments);
      const femployeePayments = employeePayments.map((payment) => {
        
        return {
          ...payment,
          images: getFilesInDirectory(payment.attachment_path),
        };
      });

      console.log("klnkl", femployeePayments);
      if (employeePayments) {
        res.status(200).json({
          success: true,
          message: "Salary payments retrieved successfully",
          data: convertData(femployeePayments),
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in getting payment payments",
          data: employeePayments,
        });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "Fetching error", error: error });
    }
  }),

  getAllEmployeePayments: asyncHandler(async (req, res, next) => {
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

    // PROCEEDING TOWARDS FETCHING SALARY TRANSACTIONS
    const getPaymentsQuery = `SELECT
    ph.id AS id,
    ei.first_name AS first_name,
    ei.last_name AS last_name,
    ph.employee_id,
    ph.payment_date,
    ph.attachment_path,
    ph.description,
    (
        SELECT json_build_object(
            'cash', pi.cash,
            'upi', pi.upi,
            'cheque', pi.cheque,
            'other', pi.other
        )
    ) AS payment_info
FROM
    payment_history AS ph
INNER JOIN
    employee_paymentinfo AS pi ON ph.id = pi.paymenthistoryid
INNER JOIN
    employee_info AS ei ON ph.employee_id = ei.id
WHERE
    ei.market_id = $1;
   
`;

    try {
    
      let employeePayments = (
        await queryDB(getPaymentsQuery, [value.market_id])
      ).rows;

      console.log("jkhk", employeePayments);
      const femployeePayments = employeePayments.map((payment) => {
        
        return {
          ...payment,
          images: getFilesInDirectory(payment.attachment_path),
        };
      });

      console.log("klnkl", femployeePayments);
      if (employeePayments) {
        res.status(200).json({
          success: true,
          message: "Salary payments retrieved successfully",
          data: convertData(femployeePayments),
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in getting payment payments",
          data: employeePayments,
        });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "Fetching error", error: error });
    }
  }),

  

};

const getAllPaymentsByEmployee = `SELECT
ph.id AS id,
ph.employee_id,
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
payment_history AS ph
INNER JOIN employee_paymentinfo AS pi ON ph.id = pi.paymenthistoryid
WHERE
ph.employee_id = $1
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

export { paymentHistoryApi };
