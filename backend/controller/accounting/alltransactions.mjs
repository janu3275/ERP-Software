import Joi from "joi";
import { transactionFilteredQry, transactionFilteredSummaryQry } from "../../queries/transactionQueries.mjs";
import { getFilesInDirectory } from "../../utils/commonFunction.mjs";
import { asyncHandler } from "../../middleware/asynchandler.mjs";
import { queryDB } from "../../db.mjs";

const transactionsApi = {
 
  getFilteredTransactions: asyncHandler(async (req, res, next) => {

     // BODY VALIDATION
     const market_id = req.market.market_id;

     const schema = Joi.object({
       market_id: Joi.number().integer().required(),
       filters: Joi.object().required(),
       nextCursor: Joi.number().integer().allow(null), // Cursor for pagination
       previousCursor: Joi.number().integer().allow(null), // Cursor for pagination
       limit: Joi.number().integer().default(10) // Page size
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

     const { previousCursor, nextCursor } = value

    // PROCEEDING TOWARDS FETCHING ALL PAYMENTS FOR EMIs
    

    try {

        const { filters, limit } = value;

        const queryParams = [
          value.market_id,
          filters.date.minValue || null,
          filters.date.maxValue || null,
          filters.category || null,
          filters.description || null,
          filters.debit.minValue || null,
          filters.debit.maxValue || null,
          filters.credit.minValue || null,
          filters.credit.maxValue || null,
          limit
        ]

        const summaryQueryParams = [
          value.market_id,
          filters.date.minValue || null,
          filters.date.maxValue || null,
          filters.category || null,
          filters.description || null,
          filters.debit.minValue || null,
          filters.debit.maxValue || null,
          filters.credit.minValue || null,
          filters.credit.maxValue || null
        ]

      const payments = (await queryDB(transactionFilteredQry(previousCursor, nextCursor), queryParams)).rows;
       
      const summary = (await queryDB(transactionFilteredSummaryQry, summaryQueryParams)).rows[0]|| null;

      const fPayments = payments.map((payment) => {

        return {
          ...payment,
          images: getFilesInDirectory(payment.attachment_path),
        };
        
      });

      if (fPayments.length > 0) {

        const nextCursor = fPayments[fPayments.length - 1]?.row_num || null;
        const previousCursor = fPayments[0]?.row_num || null;

        res.status(200).json({
          success: true,
          message: "All transactions retrieved successfully",
          data: convertData(fPayments),
          summary: summary,
          nextCursor: fPayments.length === limit ? nextCursor : null, // Indicate if there are more results
          previousCursor: fPayments.length === limit ? previousCursor : null, // Indicate if there are previous results
        });

      } else {

        res.status(200).json({
          success: true,
          message: "No Transactions found",
          data: [],
          summary: null,
          nextCursor: null, 
          previousCursor: null
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
