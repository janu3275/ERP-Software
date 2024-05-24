export const returnStringifiedFilter = (filters) => {
    let finalfilter = returnFinalFilters(filters)
    return JSON.stringify(finalfilter)
  }


  const returnFinalFilters = (filters) => {
   

   const finalfilter = {
      name: returnFilterValue(0, filters, 'string'),
      mobile_number: returnFilterValue(1, filters, 'string'),
      whatsapp_number: returnFilterValue(2, filters, 'string'),
      email_address: returnFilterValue(3, filters, 'string'),
      address: returnFilterValue(4, filters, 'string'),
      gstin: returnFilterValue(5, filters, 'string'),
      pan: returnFilterValue(6, filters, 'string'),
      adhaar_number: returnFilterValue(7, filters, 'string'),
      note: returnFilterValue(8, filters, 'string')
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
  