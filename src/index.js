import React from 'react';
import { render } from 'react-dom';
import { App } from './App';

let root = document.getElementById('root');
if (!root) throw new Error('Missing #root');
render(<App/>, root);
