const orderQueries = {

    
        addorderinfoqry : `INSERT INTO order_info (
          order_id,
          customer_id,
          order_date,
          completion_date,
          measuredby,
          product_charges,
          measurement_charges,
          dilevery_charges,
          labour_charges,
          fitting_charges,
          discount,
          order_status,
          market_id
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
        )returning *;`,

        addOrderProductsqry : `INSERT INTO order_products (
        product_id,
        orderid
       
      ) VALUES ( $1, $2 ) returning *;`,

        addOrderProductServiceqry : `INSERT INTO order_prod_services (
          glass_custom_service_id,
          order_products_id
        ) VALUES (
          $1, 
          $2 
        );
        `,

        addOrderProductItemsqry : `INSERT INTO order_prod_items (
        length,
        width,
        area,
        quantity,
        charge,
        total,
        img_path,
        item_id,
        order_products_id,
        orderid
      ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10 ) returning *;`,

        addOrderProductAccessoryqry : `INSERT INTO order_prod_accessory (
        accessory_id,
        quantity,
        total,
        order_products_id
        ) VALUES ( $1, $2, $3, $4 ) returning *;`,

        addPaymentqry : `INSERT INTO paymentinfo (
          cash,
          upi,
          cheque,
          other,
          payment_date,
          note,
          orderid
      ) VALUES ( $1, $2, $3, $4, $5, $6, $7 ) returning *;`,

        addPaymentMediumqry : `INSERT INTO paymedium (
        amount,
        medium,
        paymentid,
        orderid,
        companyid
      ) VALUES ($1, $2, $3, $4, $5 ) returning *;` ,
        
        updateOrderInfoqry : `UPDATE order_info 
        SET
        order_date = $1,
        completion_date = $2,
        measuredby = $3,
        product_charge = $4,
        carriage_charge = $5,
        labour_charge = $6,
        other_charge = $7,
        total_bill = $8,
        discount = $9,
        pending = $10,
        customerid = $11
        WHERE
        id = $12
        returning *;`,

        updateOrderProductsqry : `UPDATE order_products
        SET
        product = $1,
        service = $2,
        charge = $3,
        WHERE
        id = $4
        returning *;`,

        updateOrderProductItemsqry : `UPDATE order_prod_items
        SET 
        length = $1,
        width = $2,
        area = $3,
        quantity = $4,
        charge = $5,
        WHERE
        id = $6
        returning *;`,

        updateOrderProductAccessoryqry : `UPDATE order_prod_accessory
        SET 
        accessory = $1,
        quantity = $2,
        total = $3,
        WHERE
        id = $4
        returning *;`,

        updatePaymentqry : `UPDATE paymentinfo
        SET
        paid_amount = $1,
        payment_date = $2,
        WHERE
        id = $3
        returning *;`,

        updatePaymentMediumqry : `UPDATE paymedium
        SET
        amount = $1,
        medium = $2,
        WHERE
        id = $3
        returning *;` ,

        updateOrderStatusqry : `UPDATE order_info
        SET order_status = $1
        WHERE id = $2 returning *;`,

        updatePaymentStatusqry : `UPDATE order_info
        SET payment_status = $1
        WHERE id = $2 returning *;`,


        getOrderInfoById : {
          OrderInfoqry: `SELECT * from order_info
          WHERE order_info.id = $1;`,
          ProductInfoqry : `SELECT * FROM order_products where orderid = $1`,
          Servicearr_Infoqry : `SELECT glass_custom_service_id FROM order_prod_services where order_products_id = $1`,
          Prod_item_infoqry : `SELECT * FROM order_prod_items where order_products_id = $1`,
          Prod_access_infoqry : `SELECT * FROM order_prod_accessory where order_products_id = $1`,
          PaymentInfoqry : `SELECT * FROM paymentinfo where orderid = $1`,
          // PaymentMediumInfoqry : `SELECT * FROM paymedium where paymentid = $1`,
        },

        // getAllOrderqry : `SELECT
        // oi.order_id AS orderno,
        // MAX(oi.id) AS id,
        // MAX(oi.order_date) AS date,
        // MAX(oi.completion_date) AS "completionDate",
        // json_build_object('name', c.name, 'id', c.id) AS customer,
        // json_build_object(
        //   'productCharge', MAX(oi.product_charge),
        //   'CarriageCharge', MAX(oi.carriage_charge),
        //   'LabourCharge', MAX(oi.labour_charge),
        //   'otherCharge', MAX(oi.other_charge),
        //   'paid', MAX(p.paid_amount),
        //   'pending', MAX(oi.pending),
        //   'discount', MAX(oi.discount),
        //   'totalbill', MAX(oi.total_bill)
        // ) AS payment,
        // json_agg(json_build_object('paid', p.paid_amount, 'date', p.payment_date)) AS paymenthis
        // FROM orderinfo oi
        // JOIN customerinfo c ON oi.customerid = c.id
        // LEFT JOIN paymentinfo p ON oi.id = p.orderid
        // WHERE oi.companyid = $1
        // GROUP BY oi.order_id, c.name, c.id;`

        getAllOrderByOrderStatusqry : `SELECT 
        oi.id AS id,
        oi.order_id AS order_number,
        ci.name AS customer_name,
        ci.mobile_number AS customer_mobile_number,
        ci.whatsapp_number AS customer_whatsapp_number,
        ci.email_address AS customer_email_address,
        ci.company_name AS customer_company_name,
        ci.address AS customer_address,
        oi.order_date AS order_date,
        oi.completion_date AS completion_date,
        oi.measuredby AS measured_by,
        oi.product_charges AS product_charges,
        oi.measurement_charges AS measurement_charges,
        oi.dilevery_charges AS dilevery_charges,
        oi.labour_charges AS labour_charges,
        oi.fitting_charges AS fitting_charges,
        oi.discount AS discount,
        oi.order_status AS order_status
    FROM 
        order_info oi
    JOIN 
        customerinfo ci ON oi.customer_id = ci.id
    WHERE 
        oi.market_id = $1 AND oi.order_status IN ($2)
    GROUP BY 
        oi.id, 
        ci.id;
        `,

        getFilteredOrderByStatusqry:`SELECT
        oi.id AS id,
        oi.order_id AS order_number,
        ci.name AS customer_name,
        ci.mobile_number AS customer_mobile_number,
        ci.whatsapp_number AS customer_whatsapp_number,
        ci.email_address AS customer_email_address,
        ci.company_name AS customer_company_name,
        ci.address AS customer_address,
        oi.order_date AS order_date,
        oi.completion_date AS completion_date,
        oi.measuredby AS measured_by,
        oi.product_charges AS product_charges,
        oi.measurement_charges AS measurement_charges,
        oi.dilevery_charges AS dilevery_charges,
        oi.labour_charges AS labour_charges,
        oi.fitting_charges AS fitting_charges,
        oi.discount AS discount,
        oi.order_status AS order_status,
        (oi.product_charges + COALESCE(CAST(oi.measurement_charges->>'total' AS NUMERIC), 0) + COALESCE(CAST(oi.dilevery_charges->>'total' AS NUMERIC), 0) + oi.labour_charges + COALESCE(CAST(oi.fitting_charges->>'total' AS NUMERIC), 0) - COALESCE(oi.discount, 0)) AS total_bill
      FROM
        order_info oi
        JOIN customerinfo ci ON oi.customer_id = ci.id
      WHERE
        oi.market_id = $1
        AND oi.order_status IN ($2)
        AND (
          $3 IS NULL
          OR ci.name LIKE '%' || $3 || '%'
        )
        AND (
          $4 IS NULL
          OR oi.order_date >= $4
        )
        AND (
          $5 IS NULL
          OR oi.order_date <= $5
        )
        AND (
          $6 IS NULL
          OR oi.completion_date >= $6
        )
        AND (
          $7 IS NULL
          OR oi.completion_date <= $7
        )
        AND (
          $8 IS NULL
          OR (oi.product_charges + COALESCE(CAST(oi.measurement_charges->>'total' AS NUMERIC), 0) + COALESCE(CAST(oi.dilevery_charges->>'total' AS NUMERIC), 0) + oi.labour_charges + COALESCE(CAST(oi.fitting_charges->>'total' AS NUMERIC), 0) - COALESCE(oi.discount, 0)) >= $8
        )
        AND (
          $9 IS NULL
          OR (oi.product_charges + COALESCE(CAST(oi.measurement_charges->>'total' AS NUMERIC), 0) + COALESCE(CAST(oi.dilevery_charges->>'total' AS NUMERIC), 0) + oi.labour_charges + COALESCE(CAST(oi.fitting_charges->>'total' AS NUMERIC), 0) - COALESCE(oi.discount, 0)) <= $9
        )
      GROUP BY
        oi.id,
        ci.id;`,

        getAllOrderByCustomerqry : `SELECT 
        oi.id AS id,
        oi.order_id AS order_number,
        ci.name AS customer_name,
        ci.mobile_number AS customer_mobile_number,
        ci.whatsapp_number AS customer_whatsapp_number,
        ci.email_address AS customer_email_address,
        ci.company_name AS customer_company_name,
        ci.address AS customer_address,
        oi.order_date AS order_date,
        oi.completion_date AS completion_date,
        oi.measuredby AS measured_by,
        oi.product_charges AS product_charges,
        oi.measurement_charges AS measurement_charges,
        oi.dilevery_charges AS dilevery_charges,
        oi.labour_charges AS labour_charges,
        oi.fitting_charges AS fitting_charges,
        oi.discount AS discount,
        oi.order_status AS order_status
    FROM 
        order_info oi
    JOIN 
        customerinfo ci ON oi.customer_id = ci.id
    WHERE 
        oi.market_id = $1 AND oi.customer_id = $2
    GROUP BY 
        oi.id, 
        ci.id;
        `,

        getFilteredOrderByCustomerQry: `SELECT
        oi.id AS id,
        oi.order_id AS order_number,
        ci.name AS customer_name,
        ci.mobile_number AS customer_mobile_number,
        ci.whatsapp_number AS customer_whatsapp_number,
        ci.email_address AS customer_email_address,
        ci.company_name AS customer_company_name,
        ci.address AS customer_address,
        oi.order_date AS order_date,
        oi.completion_date AS completion_date,
        oi.measuredby AS measured_by,
        oi.product_charges AS product_charges,
        oi.measurement_charges AS measurement_charges,
        oi.dilevery_charges AS dilevery_charges,
        oi.labour_charges AS labour_charges,
        oi.fitting_charges AS fitting_charges,
        oi.discount AS discount,
        oi.order_status AS order_status,
        (oi.product_charges + oi.measurement_charges->>'total' + oi.dilevery_charges->>'total' + oi.labour_charges + oi.fitting_charges->>'total' - COALESCE(oi.discount, 0)) AS total_bill
      FROM
        order_info oi
        JOIN customerinfo ci ON oi.customer_id = ci.id
      WHERE
        oi.market_id = $1
        AND oi.customer_id = $2
        AND (
          $3 IS NULL
          OR oi.order_status = $3
        )
        AND (
          $4 IS NULL
          OR ci.name LIKE '%' || $4 || '%'
        )
        AND (
          $5 IS NULL
          OR oi.order_date >= $5
        )
        AND (
          $6 IS NULL
          OR oi.order_date <= $6
        )
        AND (
          $7 IS NULL
          OR oi.completion_date >= $7
        )
        AND (
          $8 IS NULL
          OR oi.completion_date <= $8
        )
        AND (
          $9 IS NULL
          OR (COALESCE(oi.product_charges,0) +
          COALESCE(CAST(oi.measurement_charges->>'total' AS NUMERIC), 0) +
          COALESCE(CAST(oi.dilevery_charges->>'total' AS NUMERIC), 0) +
          COALESCE(oi.labour_charges,0) +
          COALESCE(CAST(oi.fitting_charges->>'total' AS NUMERIC), 0) -
          COALESCE(oi.discount, 0)) >= $9
        )
        AND (
          $10 IS NULL
          OR (COALESCE(oi.product_charges,0) +
            COALESCE(CAST(oi.measurement_charges->>'total' AS NUMERIC), 0) +
            COALESCE(CAST(oi.dilevery_charges->>'total' AS NUMERIC), 0) +
            COALESCE(oi.labour_charges,0) +
            COALESCE(CAST(oi.fitting_charges->>'total' AS NUMERIC), 0) -
            COALESCE(oi.discount, 0)) <= $10
        )
      GROUP BY
        oi.id,
        ci.id;`,

        getAllOrdersqry : `SELECT 
        oi.id AS id,
        oi.order_id AS order_number,
        ci.name AS customer_name,
        ci.mobile_number AS customer_mobile_number,
        ci.whatsapp_number AS customer_whatsapp_number,
        ci.email_address AS customer_email_address,
        ci.company_name AS customer_company_name,
        ci.address AS customer_address,
        oi.order_date AS order_date,
        oi.completion_date AS completion_date,
        oi.measuredby AS measured_by,
        oi.product_charges AS product_charges,
        oi.measurement_charges AS measurement_charges,
        oi.dilevery_charges AS dilevery_charges,
        oi.labour_charges AS labour_charges,
        oi.fitting_charges AS fitting_charges,
        oi.discount AS discount,
        oi.order_status AS order_status
    FROM 
        order_info oi
    JOIN 
        customerinfo ci ON oi.customer_id = ci.id
    WHERE 
        oi.market_id = $1 
    GROUP BY 
        oi.id, 
        ci.id;
        `,

        getFilteredAllOrderqry : `SELECT
        oi.id AS id,
        oi.order_id AS order_number,
        ci.name AS customer_name,
        ci.mobile_number AS customer_mobile_number,
        ci.whatsapp_number AS customer_whatsapp_number,
        ci.email_address AS customer_email_address,
        ci.company_name AS customer_company_name,
        ci.address AS customer_address,
        oi.order_date AS order_date,
        oi.completion_date AS completion_date,
        oi.measuredby AS measured_by,
        oi.product_charges AS product_charges,
        oi.measurement_charges AS measurement_charges,
        oi.dilevery_charges AS dilevery_charges,
        oi.labour_charges AS labour_charges,
        oi.fitting_charges AS fitting_charges,
        oi.discount AS discount,
        oi.order_status AS order_status,
        (oi.product_charges + COALESCE(CAST(oi.measurement_charges->>'total' AS NUMERIC), 0) + COALESCE(CAST(oi.dilevery_charges->>'total' AS NUMERIC), 0) + oi.labour_charges + COALESCE(CAST(oi.fitting_charges->>'total' AS NUMERIC), 0) - COALESCE(oi.discount, 0)) AS total_bill
      FROM
        order_info oi
        JOIN customerinfo ci ON oi.customer_id = ci.id
      WHERE
        oi.market_id = $1
        AND (
          $2 IS NULL
          OR ci.name LIKE '%' || $2 || '%'
        )
        AND (
          $3 IS NULL
          OR oi.order_date >= $3
        )
        AND (
          $4 IS NULL
          OR oi.order_date <= $4
        )
        AND (
          $5 IS NULL
          OR oi.completion_date >= $5
        )
        AND (
          $6 IS NULL
          OR oi.completion_date <= $6
        )
        AND (
          $7 IS NULL
          OR oi.order_status = $7
        )
        AND (
          $8 IS NULL
          OR (oi.product_charges + COALESCE(CAST(oi.measurement_charges->>'total' AS NUMERIC), 0) + COALESCE(CAST(oi.dilevery_charges->>'total' AS NUMERIC), 0) + oi.labour_charges + COALESCE(CAST(oi.fitting_charges->>'total' AS NUMERIC), 0) - COALESCE(oi.discount, 0)) >= $8
        )
        AND (
          $9 IS NULL
          OR (oi.product_charges + COALESCE(CAST(oi.measurement_charges->>'total' AS NUMERIC), 0) + COALESCE(CAST(oi.dilevery_charges->>'total' AS NUMERIC), 0) + oi.labour_charges + COALESCE(CAST(oi.fitting_charges->>'total' AS NUMERIC), 0) - COALESCE(oi.discount, 0)) <= $9
        )
      GROUP BY
        oi.id,
        ci.id;`,

        getAllCustomerSummary: `SELECT
        c.id AS id,
        c.name AS customer_name,
        c.mobile_number,
        c.whatsapp_number,
        SUM(order_total) AS total_bill,
        SUM(payment_total) AS total_paid
    FROM
        public.customerinfo c
        LEFT JOIN (
            SELECT
                customer_id,
                SUM(product_charges +
                    COALESCE(CAST(measurement_charges->>'total' AS NUMERIC), 0) +
                    COALESCE(CAST(dilevery_charges->>'total' AS NUMERIC), 0) +
                    labour_charges +
                    COALESCE(CAST(fitting_charges->>'total' AS NUMERIC), 0) -
                    discount) AS order_total
            FROM
                public.order_info
            GROUP BY
                customer_id
        ) oi ON c.id = oi.customer_id
        LEFT JOIN (
            SELECT
                customer_id,
                SUM(cash + upi + cheque + other) AS payment_total
            FROM
                public.cust_payment_history cph
                JOIN public.cust_paymentinfo cpi ON cph.id = cpi.custpayhistoryid
            GROUP BY
                customer_id
        ) pi ON c.id = pi.customer_id
    WHERE
        c.market_id = $1
    GROUP BY
        c.id, c.name, c.mobile_number, c.whatsapp_number;`,
 getAllCustomerSummaryFiltered:`
      SELECT  
  c.id AS id,
  c.name AS customer_name,
  c.mobile_number,
  c.whatsapp_number,
  COALESCE(SUM(oi.order_total), 0) AS total_bill,
  COALESCE(SUM(pi.payment_total), 0) AS total_paid,
  COALESCE(SUM(oi.order_total), 0) - COALESCE(SUM(pi.payment_total), 0) AS outstanding,
  CASE
    WHEN COALESCE(SUM(oi.order_total), 0) - COALESCE(SUM(pi.payment_total), 0) <= 0 THEN 'paid'
    ELSE 'payment pending'
  END AS payment_status
FROM
  public.customerinfo c
  LEFT JOIN (
    SELECT
      customer_id,
      SUM(
        product_charges + COALESCE(CAST(measurement_charges->>'total' AS NUMERIC), 0) + COALESCE(CAST(dilevery_charges->>'total' AS NUMERIC), 0) + labour_charges + COALESCE(CAST(fitting_charges->>'total' AS NUMERIC), 0) - COALESCE(discount, 0)
      ) AS order_total
    FROM
      public.order_info
    GROUP BY
      customer_id
  ) oi ON c.id = oi.customer_id
  LEFT JOIN (
    SELECT
      customer_id,
      SUM(cash + upi + cheque + other) AS payment_total
    FROM
      public.cust_payment_history cph
      JOIN public.cust_paymentinfo cpi ON cph.id = cpi.custpayhistoryid
    GROUP BY
      customer_id
  ) pi ON c.id = pi.customer_id
WHERE
  c.market_id = $1
  AND (
    $2 IS NULL
    OR c.name LIKE '%' || $2 || '%'
  )
  AND (
    $3 IS NULL
    OR c.mobile_number LIKE '%' || $3 || '%'
  )
  AND (
    $4 IS NULL
    OR c.whatsapp_number LIKE '%' || $4 || '%'
  )
  AND (
    $5 IS NULL
    OR (
      CASE
        WHEN COALESCE(SUM(oi.order_total), 0) - COALESCE(SUM(pi.payment_total), 0) <= 0 THEN 'paid'
        ELSE 'payment pending'
      END = $5
    )
  )
  AND (
    $6 IS NULL
    OR COALESCE(SUM(oi.order_total), 0) >= $6
  )
  AND (
    $7 IS NULL
    OR COALESCE(SUM(oi.order_total), 0) <= $7
  )
  AND (
    $8 IS NULL
    OR COALESCE(SUM(pi.payment_total), 0) >= $8
  )
  AND (
    $9 IS NULL
    OR COALESCE(SUM(pi.payment_total), 0) <= $9
  )
  AND (
    $10 IS NULL
    OR (COALESCE(SUM(oi.order_total), 0) - COALESCE(SUM(pi.payment_total), 0)) >= $10
  )
  AND (
    $11 IS NULL
    OR (COALESCE(SUM(oi.order_total), 0) - COALESCE(SUM(pi.payment_total), 0)) <= $11
  )
GROUP BY
  c.id,
  c.name,
  c.mobile_number,
  c.whatsapp_number;`  
}

export { orderQueries };



