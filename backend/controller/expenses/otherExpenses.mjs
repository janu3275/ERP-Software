import Joi from "joi";
import { queryDB } from "../../db.mjs";
import {
  deleteDirectory,
  generateRandomId,
  getFilesInDirectory,
  saveFilesToLocalDisk,
} from "../../utils/commonFunction.mjs";
import { asyncHandler } from "../../middleware/asynchandler.mjs";

const paymentsForOtherExpensesApi = {
  addPaymentForOtherExpense: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const market_id = req.market.market_id;

    const schema = Joi.object({
      expense_name: Joi.string().required(),
      description: Joi.string().allow("").optional(),
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
      market_id: Joi.number().integer().required(),
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

    // PROCEEDING TOWARDS ADDING PAYMENT FOR OTHER EXPENSE
    const addPaymentQuery = `
            INSERT INTO payments_for_other_expenses (expense_name, description, attachment_path, payment_date, cash, upi, cheque, other, market_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *;`;

 let item_Id = `I-${generateRandomId(7)}`;
 let itemPath = `./Uploads/${Date.now()}/OtherExpensePaymentID-${item_Id}`;

    try {
      await queryDB("BEGIN");

      let files = value.images;
      

      const cash = body.paidOptionInfo[0]?.amount || 0;
      const upi = body.paidOptionInfo[1]?.amount || 0;
      const cheque = body.paidOptionInfo[2]?.amount || 0;
      const others = body.paidOptionInfo[3]?.amount || 0;

      

      const addedPayment = (
        await queryDB(addPaymentQuery, [
          value.expense_name,
          value.description || "",
          itemPath,
          value.payment_date,
          cash,
          upi,
          cheque,
          others,
          value.market_id
        ])
      ).rows[0];

      if (addedPayment) {
        saveFilesToLocalDisk(files, itemPath); // saving files to path
      }

      await queryDB("COMMIT");

      if (addedPayment) {
        res.status(200).json({
          success: true,
          message: "Payment for other expense added successfully",
          data: addedPayment,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in adding payment for other expense",
          data: addedPayment,
        });
      }
    } catch (error) {
      await queryDB("ROLLBACK");
      deleteDirectory(itemPath)
      return res
        .status(200)
        .json({ success: false, message: "Adding error", error: error });
    }
  }),

  updatePaymentForOtherExpense: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const schema = Joi.object({
      payment_id: Joi.number().integer().required(),
      expense_name: Joi.string().required(),
      description: Joi.string().allow("").optional(),
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
        )
      
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

    const getPaymentByIdQry = `select attachment_path from payments_for_other_expenses where id = $1`;

    // PROCEEDING TOWARDS UPDATING PAYMENT FOR OTHER EXPENSE
    const updatePaymentQuery = `
            UPDATE payments_for_other_expenses
            SET expense_name = $1, description = $2, payment_date = $3, cash = $4, upi = $5, cheque = $6, other = $7
            WHERE id = $8
            RETURNING *;`;

    try {

      await queryDB("BEGIN");

      const cash = body.paidOptionInfo[0]?.amount || 0;
      const upi = body.paidOptionInfo[1]?.amount || 0;
      const cheque = body.paidOptionInfo[2]?.amount || 0;
      const others = body.paidOptionInfo[3]?.amount || 0;
      

      console.log( cash, upi, cheque, others)

      const prevPath = (await queryDB(getPaymentByIdQry, [value.payment_id]))
        .rows[0]?.attachment_path;

      const updatedPayment = (
        await queryDB(updatePaymentQuery, [
          value.expense_name,
          value.description || "",
          value.payment_date,
          cash,
          upi,
          cheque,
          others,
          value.payment_id
        ])
      ).rows[0];

      if (!updatedPayment) {
        res.status(200).json({
          success: false,
          message: "Problem in updating payment payment",
          data: updatedPayment
        });
      }

      const files = value.images;

      deleteDirectory(prevPath);
      saveFilesToLocalDisk(files, prevPath); // saving files to path

     

      await queryDB("COMMIT");

      if (updatedPayment) {
        res.status(200).json({
          success: true,
          message: "Payment for other expense updated successfully",
          data: updatedPayment,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in updating payment for other expense",
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

  deletePaymentForOtherExpense: asyncHandler(async (req, res, next) => {
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

    // PROCEEDING TOWARDS DELETING PAYMENT FOR OTHER EXPENSE
    const deletePaymentQuery = `
            DELETE FROM payments_for_other_expenses WHERE id = $1
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
          message: "Payment for other expense deleted successfully",
          data: deletedPayment,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in deleting payment for other expense",
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

  getAllPaymentsForOtherExpenses: asyncHandler(async (req, res, next) => {

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


    // PROCEEDING TOWARDS FETCHING ALL PAYMENTS FOR OTHER EXPENSES
    const getPaymentsQuery = `
            SELECT
    poe.id AS id,
    poe.expense_name,
    poe.description,
    poe.attachment_path,
    poe.payment_date,
    (SELECT json_build_object(
        'cash', poe.cash,
        'upi', poe.upi,
        'cheque', poe.cheque,
        'other', poe.other
    )) AS payment_info
FROM
    payments_for_other_expenses AS poe
WHERE
    poe.market_id = $1;
`;

    try {
      const payments = (await queryDB(getPaymentsQuery, [value.market_id])).rows;

      console.log("jkhk", payments);
      const fPayments = payments.map((payment) => {
        
        return {
          ...payment,
          images: getFilesInDirectory(payment.attachment_path),
        };
      });

       console.log(fPayments)
      if (fPayments.length > 0) {
        res.status(200).json({
          success: true,
          message: "Payments for other expenses retrieved successfully",
          data: convertData(fPayments),
        });
      } else {
        res.status(200).json({
          success: true,
          message: "No payments for other expenses found",
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

const getFilteredPaymentsforOtherExpenses = `SELECT
poe.id AS id,
poe.expense_name,
poe.description,
poe.attachment_path,
poe.payment_date,
(
  SELECT
    json_build_object(
      'cash', COALESCE(poe.cash, 0),
      'upi', COALESCE(poe.upi, 0),
      'cheque', COALESCE(poe.cheque, 0),
      'other', COALESCE(poe.other, 0)
    )
) AS payment_info,
(
  COALESCE(poe.cash, 0) +
  COALESCE(poe.upi, 0) +
  COALESCE(poe.cheque, 0) +
  COALESCE(poe.other, 0)
) AS total_amount
FROM
payments_for_other_expenses AS poe
WHERE
poe.market_id = $1
AND (
  $2 IS NULL
  OR poe.expense_name LIKE '%' || $2 || '%'
)
AND (
  $3 IS NULL
  OR poe.payment_date >= $3
)
AND (
  $4 IS NULL
  OR poe.payment_date <= $4
)
AND (
  $5 IS NULL
  OR poe.description LIKE '%' || $5 || '%'
)
AND (
  $6 IS NULL
  OR (
    COALESCE(poe.cash, 0) +
    COALESCE(poe.upi, 0) +
    COALESCE(poe.cheque, 0) +
    COALESCE(poe.other, 0)
  ) >= $6
)
AND (
  $7 IS NULL
  OR (
    COALESCE(poe.cash, 0) +
    COALESCE(poe.upi, 0) +
    COALESCE(poe.cheque, 0) +
    COALESCE(poe.other, 0)
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

export { paymentsForOtherExpensesApi };
