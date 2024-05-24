// export const transactionQry = `SELECT * FROM (
//     SELECT 
//         ph.id AS id, 
//         'Customer payments' AS category, 
//         ci.name AS name, 
//         ph.payment_date AS payment_date, 
//         ph.attachment_path AS attachment_path, 
//         CONCAT(ci.name, ' paid Rs. ', COALESCE(pi.cash, 0) + COALESCE(pi.upi, 0) + COALESCE(pi.cheque, 0) + COALESCE(pi.other, 0)) AS description, 
//         COALESCE(pi.cash, 0) + COALESCE(pi.upi, 0) + COALESCE(pi.cheque, 0) + COALESCE(pi.other, 0) AS amount,
//         0 AS debit,
//         COALESCE(pi.cash, 0) + COALESCE(pi.upi, 0) + COALESCE(pi.cheque, 0) + COALESCE(pi.other, 0) AS credit,
//         json_build_object('cash', COALESCE(pi.cash, 0), 'upi', COALESCE(pi.upi, 0), 'cheque', COALESCE(pi.cheque, 0), 'other', COALESCE(pi.other, 0)) AS payment_info
//     FROM cust_payment_history AS ph 
//     INNER JOIN cust_paymentinfo AS pi ON ph.id = pi.custpayhistoryid 
//     INNER JOIN customerinfo AS ci ON ph.customer_id = ci.id 
//     WHERE ci.market_id = $1

//     UNION ALL

//     SELECT 
//         ph.id AS id, 
//         'Employee payments' AS category, 
//         CONCAT(ei.first_name, ' ', ei.last_name) AS name, 
//         ph.payment_date AS payment_date, 
//         ph.attachment_path AS attachment_path, 
//         CONCAT(ei.first_name, ' ', ei.last_name, ' was paid - Rs. ', COALESCE(pi.cash, 0) + COALESCE(pi.upi, 0) + COALESCE(pi.cheque, 0) + COALESCE(pi.other, 0)) AS description, 
//         COALESCE(pi.cash, 0) + COALESCE(pi.upi, 0) + COALESCE(pi.cheque, 0) + COALESCE(pi.other, 0) AS amount,
//         COALESCE(pi.cash, 0) + COALESCE(pi.upi, 0) + COALESCE(pi.cheque, 0) + COALESCE(pi.other, 0) AS debit,
//         0 AS credit,
//         json_build_object('cash', COALESCE(pi.cash, 0), 'upi', COALESCE(pi.upi, 0), 'cheque', COALESCE(pi.cheque, 0), 'other', COALESCE(pi.other, 0)) AS payment_info
//     FROM payment_history AS ph 
//     INNER JOIN employee_paymentinfo AS pi ON ph.id = pi.paymenthistoryid 
//     INNER JOIN employee_info AS ei ON ph.employee_id = ei.id 
//     WHERE ei.market_id = $1

//     UNION ALL

//     SELECT 
//         vp.id AS id, 
//         'Vendor payments' AS category, 
//         v.vendor_name AS name, 
//         vp.payment_date AS payment_date, 
//         vp.attachment_path AS attachment_path, 
//         CONCAT(v.vendor_name, ' was paid - Rs. ', COALESCE(vp.amount, 0)) AS description, 
//         COALESCE(vp.amount, 0) AS amount,
//         COALESCE(vp.amount, 0) AS debit,
//         0 AS credit,
//         '{}'::json AS payment_info
//     FROM vendor_payments AS vp 
//     INNER JOIN vendors AS v ON vp.vendor_id = v.id 
//     WHERE v.market_id = $1

//     UNION ALL

//     SELECT 
//         pe.id AS id, 
//         'EMI payments' AS category, 
//         et.purpose AS name, 
//         pe.payment_date AS payment_date, 
//         pe.attachment_path AS attachment_path, 
//         CONCAT('EMI payments for ', et.purpose, ' was paid - Rs. ', COALESCE(pe.cash, 0) + COALESCE(pe.upi, 0) + COALESCE(pe.cheque, 0) + COALESCE(pe.other, 0)) AS description, 
//         COALESCE(pe.cash, 0) + COALESCE(pe.upi, 0) + COALESCE(pe.cheque, 0) + COALESCE(pe.other, 0) AS amount,
//         COALESCE(pe.cash, 0) + COALESCE(pe.upi, 0) + COALESCE(pe.cheque, 0) + COALESCE(pe.other, 0) AS debit,
//         0 AS credit,
//         json_build_object('cash', COALESCE(pe.cash, 0), 'upi', COALESCE(pe.upi, 0), 'cheque', COALESCE(pe.cheque, 0), 'other', COALESCE(pe.other, 0)) AS payment_info
//     FROM payments_for_emis AS pe 
//     JOIN emi_types AS et ON pe.emi_types_id = et.id 
//     WHERE et.market_id = $1

//     UNION ALL

