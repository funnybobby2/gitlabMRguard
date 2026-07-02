import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '.';

export interface EyeState {
    sharingan:  boolean;
    suspicious: boolean;
    affected:   boolean;
    addict:     boolean;
    enervous:   boolean;
    surprised:  boolean;
    paranoid:   boolean;
    curiosity:  boolean;
    hypnose:    boolean;
    cyberpunk:  boolean;
    predator:   boolean;
    negative:   boolean;
}

export type EyeMode = keyof EyeState;

export const EMOTION_DURATIONS: Record<EyeMode, number> = {
    addict:    5000,
    affected:  5000,
    curiosity: 15000,
    cyberpunk: 10000,
    enervous:  5000,
    hypnose:   5000,
    negative:  5000,
    paranoid:  10000,
    predator:  8000,
    sharingan: 8000,
    surprised: 8000,
    suspicious: 8000,
};

export const initialState: EyeState = {
    addict:     false, // pupille dilatée
    affected:   false, // pupille qui tremble
    curiosity:  false, // suit la souris du regard
    cyberpunk:  false, // scanlines + glitch
    enervous:   false, // oeil penché sens horaire, paupière du haut plissée
    hypnose:    false, // iris violet qui tourne + pupille qui pulse
    negative:   false, // inversion des couleurs
    paranoid:   false, // suspicious + surprised
    predator:   false, // iris jaune ambré + pupille en fente verticale
    sharingan:  false, // iris rouge + tomoe qui tournent + halo rouge
    surprised:  false, // oeil penché sens antihoraire
    suspicious: false, // regard gauche/haut/bas/droite puis paupières plissées
};

const eyeSlice = createSlice({
    name: 'eye',
    initialState,
    reducers: {
        setMode(state, action: PayloadAction<{ mode: EyeMode; value: boolean }>) {
            const { mode, value } = action.payload;
            (Object.keys(initialState) as EyeMode[]).forEach(key => { state[key] = false; });
            state[mode] = value;
            if (mode === 'paranoid' && value) {
                state.suspicious = true;
                state.surprised  = true;
            }
        },
    },
});

export const { setMode } = eyeSlice.actions;


// Déclenche une émotion temporaire et la réinitialise après `duration` ms
export const triggerEmotion = (mode: EyeMode, duration: number, force = false) => (dispatch: AppDispatch, getState: () => RootState) => {
    if (!force && Object.values(getState().eye).some(Boolean)) return;

    dispatch(setMode({ mode, value: true }));
    setTimeout(() => {
        if (getState().eye[mode]) dispatch(setMode({ mode, value: false }));
    }, duration);
};

export default eyeSlice.reducer;
