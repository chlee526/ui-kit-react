import { CSSProperties, Dispatch, SetStateAction } from 'react';

import { SearchChipType } from '../../../feature/chipList/model/ChipType';
import { InputBoxDefaultProps } from '../../../shared/ui/inputbox/index';
import { SelectBoxDefaultProps } from '../../../shared/ui/selectbox/index';

import { SxProps } from '@mui/material';

type SearchBarListType = {
    seq?: string | number;
    code?: string | number;
    name: string;
    isDisabled?: boolean;
};

type SearchBarDefaultProps<T extends SearchChipType | SearchChipType[]> = {
    id?: string;
    value: [
        // multiple extends true ? SearchChipType[] : SearchChipType,
        // multiple extends true ? Dispatch<SetStateAction<SearchChipType[]>> : Dispatch<SetStateAction<SearchChipType>>,
        // SearchChipType | SearchChipType[],
        // Dispatch<SetStateAction<SearchChipType | SearchChipType[]>>,
        T,
        Dispatch<SetStateAction<T>>,
    ];
    typeList?: SearchBarListType[] | null;
    multiple?: boolean;
    selectProps?: SelectBoxDefaultProps;
    inputProps?: InputBoxDefaultProps;
    size: 'small' | 'medium';
    sx?: SxProps;
    style?: CSSProperties;
};

export type { SearchBarListType, SearchBarDefaultProps };
