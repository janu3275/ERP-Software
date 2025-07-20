import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import classNames from 'classnames';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import PropTypes from 'prop-types';
import './accordion.css';

const AccordionDemo = ({items}) => (
  <Accordion.Root className="AccordionRoot" type="single"  collapsible defaultChecked={false}>
   {items.map((item, index)=> 
   <Accordion.Item key={index} className="AccordionItem" value="item-1">
      <AccordionTrigger >{item.trigger}</AccordionTrigger>
      <AccordionContent >{item.content}</AccordionContent>
    </Accordion.Item>)}

   
  </Accordion.Root>
);

AccordionDemo.displayName = 'AccordionDemo';

const AccordionTrigger = React.forwardRef(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Header className="AccordionHeader">
    <Accordion.Trigger
      className={classNames('AccordionTrigger', className)}
      {...props}
      ref={forwardedRef}
    >
      {children}
      <ChevronDownIcon className="AccordionChevron" aria-hidden />
    </Accordion.Trigger>
  </Accordion.Header>
));

AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionContent = React.forwardRef(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Content
    className={classNames('AccordionContent', className)}
    {...props}
    ref={forwardedRef}
  >
    <div className="AccordionContentText">{children}</div>
  </Accordion.Content>
));

AccordionContent.displayName = 'AccordionContent';



AccordionDemo.propTypes = {
  items: PropTypes.array.isRequired
}

AccordionTrigger.propTypes = {
  children: PropTypes.any,
  className: PropTypes.any
}

AccordionContent.propTypes = {
  children: PropTypes.any,
  className: PropTypes.any
}



export default AccordionDemo;