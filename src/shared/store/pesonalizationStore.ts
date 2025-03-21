import { merge } from 'lodash';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { PersonalizationStoreModel } from '../model';

/**
 * 개인화 저장
 */
const personalizationStore = create<PersonalizationStoreModel>()(
    persist(
        (set, get) => ({
            personalization: {},
            updatePersonalization: (menuName: string, valueKey: string, value: unknown) => {
                const currentPersonalization = get().personalization;

                const updatedPersonalization = merge({}, currentPersonalization, {
                    [menuName]: {
                        [valueKey]: value,
                    },
                });

                set(() => ({
                    personalization: structuredClone(updatedPersonalization),
                }));
            },
        }),
        {
            name: 'personalizationStore',
        },
    ),
);

export { personalizationStore };
