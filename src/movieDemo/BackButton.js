// credit: https://codesandbox.io/s/kk2v1op3m5

import React from 'react';
import styled from 'styled-components';

const Btn = styled.button`
  background-color: #282828;
  border: 1px solid #444;
  border-radius: 5px;
  font-size: 1.2rem;
  padding: 0.2rem 0.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
`;

export function BackButton(props) {
  return <Btn {...props}>{'👈'}</Btn>;
}
