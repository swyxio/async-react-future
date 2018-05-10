// credit: https://codesandbox.io/s/kk2v1op3m5

import React from 'react';
import styled from 'styled-components';

const StyledSpinner = styled.div`
  text-align: center;
  width: 14px;
  animation: spin infinite 2s linear reverse;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
export const Spinner = ({ size }) => {
  const fontSize = size === 'large' ? '28px' : '14px';
  return <StyledSpinner style={{ fontSize, lineHeight: fontSize }}>{'🌀'}</StyledSpinner>;
};
