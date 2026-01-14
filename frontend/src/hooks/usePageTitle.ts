import { useEffect } from 'react';

/**
 * Hook personnalisé pour définir le titre de la page
 * @param title - Le titre de la page (sera préfixé par "TIMA - ")
 */
export const usePageTitle = (title: string) => {
    useEffect(() => {
        document.title = `TIMA - ${title}`;

        return () => {
            document.title = 'TIMA - Time Manager';
        };
    }, [title]);
};
