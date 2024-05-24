import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import ThemeProvider from './context/theme/themeprovider.jsx'; 
import AppWithBlurOnClick from './App.jsx';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


const queryClient = new QueryClient({
 
  queryCache: new QueryCache({
      onError: (error, query) => {
        if (query?.meta?.errorMessage) {
          console.error(query.meta.errorMessage)
        }else{
          console.log(error)
        }
      },
      
    })

});

ReactDOM.createRoot(document.getElementById('root')).render(

  <BrowserRouter>
  <ThemeProvider>
  <QueryClientProvider client={queryClient}>
    <App />
  <ReactQueryDevtools />
 </QueryClientProvider>
  </ThemeProvider>
  </BrowserRouter>

)
