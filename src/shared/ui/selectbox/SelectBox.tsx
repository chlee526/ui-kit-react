import { forwardRef, useEffect, useMemo, useState } from 'react';

import { SelectBoxListType, SelectBoxDefaultProps } from './model/selectModel';
import { Style } from './SelectBox.style';

import { InputLabel, Select, MenuItem, FormControl, FormHelperText } from '@mui/material';

const SelectBox = forwardRef(({ id = `basic_${Math.random()}`, value, list, errorMessage = null, helperText, emptySelect = null, allSelect = null, ...selectProps }: SelectBoxDefaultProps, ref) => {
    const [propValue, setPropValue] = value;
    const [selectValue, setSelectValue] = useState(() => {
        if (!!propValue === false && !!emptySelect) return 'empty';
        if (!!propValue === false && !!allSelect) return 'all';
        return propValue;
    });

    // 값 변경 시
    useEffect(() => {
        if (selectValue === 'all' || selectValue === 'empty') setPropValue('');
        else setPropValue(selectValue);
    }, [selectValue]);
    useEffect(() => {
        if (propValue !== selectValue) {
            if (propValue === '' && !!emptySelect) setSelectValue('empty');
            else if (propValue === '' && !!allSelect) setSelectValue('all');
            else setSelectValue(propValue);
        }
    }, [propValue]);

    // 옵션 목록
    const optList: SelectBoxListType[] = useMemo(() => {
        if (!!emptySelect === true) return [{ seq: 'empty', name: emptySelect || '선택없음' }, ...list];

        if (!!allSelect === true) return [{ seq: 'all', name: allSelect || '전체' }, ...list];

        if (selectValue === 'empty' || selectValue === 'all') setSelectValue('');
        return list;
    }, [list, emptySelect, allSelect, selectValue]);

    // 자체 에러 케이스
    const isError = useMemo(() => {
        let result = null;
        const selectedOption = list.find((option) => (option.seq || option.code) === selectValue);

        // require가 true인데 선택값이 없는 경우
        if (selectProps.required && (selectValue === 'empty' || !!selectValue === false)) result = '필수값이 설정 되지 않음';

        // 비정상 값 할당 된 경우
        if (selectValue !== 'all' && selectValue !== 'empty' && !selectedOption && selectValue !== '') result = 'Error - 비정상 값 할당';

        // 선택값이 조건없이 없는 경우
        // if (
        //     !selectedOption &&
        //     !selectProps.required &&
        //     !!allSelect === false &&
        //     !!emptySelect === false
        // )
        //     result = 'Error - 선택 값 없음';

        return result;
    }, [selectValue, selectProps.required, list, allSelect, emptySelect]);

    // 셀렉트 박스 Render
    const displayValue = useMemo(() => {
        const selectedOption = optList.find((option) => (option.seq || option.code) === selectValue);

        // if (!errorMessage && !isError && !selectValue && selectProps.placeholder) {
        //     return selectProps.placeholder;
        // }

        if (selectedOption && selectValue === 'empty') return emptySelect || '선택없음';
        if (selectedOption && selectValue === 'all') return allSelect || '전체';

        if (
            !selectedOption &&
            !selectProps.required &&
            !!errorMessage === false &&
            !!emptySelect === false
            // !!allSelect === false
        ) {
            if (!!selectProps.label === true) return selectProps.label;
            // if (!!selectProps.placeholder === true) return selectProps.placeholder;
            // return '선택해주세요';
        }

        return selectedOption ? selectedOption.name : '';
    }, [selectValue, propValue, allSelect, emptySelect, selectProps]);

    // Open/Close
    const [isOpen, setIsOpen] = useState(false);
    const handleScroll = () => setIsOpen(false);
    useEffect(() => {
        if (isOpen) document.addEventListener('scroll', handleScroll);
        else document.removeEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('scroll', handleScroll);
        };
    }, [isOpen]);

    return (
        <FormControl disabled={selectProps.disabled} error={!!errorMessage || !!isError} sx={{ position: 'relative', minWidth: '100px' }}>
            <InputLabel id={`${id}_label`} size={selectProps.size === 'small' ? 'small' : 'normal'}>
                {errorMessage || isError || selectProps.label}
            </InputLabel>
            <Select
                ref={ref}
                css={Style}
                labelId={`${id}_label`}
                id={id}
                className={selectProps.className}
                name={selectProps.name}
                value={selectValue || ''}
                onChange={(e) => setSelectValue(e.target.value)}
                label={errorMessage || isError || selectProps.label}
                size={selectProps.size}
                fullWidth
                displayEmpty={!!selectValue === false && !!selectProps.label === false && !isError && !!errorMessage === false}
                sx={selectProps.sx}
                renderValue={() => displayValue}
                readOnly={selectProps.readOnly}
                MenuProps={{
                    disableScrollLock: true,
                }}
                open={isOpen}
                onOpen={() => setIsOpen(true)}
                onClose={() => setIsOpen(false)}
            >
                {optList &&
                    optList.map(({ seq, code, name }: SelectBoxListType) => (
                        <MenuItem key={`${seq || code}${name}`} value={seq || code} dense>
                            {name}
                        </MenuItem>
                    ))}
            </Select>
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
        </FormControl>
    );
});
SelectBox.displayName = 'SelectBox';

export { SelectBox };
