import { useEffect, useState } from 'react';
import './EyeOfProvidence.scss';

const BLINK_DURATION = 4500;
const randomDelay = () => 250 + Math.random() * 3750;

type LookDir = 'left' | 'up' | 'down' | 'right' | null;

type Props = {
    sharingan?: boolean;
    suspicious?: boolean;
    affected?: boolean;
    addict?: boolean;
    enervous?: boolean;
    surprised?: boolean;
};

export default function EyeOfProvidence({ sharingan = false, suspicious = false, affected = true, addict = false, enervous = false, surprised = false }: Props) {
    const [isBlinking, setIsBlinking] = useState(false);
    const [lookDir, setLookDir] = useState<LookDir>(null);
    const [narrowed, setNarrowed] = useState(false);
    const [isAffected, setIsAffected] = useState(false);
    const [isAddict, setIsAddict] = useState(false);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;

        const blink = () => {
            setIsBlinking(true);
            timeout = setTimeout(() => {
                setIsBlinking(false);
                timeout = setTimeout(blink, randomDelay());
            }, BLINK_DURATION);
        };

        timeout = setTimeout(blink, randomDelay());
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (!affected) return;

        const t0 = setTimeout(() => setIsAffected(true), 0);
        const t1 = setTimeout(() => setIsAffected(false), 5000);

        return () => {
            clearTimeout(t0);
            clearTimeout(t1);
            setIsAffected(false);
        };
    }, [affected]);

    useEffect(() => {
        if (!addict) return;

        const t0 = setTimeout(() => setIsAddict(true), 0);
        const t1 = setTimeout(() => setIsAddict(false), 5000);

        return () => {
            clearTimeout(t0);
            clearTimeout(t1);
            setIsAddict(false);
        };
    }, [addict]);

    useEffect(() => {
        if (!suspicious) return;

        const STEP = 250;
        const t1 = setTimeout(() => setLookDir('left'),  0);
        const t2 = setTimeout(() => setLookDir('up'),    STEP);
        const t3 = setTimeout(() => setLookDir('down'),  STEP * 2);
        const t4 = setTimeout(() => setLookDir('right'), STEP * 3);
        const t5 = setTimeout(() => { setLookDir(null); setNarrowed(true); }, STEP * 4);
        const t6 = setTimeout(() => setNarrowed(false), STEP * 4 + 5000);

        return () => {
            [t1, t2, t3, t4, t5, t6].forEach(clearTimeout);
            setLookDir(null);
            setNarrowed(false);
        };
    }, [suspicious]);

    return (
        <div className="pyramide">
            <svg className={[
                'eye',
                isBlinking && 'blinking',
                sharingan && 'sharingan',
                lookDir,
                narrowed && 'narrowed',
                isAddict && 'full-pupil',
                isAffected && 'wrinkled-pupil',
                enervous && 'enervous',
                surprised && 'surprised',
            ].filter(Boolean).join(' ')} viewBox="0 0 220 120">
                <defs>
                    <clipPath id="eye-clip">
                        <path d="M20 60 Q60 20 110 20 Q160 20 200 60 Q160 100 110 100 Q60 100 20 60Z"/>
                    </clipPath>
                    <path id="tomoe-shape" d="M 0,-7 A 6.5,6.5 0 1,1 -6.5,0 C -6.5,3.5 -3,6.5 1.5,8.5 C 5,10 6,7.5 4.5,5 C 3,2.5 1,3.5 -0.5,1 C -2,-1.5 -1.5,-4 0,-7 Z" fill="#000"/>
                </defs>

                <g clipPath="url(#eye-clip)">
                    <path className="eye-shape" d="M20 60 Q60 20 110 20 Q160 20 200 60 Q160 100 110 100 Q60 100 20 60Z"/>

                    <g className="iris">
                        <circle className="iris-ring" cx="110" cy="60" r="35"/>
                        <circle className="pupil" cx="110" cy="60" r="18"/>
                        <path className="shine" d="M96 46 C91 46 87 50 87 55 C87 60 92 64 97 63 C103 62 107 57 105 52 C104 48 100 46 96 46 Z"/>

                        <g className="tomoe-group">
                            <g transform="translate(110, 34) rotate(0)"><use href="#tomoe-shape"/></g>
                            <g transform="translate(132, 73) rotate(120)"><use href="#tomoe-shape"/></g>
                            <g transform="translate(88, 73) rotate(240)"><use href="#tomoe-shape"/></g>
                        </g>
                    </g>

                    <path className="lid lid-top" d="M 0 -20 L 220 -20 L 220 20 Q 110 20 0 20 Z"/>
                    <path className="lid lid-bottom" d="M 0 140 L 220 140 L 220 100 Q 110 100 0 100 Z"/>
                </g>

                <path className="eye-outline" d="M20 60 Q60 20 110 20 Q160 20 200 60 Q160 100 110 100 Q60 100 20 60Z"/>
            </svg>
        </div>
    );
}
