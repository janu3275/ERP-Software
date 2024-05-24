import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import PropTypes from 'prop-types';
import './dropdown.css';

const DropdownMenuDemo = ({children, Open, setOpen, icon, contentclass, side}) => {
 

  return (
    <DropdownMenu.Root >
      <DropdownMenu.Trigger asChild>
      {icon}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content  side={side} className={"DropdownMenuContent " + contentclass} sideOffset={5}>
        {children}

          <DropdownMenu.Arrow className="DropdownMenuArrow " />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

DropdownMenuDemo.propTypes = {
    children: PropTypes.element,
    Open:PropTypes.bool.isRequired,
    setOpen:PropTypes.func,
    icon: PropTypes.any,
    contentclass: PropTypes.string,
    btnclass: PropTypes.string,
    side:PropTypes.string
};

export default DropdownMenuDemo;