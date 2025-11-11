import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux';
import store from './stores/index.tsx';
import './plugins/muis.tsx'
import '@ant-design/v5-patch-for-react-19';
import  './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
    
  </StrictMode>,
)
