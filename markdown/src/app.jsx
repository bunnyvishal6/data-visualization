import React from 'react';
import ReactDom from 'react-dom';
import Application from './components/main.jsx';

//Importing scss file
//require('!style!css!sass!./custom-scss.scss');

ReactDom.render(<Application />, document.getElementById('app'));