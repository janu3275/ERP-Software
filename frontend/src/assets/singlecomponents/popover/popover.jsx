import * as Popover from '@radix-ui/react-popover';
import { MixerHorizontalIcon, Cross2Icon } from '@radix-ui/react-icons';
import PropTypes from 'prop-types';
import './popover.css';

const PopoverDemo = ({children, Open, setOpen, icon, contentclass, btnclass, side}) =>{

const closeDialog = () => {
        setOpen(false);
    }
    console.log("popover open -->", Open)

return (

  <Popover.Root open={Open} onOpenChange={setOpen} modal={true} >
    <Popover.Trigger asChild>
     {icon}
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Content side={side} className={"PopoverContent " + contentclass} sideOffset={5}>
      {children}
        {/* <Popover.Close className="PopoverClose" aria-label="Close">
          <Cross2Icon />
        </Popover.Close> */}
        {/* <Popover.Arrow className="PopoverArrow" /> */}
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
  
);



}



PopoverDemo.propTypes = {
    children: PropTypes.element,
    Open:PropTypes.bool,
    setOpen:PropTypes.func,
    icon: PropTypes.any,
    contentclass: PropTypes.string,
    btnclass: PropTypes.string,
    side:PropTypes.string
};

export default PopoverDemo;