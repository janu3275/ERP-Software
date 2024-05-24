import Joi from "joi";
import { transactionQry } from "../../queries/transactionQueries.mjs";
import { getFilesInDirectory } from "../../utils/commonFunction.mjs";
import { asyncHandler } from "../../middleware/asynchandler.mjs";
import { queryDB } from "../../db.mjs";

const transactionsApi = {
 
  getFilteredTransactions: asyncHandler(async (req, res, next) => {

     // BODY VALIDATION
     const market_id = req.market.market_id;

     const schema = Joi.object({
       market_id: Joi.number().integer().required(),
       filters: Joi.array().required()
     });
    
     let body = { market_id, ...req.body };
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
    

    try {

        const { filters } = value;

        const payments = (await queryDB(transactionQry, [
            value.market_id,
            filters[0]?.minValue || null, // Expected to be a date
            filters[0]?.maxValue || null,   // Expected to be a date
            filters[1]?.value || null,        // Expected to be a string
            filters[2]?.value || null,     // Expected to be a string
            filters[3]?.minValue || null,        // Expected to be a number
            filters[3]?.maxValue|| null,        // Expected to be a number
            filters[4]?.minValue || null,       // Expected to be a number
            filters[4]?.maxValue || null        // Expected to be a number
          ])).rows;

      const fPayments = payments.map((payment) => {

        return {
          ...payment,
          images: getFilesInDirectory(payment.attachment_path),
        };
        
      });

      if (fPayments.length > 0) {
        res.status(200).json({
          success: true,
          message: "All transactions retrieved successfully",
          data: convertData(fPayments),
        });
      } else {
        res.status(200).json({
          success: true,
          message: "No Transactions found",
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

export { transactionsApi };
