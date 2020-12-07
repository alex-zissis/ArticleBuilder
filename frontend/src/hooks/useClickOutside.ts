import {useEffect} from 'react';

const useClickOutside = (ref: React.RefObject<HTMLElement>, callback: () => void) => {
    const handleClick = ({target}: MouseEvent) => {
        console.log({target, curent: ref.current})
        if (ref.current.contains(target as Node)) {
            return;
        }
        
        document.removeEventListener('mousedown', handleClick);
        callback();
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClick);
        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, []);
};

export default useClickOutside;