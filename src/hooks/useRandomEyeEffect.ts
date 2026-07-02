import { useEffect } from 'react'
import { useAppDispatch } from '../store/hooks'
import { triggerEmotion } from '../store/eyeSlice'

export function useRandomEyeEffect() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        const interval = setInterval(() => {
            const roll = Math.ceil(Math.random() * 30)
            switch (roll) {
                case 1: dispatch(triggerEmotion('addict',  5000)); break
                case 2: dispatch(triggerEmotion('affected',    5000)); break
                case 3: dispatch(triggerEmotion('curiosity',    15000)); break
                case 4: dispatch(triggerEmotion('cyberpunk',  10000)); break
                case 5: dispatch(triggerEmotion('enervous',    5000)); break
                case 6: dispatch(triggerEmotion('hypnose',    5000)); break
                case 7: dispatch(triggerEmotion('negative',    5000)); break
                case 8: dispatch(triggerEmotion('paranoid',  10000)); break
                case 9: dispatch(triggerEmotion('predator',   8000)); break
                case 10: dispatch(triggerEmotion('sharingan',   8000)); break
                case 11: dispatch(triggerEmotion('surprised',   8000)); break
                case 12: dispatch(triggerEmotion('suspicious',   8000)); break
                default: break
            }
        }, 5000)

        return () => clearInterval(interval)
    }, [dispatch])
}
