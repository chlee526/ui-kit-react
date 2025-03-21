import { TextFieldProps } from '@mui/material';

type InputBoxDefaultProps = TextFieldProps & {
    id?: string;
    value: [
        string | number | null | typeof NaN,
        (setValue: string | number | null | typeof NaN) => void,
    ];
    errorMessage?: string | null;
    helperText?: string | null;
    readOnly?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type { InputBoxDefaultProps };
