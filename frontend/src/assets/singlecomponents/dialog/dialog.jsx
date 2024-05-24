import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import PropTypes from 'prop-types';
import "./dialog.css";


const DialogDemo = ({ children, Open, setOpen, buttontext, contentclass, showCrossBtn, btnclass }) => {

const closeDialog = () => {
  console.log("closekjnk ")
    setOpen(false);
}


return (
    
  <Dialog.Root open={Open} onOpenChange={setOpen}>
    <Dialog.Trigger asChild>
    {buttontext.length>0 && <button className={btnclass}>{buttontext}</button>}
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="DialogOverlay" />
      <Dialog.Content className={"DialogContent " + contentclass}>
      {children({ closeDialog })}
      {showCrossBtn && <Dialog.Close asChild>
        <button className="IconButton" aria-label="Close">
          <Cross2Icon />
        </button>
        </Dialog.Close>}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>

)};

DialogDemo.propTypes = {
    children: PropTypes.any,
    Open:PropTypes.bool.isRequired,
    setOpen:PropTypes.func,
    buttontext: PropTypes.string.isRequired,
    contentclass: PropTypes.string,
    showCrossBtn: PropTypes.any,
    btnclass: PropTypes.string
};



export default DialogDemo;