import { createContext } from 'react';

type MethodType = 'GET' | 'PUT' | 'POST' | 'DELETE';

const MenuAuthContext = createContext<MethodType[] | null>(null);

export { MenuAuthContext };
