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

const initialState: EyeState = {
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
        },
    },
});

export const { setMode } = eyeSlice.actions;


// Déclenche une émotion temporaire et la réinitialise après `duration` ms
export const triggerEmotion = (mode: EyeMode, duration: number) => (dispatch: AppDispatch, getState: () => RootState) => {
    // to not interrupt an ongoing emotion, we check if any emotion is active
    const eye = getState().eye;
    if (Object.values(eye).some(Boolean)) return;

    dispatch(setMode({ mode, value: true }));
    setTimeout(() => dispatch(setMode({ mode, value: false })), duration);
};

export default eyeSlice.reducer;
