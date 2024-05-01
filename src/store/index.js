import { configureStore } from '@reduxjs/toolkit'
import tokenReducer from '../features/tokenReducer'

export const store = configureStore({
    reducer: {
        tokens: tokenReducer
    }
})
