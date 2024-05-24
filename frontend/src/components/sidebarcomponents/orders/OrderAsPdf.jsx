// import "./Viewpaymentinfo.css";
import PropTypes from "prop-types";
import { Icon } from '@iconify/react';
import ViewOrder from "./viewOrder/vieworder";
import "./orderAspdf.css";





const OrderAsPdf = ({ selectedorder }) => {

    return (

        <div className="pdf">
            <ViewOrder selectedorder={selectedorder} />
        </div>

    )
}

OrderAsPdf.propTypes = { 
    selectedorder: PropTypes.object.isRequired

};


export default OrderAsPdf;