import React, { Suspense } from 'react';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import AppRoutes from './routes';
import Loader from './components/Loader';
import './styles/index.css';

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <Suspense fallback={
          <div className="min-h-screen bg-background flex items-center justify-center">
            <Loader text="Connecting to sacred scripture pathways..." />
          </div>
        }>
          <AppRoutes />
        </Suspense>
      </HashRouter>
    </Provider>
  );
}

export default App;
