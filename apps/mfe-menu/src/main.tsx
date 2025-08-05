import '@bytebank/ui/globals.css'
import ReactDOM from 'react-dom/client'
import AppRouter from './AppRouter'
import reportWebVitals from './reportWebVitals.ts'

// Render the app apenas quando executado standalone
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.hasChildNodes()) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(<AppRouter enableDevtools={true} />)
} else if (rootElement) {
  rootElement.innerHTML = ''
  const root = ReactDOM.createRoot(rootElement)
  root.render(<AppRouter enableDevtools={true} />)
}

reportWebVitals()
