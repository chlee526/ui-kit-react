import { SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';

import { Interpolation, Theme } from '@emotion/react';
import { Controller, useForm } from 'react-hook-form';

import { SearchBarDefaultProps } from './model/SearchBarModel';
import { Style } from './SearchBar.style';

import { ChipList, SearchChipType } from '../../feature/chipList';
import { SelectBox, InputBox } from '../../shared/ui';

import { Search } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';

const SearchBar = <T extends SearchChipType | SearchChipType[]>({
    id = `basic_${Math.random()}`,
    value,
    typeList,
    multiple = false,
    size = 'small',
    selectProps,
    inputProps,
    style,
}: SearchBarDefaultProps<T>) => {
    const [defaultProp, setDefaultProp] = value;

    const {
        control,
        handleSubmit,
        setValue,
        formState: { isValid, isDirty },
    } = useForm<SearchChipType>();
    const isFormValid = useMemo(() => isValid && isDirty, [isValid, isDirty]);
    const [searchList, setSearchList] = useState(defaultProp);
    const [isError, setIsError] = useState('');
    const getAddValidation = useCallback(
        (addItem: SearchChipType) => {
            if (multiple) {
                return !(searchList as SearchChipType[]).some(
                    item =>
                        item.searchType === addItem.searchType &&
                        item.searchKeyword === addItem.searchKeyword,
                );
            }
            return true;
        },
        [multiple, searchList],
    );

    const onSubmit = (data: SearchChipType) => {
        if (multiple) {
            const validation = getAddValidation(data);
            if (!validation) {
                setIsError('동일한 검색 조건이 있음');
                return;
            }
            setSearchList(prev => {
                if (Array.isArray(prev)) {
                    return [...new Set([...prev, data])] as T;
                }
                return [data] as T;
            });
            setValue('searchKeyword', '');
        } else {
            setDefaultProp(data as SetStateAction<T>);
        }
    };

    useEffect(() => {
        if (multiple) setDefaultProp(searchList);
    }, [searchList]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={style}>
            <Stack direction="row" css={Style as Interpolation<Theme>}>
                {multiple && (
                    <ChipList
                        value={[
                            searchList as SearchChipType[],
                            setSearchList as React.Dispatch<React.SetStateAction<SearchChipType[]>>,
                        ]}
                    />
                )}
                <Stack direction="row" className="wrap">
                    {typeList && typeList.length > 0 && (
                        <Controller
                            name="searchType"
                            defaultValue={typeList[0].seq || typeList[0].code || null}
                            control={control}
                            render={({ field }) => {
                                return (
                                    <SelectBox
                                        {...field}
                                        id={`${id}_selectType`}
                                        className="selectType"
                                        size={size}
                                        sx={{
                                            width: '120px',
                                        }}
                                        {...selectProps}
                                        value={[
                                            field.value || null,
                                            e => {
                                                field.onChange(e);
                                                setIsError('');
                                            },
                                        ]}
                                        list={typeList}
                                    />
                                );
                            }}
                        />
                    )}
                    <Controller
                        name="searchKeyword"
                        control={control}
                        defaultValue=""
                        rules={
                            multiple
                                ? { required: '키워드 입력은 필수 입니다.' }
                                : { required: false }
                        }
                        render={({ field }) => (
                            <InputBox
                                {...field}
                                id={`${id}_inputKeyword`}
                                className="inputKeyword"
                                size={size}
                                sx={{
                                    width: '200px',
                                }}
                                {...inputProps}
                                value={[
                                    field.value,
                                    e => {
                                        setIsError('');
                                        field.onChange(e);
                                    },
                                ]}
                                errorMessage={isError}
                            />
                        )}
                    />
                    <Button type="submit" variant="contained" size={size} disabled={!isFormValid}>
                        <Search />
                    </Button>
                </Stack>
            </Stack>
        </form>
    );
};

export { SearchBar };
