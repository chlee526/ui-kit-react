import { forwardRef, RefObject, useCallback, useEffect, useState } from 'react';

import { Interpolation, Theme } from '@emotion/react';

import { Style } from './InputBox.style';
import { InputBoxDefaultProps } from './model/InputBoxModel';

import { FormHelperText, TextField } from '@mui/material';

const InputBox = forwardRef(
    (
        {
            id = `basic_${Math.random()}`,
            value,
            errorMessage = null,
            helperText,
            readOnly = false,
            onChange,
            onBlur,
            ...textfieldProps
        }: InputBoxDefaultProps,
        ref,
    ) => {
        const [propValue, setPropValue] = value;
        const [inputValue, setInputValue] = useState(propValue);
        const [isError, setIsError] = useState<string | null>(null);

        // 값 변경 시
        useEffect(() => {
            setPropValue(inputValue);
            setIsError(null);
        }, [inputValue]);
        useEffect(() => {
            if (propValue !== inputValue) {
                setInputValue(propValue);
            }
        }, [propValue]);

        // 자체 에러 케이스
        const errorValidation = useCallback(() => {
            // require가 true인데 선택값이 없는 경우
            if (textfieldProps.required && (inputValue === 'empty' || !!inputValue === false))
                setIsError('필수값이 설정 되지 않음');
        }, [inputValue, textfieldProps.required]);

        // Input Events
        const handleChange = (e: React.FocusEvent<HTMLInputElement>) => {
            setInputValue(e.target.value);
            if (onChange) onChange(e);
        };
        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            errorValidation();
            if (onBlur) onBlur(e);
        };

        return (
            // <FormControl
            //     error={!!errorMessage || !!isError}
            //     sx={{ position: 'relative', minWidth: '100px' }}
            // >
            <>
                <TextField
                    ref={
                        ref as
                            | ((instance: HTMLDivElement | null) => void)
                            | RefObject<HTMLDivElement>
                            | null
                            | undefined
                    }
                    {...textfieldProps}
                    css={Style as Interpolation<Theme>}
                    id={id}
                    // className={textfieldProps.className}
                    // name={textfieldProps.name}
                    value={inputValue || ''}
                    label={errorMessage || isError || textfieldProps.label}
                    // placeholder={textfieldProps.placeholder}
                    error={!!errorMessage || !!isError}
                    // size={textfieldProps.size}
                    variant="outlined"
                    // required={textfieldProps.required}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    // disabled={textfieldProps.disabled}
                    // sx={textfieldProps.sx}
                    slotProps={{
                        input: {
                            readOnly,
                        },
                    }}
                />
                {helperText && (
                    <FormHelperText
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            paddingTop: '4px',
                            transform: 'translateY(100%)',
                        }}
                    >
                        {helperText}
                    </FormHelperText>
                )}
            </>
            // </FormControl>
        );
    },
);
InputBox.displayName = 'InputBox';

export { InputBox };
