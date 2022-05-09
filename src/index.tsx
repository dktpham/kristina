import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'

ReactDOM.render(
  <React.StrictMode>
    <HashRouter basename={'/kristina'}>
      <App />
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
