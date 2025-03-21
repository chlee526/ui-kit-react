import { useContext } from 'react';

import { MenuAuthContext } from '../context';

const useMenuAuthContext = () => {
    const state = useContext(MenuAuthContext);

    return state;
};

export { useMenuAuthContext };
