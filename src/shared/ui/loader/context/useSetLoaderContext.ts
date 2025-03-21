import { createContext, useContext } from 'react';

type SetLoaderContextType = (state: boolean) => void;

const SetLoaderContext = createContext<SetLoaderContextType | null>(null);

const useSetLoaderContext = () => {
    const state = useContext(SetLoaderContext);

    if (!state) {
        throw new Error('SetLoaderContext를 찾을 수 없습니다.');
    }
    return state;
};

export { SetLoaderContext, useSetLoaderContext };
