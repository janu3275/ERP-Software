// withBlurOnClick.js

import React, { useEffect } from 'react';

const withBlurOnClick = (WrappedComponent) => {
  const WithBlurOnClick = (props) => {
    useEffect(() => {
      const handleClick = (event) => {
        if (event.target.matches('button')) {
          event.target.blur(); // Remove focus when a button is clicked
        }
      };

      document.addEventListener('click', handleClick);

      return () => {
        document.removeEventListener('click', handleClick);
      };
    }, []);

    return <WrappedComponent {...props} />;
  };

  return WithBlurOnClick;
};

export default withBlurOnClick;
