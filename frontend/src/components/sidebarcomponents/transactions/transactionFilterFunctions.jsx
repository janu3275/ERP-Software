export const returnTransactionStringifiedFilter = (filters, component) => {
    let finalfilter = returnFinalFilters(filters, component)
    return JSON.stringify(finalfilter)
  }


  const returnFinalFilters = ( filters, component ) => {
    let finalfilter = {}

  if(component==='Transactions'){
    finalfilter = {
      date: returnFilterValue(0, filters, 'date'),
      category: returnFilterValue(1, filters, 'string'),
      description: returnFilterValue(2, filters, 'string'),
      debit: returnFilterValue(4, filters, 'number'),
      credit: returnFilterValue(5, filters, 'number')
     }
  }else if(component === 'Order'){
    finalfilter = {
      order_number: returnFilterValue(0, filters, 'string'),
      customer_name: returnFilterValue(1, filters, 'string'),
      order_date: returnFilterValue(2, filters, 'date'),
      completion_date: returnFilterValue(3, filters, 'date'),
      total_bill: returnFilterValue(4, filters, 'number'),
     
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
  