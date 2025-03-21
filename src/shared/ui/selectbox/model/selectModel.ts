import { SelectProps } from '@mui/material';

type SelectBoxListType = {
    seq?: string | number;
    code?: string | number;
    name: string;
    isDisabled?: boolean;
};

type SelectBoxDefaultProps = SelectProps & {
    id?: string;
    value: [
        string | number | null | typeof NaN,
        (setValue: string | number | null | typeof NaN) => void,
    ];
    list: SelectBoxListType[];
    errorMessage?: string | null;
    helperText?: string | null;
    allSelect?: string | null;
    emptySelect?: string | null;
};

export type { SelectBoxListType, SelectBoxDefaultProps };
