import { configureStore } from '@reduxjs/toolkit'
import eyeReducer from './eyeSlice'
import configReducer from './configSlice'
import projectReducer from './projectSlice'

export const store = configureStore({
    reducer: {
        eye: eyeReducer,
        config: configReducer,
        project: projectReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
