import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { NextUIProvider } from '@nextui-org/react'
import { Provider } from 'react-redux'
import { store } from './store'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './plugins/yup'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
        },
    },
});


const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <NextUIProvider>
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <App />
                    <ToastContainer />
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </Provider>
        </NextUIProvider>
    </React.StrictMode>
)
