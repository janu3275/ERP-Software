// This file is for options we don't need to store in database -  paymentItems and orderItems

import { Icon } from "@iconify/react/dist/iconify.js"
import { returnAttendanceStatusEle, returnBoolEle, returnCategoryEle, returnOrderStatusEle, returnOtherEle, returnPaymenStatusEle } from "../../../../commonfn"



export const paymentItems = [{

          label: "Payment status",
          items: [{
            label: returnPaymenStatusEle('paid'),
            value: 'paid',
          },{ 
            label: returnPaymenStatusEle('payment pending'),
            value: 'payment pending'
          }],
}]

export const orderItems =  [{

    
         label: "Order status",
          items: [
           {
            label: returnOrderStatusEle('Not yet started'),
            value: 'Not yet started',
          },{ 
            label: returnOrderStatusEle('In process'),
            value: 'In process'
          },
          {
            label: returnOrderStatusEle('completed'),
            value: 'completed',
          },{ 
            label: returnOrderStatusEle('sent for dilevery'),
            value: 'sent for dilevery'
          },
          {
            label: returnOrderStatusEle('dilevered'),
            value: 'dilevered',
          },
          {
            label: returnOrderStatusEle('hold'),
            value: 'hold',
          },
          {
            label: returnOrderStatusEle('removed'),
            value: 'removed',
          }
        ],
}]


export const holdOrderItems =  [{

    
  label: "Order status",
   items: [
    { 
     label: 'hold',
     value: 'hold'
   }
 ],
}]

export const removeOrderItems =  [{

    
  label: "Order status",
   items: [
   { 
     label: 'removed',
     value: 'removed'
   }
 ],
}]

export const statusItems =  [{

    
  label: "Attendance status",
   items: [
   { 
     label: returnAttendanceStatusEle('present'),
     value: 'present'
   },{

    label: returnAttendanceStatusEle('absent'),
    value: 'absent'

   }
 ],
}]


export const bankItems =  [{

    
  label: "Banks",
   items: [
   { 
     label: 'SBI (State bank of india)',
     value: 'SBI (State bank of india)'
   },
   { 
    label: 'HDFC bank',
    value: 'HDFC bank'
  },
  { 
    label: 'ICIC bank',
    value: 'ICIC bank'
  },
  { 
    label: 'JK bank (Jammu and kashmir bank)',
    value: 'JK bank (Jammu and kashmir bank)'
  }
 ],

}]


export const ProductTypeItems =  [{

    
  label: "Product type",
   items: [

   { 
     label: returnOtherEle('Glass products'),
     value: 'glass products'
   },
   { 
    label: returnOtherEle('Glass accessories'),
    value: 'glass accessories'
  },
  { 
    label: returnOtherEle('Other products'),
    value: 'other products'
  }

 ]

}]

export const boolItems =  [{

   label: "Bool",
   items: [
   { 
     label: returnBoolEle('True'),
     value: 'True'
   },
   { 
    label: returnBoolEle('False'),
    value: 'False'
   }
 ]

}]


export const transactionItems =  [{

  label: "Category",
  items: [

   { 
    label: returnCategoryEle('Customer payments'),
    value: 'Customer payments'
   },
   { 
   label: returnCategoryEle('Employee payments'),
   value: 'Employee payments'
   },
   { 
    label: returnCategoryEle('Vendor payments'),
    value: 'Vendor payments'
   },
   { 
    label: returnCategoryEle('EMI payments'),
    value: 'EMI payments'
   },
   { 
    label: returnCategoryEle('Used services payments'),
    value: 'Used services payments'
   },
   { 
    label: returnCategoryEle('Other expenses'), 
    value: 'Other expenses'
   }
]

}]










  