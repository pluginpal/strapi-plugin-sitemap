import React from 'react';

export default () => {
  const [active, setActive] = React.useState(document.activeElement);

  const handleFocusIn = (e) => {
    setActive(document.activeElement);
  };

  React.useEffect(() => {
    document.addEventListener('focusin', handleFocusIn);
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, []);

  return active;
};

