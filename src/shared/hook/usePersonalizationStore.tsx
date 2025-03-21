import { useMemo } from 'react';

import { personalizationStore } from '../store';

const usePersonalizationStore = () => {
    const { personalization, updatePersonalization } = personalizationStore();

    const getPersonalization = useMemo(() => personalization, [personalization]);

    const setPersonalization = (menuName: string, valueKey: string, value: unknown) => {
        return updatePersonalization(menuName, valueKey, value);
    };

    const getPersonalizationDataList = (menuName: string) => {
        return personalization[menuName]?.main?.dataList;
    };

    return { getPersonalization, setPersonalization, getPersonalizationDataList };
};

export { usePersonalizationStore };
