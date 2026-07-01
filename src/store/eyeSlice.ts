import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppDispatch } from '.';

export interface EyeState {
    sharingan:  boolean;
    suspicious: boolean;
    affected:   boolean;
    addict:     boolean;
    enervous:   boolean;
    surprised:  boolean;
    paranoid:   boolean;
    curiosity:  boolean;
    hypnose:     boolean;
    cyberpunk:   boolean;
    predator:    boolean;
    negative:    boolean;
    default:     boolean;
}

export type EyeMode = keyof EyeState;

const initialState: EyeState = {
    sharingan:  false, // sharingan est un mode permanant (iris rouge + tomoe qui tournent + halo rouge)
    suspicious: false, // suspicious est un mode temporaire, autoreset après sa durée (regard a gauche, haut, bas, droite, puis paupières plissées)
    affected:   false, // affected est un mode temporaire, autoreset après sa durée (pupille qui bouge)
    addict:     false, // addict est un mode temporaire, autoreset après sa durée (pupille dilatée)
    enervous:   false, // enervous est un mode permanant (oeil penché sens horaire, paupière du haut plissée)
    surprised:  false, // surprised est un mode permanant (oeil penché sens antihoraire)
    paranoid:   false, // suspicious + surprised
    curiosity:  false, // suit la souris du regard
    hypnose:     false, // hypnose est un mode temporaire, autoreset après sa durée (iris violet qui tourne + pupille qui pulse)
    cyberpunk:   false, // cyberpunk est un mode permanant (scanlines + glitch)
    predator:    false, // predator est un mode permanant (iris jaune ambré + pupille fente verticale)
    negative:    false, // negative est un mode permanant (inversion des couleurs)
    default:     false, // mode par défaut
};

const eyeSlice = createSlice({
    name: 'eye',
    initialState,
    reducers: {
        setMode(state, action: PayloadAction<{ mode: EyeMode; value: boolean }>) {
            const { mode, value } = action.payload;
            if (value) {
                if(mode === 'default') {
                    state.affected = false;
                    state.addict = false;
                    state.enervous = false;
                    state.surprised = false;
                    state.hypnose = false;
                    state.cyberpunk = false;
                    state.predator = false;
                    state.negative = false;
                };

                if(mode === 'addict') state.affected = false;

                if(mode === 'affected') state.addict = false;

                if(mode === 'enervous') {
                    state.surprised = false;
                    state.suspicious = false;
                    state.hypnose = false;
                    state.cyberpunk = false;
                }

                if(mode === 'surprised') state.enervous = false;

                if(mode==='suspicious') {
                    state.enervous = false;
                    state.sharingan = false;
                    state.hypnose = false;
                    state.cyberpunk = false;
                }
                if(mode==='paranoid') {
                    state.suspicious = true;
                    state.surprised = true;
                    state.hypnose = false;
                    state.cyberpunk = false;
                }
                if(mode==='curiosity') {
                    state.suspicious = false;
                    state.sharingan = false;
                    state.hypnose = false;
                    state.cyberpunk = false;
                }
                if(mode==='hypnose') {
                    state.suspicious = false;
                    state.sharingan = false;
                    state.enervous = false;
                    state.cyberpunk = false;
                    state.predator = false;
                }
                if(mode==='sharingan') {
                    state.hypnose = false;
                    state.cyberpunk = false;
                    state.predator = false;
                }
                if(mode==='cyberpunk') {
                    state.suspicious = false;
                    state.sharingan = false;
                    state.hypnose = false;
                    state.affected = false;
                    state.addict = false;
                    state.enervous = false;
                    state.surprised = false;
                    state.predator = false;
                }
            }
            state[mode] = value;
        },
    },
});

export const { setMode } = eyeSlice.actions;

// Modes temporisés : auto-reset après leur durée
export const triggerAffected = () => (dispatch: AppDispatch) => {
    dispatch(setMode({ mode: 'affected', value: true }));
    setTimeout(() => dispatch(setMode({ mode: 'affected', value: false })), 5000);
};

export const triggerAddict = () => (dispatch: AppDispatch) => {
    dispatch(setMode({ mode: 'addict', value: true }));
    setTimeout(() => dispatch(setMode({ mode: 'addict', value: false })), 5000);
};

export const triggerCuriosity = () => (dispatch: AppDispatch) => {
    dispatch(setMode({ mode: 'curiosity', value: true }));
    setTimeout(() => dispatch(setMode({ mode: 'curiosity', value: false })), 10000);
};

export const triggerHypnose = () => (dispatch: AppDispatch) => {
    dispatch(setMode({ mode: 'hypnose', value: true }));
    setTimeout(() => dispatch(setMode({ mode: 'hypnose', value: false })), 10000);
};

export const triggerCyberpunk = () => (dispatch: AppDispatch) => {
    dispatch(setMode({ mode: 'cyberpunk', value: true }));
    setTimeout(() => dispatch(setMode({ mode: 'cyberpunk', value: false })), 8000);
};

export const triggerPredator = () => (dispatch: AppDispatch) => {
    dispatch(setMode({ mode: 'predator', value: true }));
    setTimeout(() => dispatch(setMode({ mode: 'predator', value: false })), 8000);
};

export const triggerNegative = () => (dispatch: AppDispatch) => {
    dispatch(setMode({ mode: 'negative', value: true }));
    setTimeout(() => dispatch(setMode({ mode: 'negative', value: false })), 8000);
}

// suspicious déclenche une séquence visuelle dans le composant ; on reset après sa durée totale
const SUSPICIOUS_DURATION = 250 * 4 + 5000;
export const triggerSuspicious = () => (dispatch: AppDispatch) => {
    dispatch(setMode({ mode: 'suspicious', value: true }));
    setTimeout(() => dispatch(setMode({ mode: 'suspicious', value: false })), SUSPICIOUS_DURATION);
};

export default eyeSlice.reducer;
