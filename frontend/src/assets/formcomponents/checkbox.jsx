import * as Checkbox from '@radix-ui/react-checkbox';
import { styled } from '@stitches/react';
import { violet, blackA } from '@radix-ui/colors';
import { CheckIcon } from '@radix-ui/react-icons';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const CheckboxDemo = forwardRef(({label, errors, value,  ...rest }, forwardedRef) => {
    let {onChange,name, ...props} = {...rest};
    console.log(forwardedRef, {...rest},value)
    return (
        <>
       <Flex css={{ alignItems: 'center' }}>
          <CheckboxRoot ref={forwardedRef} name={label} checked={value} onCheckedChange={onChange} {...props}  id={name}>
            <CheckboxIndicator >
              <CheckIcon />
            </CheckboxIndicator>
          </CheckboxRoot>
          <Label css={{ paddingLeft: 15 }} htmlFor={label}>
            {label}
          </Label>
        </Flex>
    {errors[name] && <p>{errors[name].message}</p>}
    </>
    )
});


CheckboxDemo.displayName = 'CheckboxDemo';
CheckboxDemo.propTypes = {
    label: PropTypes.string.isRequired,
    value:PropTypes.bool,
    onChange:PropTypes.func.isRequired,
    errors:PropTypes.object.isRequired,
  };


const CheckboxRoot = styled(Checkbox.Root, {
  all: 'unset',
  backgroundColor: 'white',
  width: 25,
  height: 25,
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: `0 2px 10px ${blackA.blackA7}`,
  '&:hover': { backgroundColor: violet.violet3 },
  '&:focus': { boxShadow: `0 0 0 2px black` },
  cursor:"pointer"
});

const CheckboxIndicator = styled(Checkbox.Indicator, {
  color: violet.violet11,
});

const Label = styled('label', {
  color: 'violet.violet11',
  fontSize: 15,
  lineHeight: 1,
});

const Flex = styled('div', { display: 'flex' });

export default CheckboxDemo;
