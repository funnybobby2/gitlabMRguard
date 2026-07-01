import { useEffect } from 'react'
import { useAppDispatch } from '../store/hooks'
import { triggerAffected, triggerAddict, triggerHypnose, triggerCyberpunk, triggerPredator, setMode } from '../store/eyeSlice'

export function useRandomEyeEffect() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        const interval = setInterval(() => {
            const roll = Math.ceil(Math.random() * 20)
            switch (roll) {
                case 1: dispatch(triggerAffected()); break
                case 2: dispatch(triggerAddict());   break
                case 3: dispatch(setMode({ mode: 'enervous',  value: true })); break
                case 4: dispatch(setMode({ mode: 'surprised', value: true })); break
                case 5: dispatch(setMode({ mode: 'paranoid',  value: true })); break
                case 6: dispatch(triggerHypnose()); break
                case 7: dispatch(triggerCyberpunk()); break
                case 8: dispatch(triggerPredator()); break
                case 9: dispatch(setMode({ mode: 'negative', value: true })); break
                default: dispatch(setMode({ mode: 'default', value: true })); break
            }
        }, 5000)

        return () => clearInterval(interval)
    }, [dispatch])
}
