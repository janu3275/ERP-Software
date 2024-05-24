import PropTypes from "prop-types";


const CustomerView = ({
    customerInfo
  }) => {
    return (
        <>
       
        <div style={{display:"flex", flexDirection:"column",  border: "1px solid rgb(233, 233, 231)", borderBottom:"0"  , borderRadius:"6px", color:"rgb(55, 53, 47)",}}>
        <div
            style={{
              padding: "20px",
              borderBottom: "1px solid rgb(233, 233, 231)",
              color:"rgb(55, 53, 47)",
              borderTopLeftRadius:"6px",
              borderTopRightRadius:"6px"
            }}
          >
            Customer information
          </div>
            {Object.entries(customerInfo).map(([key, value], index)=><div key={index} style={{display:"flex", flexDirection:"row", padding: "10px 20px",gap:"10px", borderBottom: "1px solid rgb(233, 233, 231)"}}>
                <div>{key}:</div>
                <div>{value}</div>
            </div>)}
        </div>

        </>
    )
}

CustomerView.propTypes = {
    customerInfo: PropTypes.object,
};

export default CustomerView;