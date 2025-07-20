export const returnOrderStringifiedFilter = (filters, component) => {
    let finalfilter = returnFinalFilters(filters, component)
    return JSON.stringify(finalfilter)
  }


  const returnFinalFilters = (filters, component) => {
    let finalfilter = {}

  if(component==='CustomerPayments'){
    finalfilter = {
      payment_date: returnFilterValue(0, filters, 'date'),
      amount: returnFilterValue(1, filters, 'number'),
      description: returnFilterValue(2, filters, 'string'),
     }
  }else if(component === 'Order'){
    finalfilter = {
      order_number: returnFilterValue(0, filters, 'string'),
      customer_name: returnFilterValue(1, filters, 'string'),
      order_date: returnFilterValue(2, filters, 'date'),
      completion_date: returnFilterValue(3, filters, 'date'),
      total_bill: returnFilterValue(4, filters, 'number'),
     
    }
  }else if(component === 'OrderAll'){
    finalfilter = {
      order_number: returnFilterValue(0, filters, 'string'),
      order_status: returnFilterValue(1, filters, 'options'),
      customer_name: returnFilterValue(2, filters, 'string'),
      order_date: returnFilterValue(3, filters, 'date'),
      completion_date: returnFilterValue(4, filters, 'date'),
      total_bill: returnFilterValue(5, filters, 'number'),
     
    }
  }
  else if(component==='CustomerOrders'){
    finalfilter = {

      order_number: returnFilterValue(0, filters, 'string'),
      order_status: returnFilterValue(1, filters, 'options'),
      customer_name: returnFilterValue(2, filters, 'string'),
      order_date: returnFilterValue(3, filters, 'date'),
      completion_date: returnFilterValue(4, filters, 'date'),
      total_bill: returnFilterValue(5, filters, 'number')
     
     }

  }else if(component==='CustomerSummary'){
    finalfilter = {

      customer_name: returnFilterValue(0, filters, 'string'),
      mobile_number: returnFilterValue(1, filters, 'string'),
      whatsapp_number: returnFilterValue(2, filters, 'string'),
      payment_status: returnFilterValue(3, filters, 'options'),
      total_bill: returnFilterValue(4, filters, 'number'),
      total_paid: returnFilterValue(5, filters, 'number'),
      outstanding: returnFilterValue(5, filters, 'number')
     
     }
  }

    console.log( filters, finalfilter )
    return finalfilter;
    
  }


  const returnFilterValue = (index, filters, colType) => {

    if (!filters) {
      return colType === 'string' || colType === 'options' ? null : { minValue: null, maxValue: null };
    }
    filters = filters.filter((obj)=>obj) // To remove null values from filter
    console.log(filters)
    const filter = filters.find(obj => obj.colIndex === index) || {};
  
    if (colType === 'string' || colType === 'options') {
      return filter.filterValue || null;
    } else if (colType === 'number' || colType === 'date') {
      return {
        minValue: filter.filterValue?.minValue || null,
        maxValue: filter.filterValue?.maxValue || null
      };
    }
  
    return null

  };
  