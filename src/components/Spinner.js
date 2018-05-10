// credit: https://codesandbox.io/s/kk2v1op3m5

import React from 'react';

export const Spinner = ({ size }) => {
  const fontSize = size === 'large' ? '28px' : '14px';
  return (
    <div className="Spinner" style={{ fontSize, lineHeight: fontSize }}>
      {'🌀'}
    </div>
  );
};
