interface PersonalizationType {
    [menuName: string]: {
        main?: {
            dataList?: {
                colOpts?: {
                    [key: string]: boolean;
                };
                rowLimit?: number;
            };
        };
        aside?: {
            width: string;
        };
        [key: string]: unknown;
    };
}

interface PersonalizationStoreModel {
    personalization: PersonalizationType;
    updatePersonalization: (menuName: string, valueKey: string, value: unknown) => void;
}

export type { PersonalizationType, PersonalizationStoreModel };
