import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import Questions from './components/Questions';


ReactDOM.render(<Questions />, document.getElementById('root'));
registerServiceWorker();
