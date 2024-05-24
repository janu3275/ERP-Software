import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import './muiaccordion.css';

const Muiaccordion = ()=> (
    <Accordion className="linkaccordion">
    <AccordionSummary
      style={{color:"#828282" }}
      expandIcon={<ExpandMoreIcon style={{color:"#828282"}} />}
      aria-controls="panel1a-content"
      id="panel1a-header"
    >
      <Typography
        style={{ fontFamily: "'DM Sans', sans-serif",color:"#828282",fontSize:"16px",fontWeight:"500" }}
      >
        Tray Names
      </Typography>
    </AccordionSummary>
    <AccordionDetails >
      
    </AccordionDetails>
    </Accordion>
)

export default Muiaccordion;

