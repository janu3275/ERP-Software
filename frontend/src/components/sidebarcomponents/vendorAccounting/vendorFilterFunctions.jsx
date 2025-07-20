export const returnVendorStringifiedFilter = (filters, component) => {
    let finalfilter = returnFinalFilters(filters, component)
    return JSON.stringify(finalfilter)
  }


  const returnFinalFilters = ( filters, component ) => {
    let finalfilter = {}

  if(component==='VendorPayments'){
    finalfilter = {
      payment_date: returnFilterValue(0, filters, 'date'),
      amount: returnFilterValue(2, filters, 'number'),
      note: returnFilterValue(3, filters, 'string'),
     }
  }else if(component === 'VendorBills'){
    finalfilter = {
      
      bill_number: returnFilterValue(0, filters, 'string'),
      bill_date: returnFilterValue(2, filters, 'date'),
      bill_amount: returnFilterValue(3, filters, 'number'),
      inventory_added: returnFilterValue(4, filters, 'options'),
      note: returnFilterValue(5, filters, 'string')

    }
  }else if(component==='VendorPurchaseOrders'){
    finalfilter = {
      po_date: returnFilterValue(0, filters, 'date'),
      note: returnFilterValue(1, filters, 'string')
     
     }

  }else if(component==='VendorSummary'){
    finalfilter = {

      vendor_name: returnFilterValue(0, filters, 'string'),
      contact_person: returnFilterValue(1, filters, 'string'),
      phone_number: returnFilterValue(2, filters, 'string'),
      whatsapp_number: returnFilterValue(3, filters, 'string'),
      payment_status: returnFilterValue(4, filters, 'options'),
      total_bill: returnFilterValue(5, filters, 'number'),
      total_paid: returnFilterValue(6, filters, 'number'),
      outstanding: returnFilterValue(7, filters, 'number')
     
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
  