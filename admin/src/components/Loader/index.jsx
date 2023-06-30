import * as React from 'react';
import { Loader as LoaderComponent } from '@strapi/design-system';

const Loader = () => {
  const style = {
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(255,255,255, 0.6)',
    zIndex: 1,
    alignItems: 'center',
  };

  return (
    <div style={style}>
      <LoaderComponent>Loading content...</LoaderComponent>
    </div>
  );
};

export default Loader;
