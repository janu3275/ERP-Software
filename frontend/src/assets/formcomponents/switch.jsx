import * as Switch from '@radix-ui/react-switch';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { styled } from '@stitches/react';
import { blackA } from '@radix-ui/colors';

const SwitchDemo = forwardRef(({label, value,  ...rest }, forwardedRef) => {
    let {onChange, name, ...props} = {...rest};
    console.log(forwardedRef, {...rest},value)

 return (
    <Flex css={{ alignItems: 'center' }}>
      <Label htmlFor={name} css={{ paddingRight: 15 }}>
        {label}
      </Label>
      <SwitchRoot ref={forwardedRef} name={label} checked={value} onCheckedChange={onChange} {...props}  id={name}>
        <SwitchThumb />
      </SwitchRoot>
    </Flex>
)

});

SwitchDemo.displayName = 'CheckboxDemo';
SwitchDemo.propTypes = {
    name: PropTypes.string.isRequired,
    register: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    value:PropTypes.any
}


const SwitchRoot = styled(Switch.Root, {
  all: 'unset',
  width: 42,
  height: 25,
  backgroundColor: blackA.blackA9,
  borderRadius: '9999px',
  position: 'relative',
  boxShadow: `0 2px 10px ${blackA.blackA7}`,
  WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
  '&:focus': { boxShadow: `0 0 0 2px black` },
  '&[data-state="checked"]': { backgroundColor: 'black' },
});

const SwitchThumb = styled(Switch.Thumb, {
  display: 'block',
  width: 21,
  height: 21,
  backgroundColor: 'white',
  borderRadius: '9999px',
  boxShadow: `0 2px 2px ${blackA.blackA7}`,
  transition: 'transform 100ms',
  transform: 'translateX(2px)',
  willChange: 'transform',
  '&[data-state="checked"]': { transform: 'translateX(19px)' },
});

const Flex = styled('div', { display: 'flex' });
const Label = styled('label', {
  color: 'black',
  fontSize: 15,
  lineHeight: 1,
});

export default SwitchDemo;