//     SELECT 
//         poe.id AS id, 
//         'Other expenses' AS category, 
//         poe.expense_name AS name, 
//         poe.payment_date AS payment_date, 
//         poe.attachment_path AS attachment_path, 
//         CONCAT('Payment for ', poe.expense_name, ' was paid - Rs. ', COALESCE(poe.cash, 0) + COALESCE(poe.upi, 0) + COALESCE(poe.cheque, 0) + COALESCE(poe.other, 0)) AS description, 
//         COALESCE(poe.cash, 0) + COALESCE(poe.upi, 0) + COALESCE(poe.cheque, 0) + COALESCE(poe.other, 0) AS amount,
//         COALESCE(poe.cash, 0) + COALESCE(poe.upi, 0) + COALESCE(poe.cheque, 0) + COALESCE(poe.other, 0) AS debit,
//         0 AS credit,
//         json_build_object('cash', COALESCE(poe.cash, 0), 'upi', COALESCE(poe.upi, 0), 'cheque', COALESCE(poe.cheque, 0), 'other', COALESCE(poe.other, 0)) AS payment_info
//     FROM payments_for_other_expenses AS poe 
//     WHERE poe.market_id = $1

//     UNION ALL

//     SELECT 
//         pe.id AS id, 
//         'Used services payments' AS category, 
//         est.service_name AS name, 
//         pe.payment_date AS payment_date, 
//         pe.attachment_path AS attachment_path, 
//         CONCAT('Payments for ', est.service_name, ' was paid - Rs. ', COALESCE(pe.cash, 0) + COALESCE(pe.upi, 0) + COALESCE(pe.cheque, 0) + COALESCE(pe.other, 0)) AS description, 
//         COALESCE(pe.cash, 0) + COALESCE(pe.upi, 0) + COALESCE(pe.cheque, 0) + COALESCE(pe.other, 0) AS amount,
//         COALESCE(pe.cash, 0) + COALESCE(pe.upi, 0) + COALESCE(pe.cheque, 0) + COALESCE(pe.other, 0) AS debit,
//         0 AS credit,
//         json_build_object('cash', COALESCE(pe.cash, 0), 'upi', COALESCE(pe.upi, 0), 'cheque', COALESCE(pe.cheque, 0), 'other', COALESCE(pe.other, 0)) AS payment_info
//     FROM payment_for_services_used AS pe 
//     JOIN expense_service_types AS est ON pe.expense_service_types_id = est.id 
//     WHERE est.market_id = $1
// ) AS transactions
// ORDER BY payment_date DESC;
// `

