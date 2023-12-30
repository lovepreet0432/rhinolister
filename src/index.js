import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './redux/store';

const Root = () => {
  const isOnline = navigator.onLine;

  if (!isOnline) {
    return <div className='internet d-flex align-items-center justify-content-center'>
      <div>
        <h2 className='text-center text-danger'>No Internet Connection</h2>
        <p className='text-center'>Please check your internet connection.</p>
      </div>
    </div>;
  }

  return (
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
};

ReactDOM.render(<Root />, document.getElementById('root'));

reportWebVitals();