export const transactionQry = `SELECT * FROM (
    SELECT 
        ph.id AS id, 
        'Customer payments' AS category, 
        ci.name AS name, 
        ph.payment_date AS payment_date, 
        ph.attachment_path AS attachment_path, 
        CONCAT(ci.name, ' paid Rs. ', COALESCE(pi.cash, 0) + COALESCE(pi.upi, 0) + COALESCE(pi.cheque, 0) + COALESCE(pi.other, 0)) AS description, 
        COALESCE(pi.cash, 0) + COALESCE(pi.upi, 0) + COALESCE(pi.cheque, 0) + COALESCE(pi.other, 0) AS amount,
        0 AS debit,
        COALESCE(pi.cash, 0) + COALESCE(pi.upi, 0) + COALESCE(pi.cheque, 0) + COALESCE(pi.other, 0) AS credit,
        json_build_object('cash', COALESCE(pi.cash, 0), 'upi', COALESCE(pi.upi, 0), 'cheque', COALESCE(pi.cheque, 0), 'other', COALESCE(pi.other, 0)) AS payment_info
    FROM cust_payment_history AS ph 
    INNER JOIN cust_paymentinfo AS pi ON ph.id = pi.custpayhistoryid 
    INNER JOIN customerinfo AS ci ON ph.customer_id = ci.id 
    WHERE ci.market_id = $1

    UNION ALL

    SELECT 
        ph.id AS id, 
        'Employee payments' AS category, 
        CONCAT(ei.first_name, ' ', ei.last_name) AS name, 
        ph.payment_date AS payment_date, 
        ph.attachment_path AS attachment_path, 
        CONCAT(ei.first_name, ' ', ei.last_name, ' was paid - Rs. ', COALESCE(pi.cash, 0) + COALESCE(pi.upi, 0) + COALESCE(pi.cheque, 0) + COALESCE(pi.other, 0)) AS description, 
        COALESCE(pi.cash, 0) + COALESCE(pi.upi, 0) + COALESCE(pi.cheque, 0) + COALESCE(pi.other, 0) AS amount,
        COALESCE(pi.cash, 0) + COALESCE(pi.upi, 0) + COALESCE(pi.cheque, 0) + COALESCE(pi.other, 0) AS debit,
        0 AS credit,
        json_build_object('cash', COALESCE(pi.cash, 0), 'upi', COALESCE(pi.upi, 0), 'cheque', COALESCE(pi.cheque, 0), 'other', COALESCE(pi.other, 0)) AS payment_info
    FROM payment_history AS ph 
    INNER JOIN employee_paymentinfo AS pi ON ph.id = pi.paymenthistoryid 
    INNER JOIN employee_info AS ei ON ph.employee_id = ei.id 
    WHERE ei.market_id = $1

    UNION ALL

    SELECT 
        vp.id AS id, 
        'Vendor payments' AS category, 
        v.vendor_name AS name, 
        vp.payment_date AS payment_date, 
        vp.attachment_path AS attachment_path, 
        CONCAT(v.vendor_name, ' was paid - Rs. ', COALESCE(vp.amount, 0)) AS description, 
        COALESCE(vp.amount, 0) AS amount,
        COALESCE(vp.amount, 0) AS debit,
        0 AS credit,
        '{}'::json AS payment_info
    FROM vendor_payments AS vp 
    INNER JOIN vendors AS v ON vp.vendor_id = v.id 
    WHERE v.market_id = $1

    UNION ALL

    SELECT 
        pe.id AS id, 
        'EMI payments' AS category, 
        et.purpose AS name, 
        pe.payment_date AS payment_date, 
        pe.attachment_path AS attachment_path, 
        CONCAT('EMI payments for ', et.purpose, ' was paid - Rs. ', COALESCE(pe.cash, 0) + COALESCE(pe.upi, 0) + COALESCE(pe.cheque, 0) + COALESCE(pe.other, 0)) AS description, 
        COALESCE(pe.cash, 0) + COALESCE(pe.upi, 0) + COALESCE(pe.cheque, 0) + COALESCE(pe.other, 0) AS amount,
        COALESCE(pe.cash, 0) + COALESCE(pe.upi, 0) + COALESCE(pe.cheque, 0) + COALESCE(pe.other, 0) AS debit,
        0 AS credit,
        json_build_object('cash', COALESCE(pe.cash, 0), 'upi', COALESCE(pe.upi, 0), 'cheque', COALESCE(pe.cheque, 0), 'other', COALESCE(pe.other, 0)) AS payment_info
    FROM payments_for_emis AS pe 
    JOIN emi_types AS et ON pe.emi_types_id = et.id 
    WHERE et.market_id = $1

    UNION ALL

    SELECT 
        poe.id AS id, 
        'Other expenses' AS category, 
        poe.expense_name AS name, 
        poe.payment_date AS payment_date, 
        poe.attachment_path AS attachment_path, 
        CONCAT('Payment for ', poe.expense_name, ' was paid - Rs. ', COALESCE(poe.cash, 0) + COALESCE(poe.upi, 0) + COALESCE(poe.cheque, 0) + COALESCE(poe.other, 0)) AS description, 
        COALESCE(poe.cash, 0) + COALESCE(poe.upi, 0) + COALESCE(poe.cheque, 0) + COALESCE(poe.other, 0) AS amount,
        COALESCE(poe.cash, 0) + COALESCE(poe.upi, 0) + COALESCE(poe.cheque, 0) + COALESCE(poe.other, 0) AS debit,
        0 AS credit,
        json_build_object('cash', COALESCE(poe.cash, 0), 'upi', COALESCE(poe.upi, 0), 'cheque', COALESCE(poe.cheque, 0), 'other', COALESCE(poe.other, 0)) AS payment_info
    FROM payments_for_other_expenses AS poe 
    WHERE poe.market_id = $1

    UNION ALL

    SELECT 
        pe.id AS id, 
        'Used services payments' AS category, 
        est.service_name AS name, 
        pe.payment_date AS payment_date, 
        pe.attachment_path AS attachment_path, 
        CONCAT('Payments for ', est.service_name, ' was paid - Rs. ', COALESCE(pe.cash, 0) + COALESCE(pe.upi, 0) + COALESCE(pe.cheque, 0) + COALESCE(pe.other, 0)) AS description, 
        COALESCE(pe.cash, 0) + COALESCE(pe.upi, 0) + COALESCE(pe.cheque, 0) + COALESCE(pe.other, 0) AS amount,
        COALESCE(pe.cash, 0) + COALESCE(pe.upi, 0) + COALESCE(pe.cheque, 0) + COALESCE(pe.other, 0) AS debit,
        0 AS credit,
        json_build_object('cash', COALESCE(pe.cash, 0), 'upi', COALESCE(pe.upi, 0), 'cheque', COALESCE(pe.cheque, 0), 'other', COALESCE(pe.other, 0)) AS payment_info
    FROM payment_for_services_used AS pe 
    JOIN expense_service_types AS est ON pe.expense_service_types_id = est.id 
    WHERE est.market_id = $1
) AS transactions
WHERE 
($2::date IS NULL OR payment_date >= $2::date) AND
($3::date IS NULL OR payment_date <= $3::date) AND
($4::text IS NULL OR category LIKE '%' || $4::text || '%') AND
($5::text IS NULL OR description LIKE '%' || $5::text || '%') AND
($6::numeric IS NULL OR debit >= $6::numeric) AND
($7::numeric IS NULL OR debit <= $7::numeric) AND
($8::numeric IS NULL OR credit >= $8::numeric) AND
($9::numeric IS NULL OR credit <= $9::numeric)
ORDER BY payment_date DESC;
`