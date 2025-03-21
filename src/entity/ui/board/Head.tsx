import { useCallback, useEffect, useMemo, useState } from 'react';

import { BoardHeadProps } from './model';

import { useCheckedItem, useMenuAuthContext } from '../../../shared/hook';
import { BoardFilter } from '../../../shared/ui';

import {
    Checkbox,
    FormControlLabel,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
} from '@mui/material';

const Head = <
    Data extends { [key: string]: unknown },
    Search extends { sort: string[]; [key: string]: unknown },
>({
    checkedItems: checked,
    columns,
    boardDatas,
    searchParameter: search,
    useDelete = true,
}: BoardHeadProps<Data, Search>) => {
    const [checkedItems] = checked ?? [null, () => {}];
    const [searchParameter, setSearchParameter] = search;

    // 메뉴 권한 컨텍스트 사용
    const methods = useMenuAuthContext();

    // 체크박스 관련 커스텀 훅 사용
    const { handleSelectAllClick } = useCheckedItem(checked);

    // 필터 상태 계산
    const filterStates = useMemo(() => {
        const states: { [key: string]: (string | number)[] } = {};

        columns.forEach(({ filter }) => {
            // 필터 사용하는 항목이 아니면 추가 안함
            if (!filter) return;

            const { key, options } = filter;

            const value: (string | number)[] = searchParameter[key] as (string | number)[];

            if (value?.length) {
                states[key] = value;
            } else {
                // 전체 선택 시 빈 값으로 전달 받음
                states[key] = options.length ? options.map(({ code }) => code) : [];
            }
        });

        return states;
    }, [columns, searchParameter]);

    // 정렬 관련 타입 정의
    type SortDirection = 'asc' | 'desc';
    type Sort = { [key: string]: SortDirection };

    // 초기 정렬 상태 설정
    const [sorts, setSorts] = useState<Sort>(() => {
        const initialSorts: Sort = {};

        searchParameter.sort.forEach(sortString => {
            const [property, direction] = sortString.split(',');

            initialSorts[property] = direction as SortDirection;
        });
        return initialSorts;
    });

    // 정렬 핸들러
    const handleSort = (property: string) => {
        setSorts(prevSorts => {
            const newSorts = { ...prevSorts };

            if (property in newSorts) {
                if (newSorts[property] === 'desc') {
                    newSorts[property] = 'asc';
                } else {
                    delete newSorts[property];
                }
            } else {
                newSorts[property] = 'desc';
            }
            return newSorts;
        });
    };

    // 검색 파라미터 업데이트 함수
    const handleSearchParameter = (key: string, value: (string | number)[] | string | number) => {
        setSearchParameter({
            ...searchParameter,
            [key]: value,
        });
    };

    // 필터 상태 설정 함수
    const setFilterState = (
        value: (string | number)[],
        column: string,
        filterOptionsLength: number,
    ) => {
        filterStates[column] = value;

        // 전체 선택했을 때 parameter state 빈 값 전달
        if (value.length === filterOptionsLength) {
            handleSearchParameter(column, []);
        } else {
            handleSearchParameter(column, value);
        }
    };

    // 배열 비교 헬퍼 함수
    const areArraysEqual = (arr1: string[], arr2: string[]) => {
        if (arr1.length !== arr2.length) return false;
        return arr1.every((value, index) => value === arr2[index]);
    };

    useEffect(() => {
        const sortStrings = Object.entries(sorts).map(
            ([property, direction]) => `${property},${direction}`,
        );
        if (!areArraysEqual(sortStrings, searchParameter.sort)) {
            handleSearchParameter('sort', sortStrings);
        }
    }, [sorts, searchParameter.sort]);

    /**
     * 전체 체크박스 중 선택된 것이 있을 때 활성화
     */
    const isIndeterminate = useMemo(() => {
        if (!checkedItems) return false;

        return checkedItems.length > 0 && checkedItems.length < boardDatas.list.length;
    }, [boardDatas, checkedItems]);

    /**
     * 전체 체크박스 모두 선택되었을 때 활성화
     */
    const isAllChecked = useMemo(() => {
        if (!checkedItems) return false;

        return boardDatas.list.length > 0 && checkedItems.length === boardDatas.list.length;
    }, [boardDatas, checkedItems]);

    const getSortIndex = useCallback(
        (id: string) => {
            const index = searchParameter.sort.findIndex(item => {
                const [name] = item.split(',');
                return name === id;
            });

            return index > -1 ? index + 1 : -1;
        },
        [searchParameter.sort],
    );

    return (
        <TableHead>
            <TableRow>
                {/* 전체 선택 체크박스 */}

                {checkedItems && (
                    <TableCell key="allCheck" align="center" size="small" style={{ width: 45 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    size="small"
                                    indeterminate={isIndeterminate}
                                    checked={isAllChecked}
                                    onChange={event => handleSelectAllClick(event, boardDatas.list)}
                                />
                            }
                            label=""
                        />
                    </TableCell>
                )}

                {/* 컬럼 헤더 */}
                {columns
                    .filter(({ useColumns, disabled }) => useColumns && !disabled)
                    .map(({ id, align, width, label, useSort, filter }) => {
                        // 조건이 만족되지 않으면 아무것도 렌더링하지 않음
                        if (id === 'state' && methods && !methods.includes('PUT')) {
                            return null;
                        }

                        const renderContent = () => {
                            // 필터 옵션이 있고 PUT 메소드가 있는 경우
                            if (filter && methods && methods.includes('PUT')) {
                                return (
                                    <BoardFilter
                                        isMulti
                                        id={`filter_${id}`}
                                        title={label}
                                        options={filter.options}
                                        value={filterStates[filter.key]}
                                        onChange={value =>
                                            setFilterState(value, filter.key, filter.options.length)
                                        }
                                    />
                                );
                            }

                            // 정렬 옵션이 있는 경우
                            if (useSort) {
                                return (
                                    <TableSortLabel
                                        active={id in sorts}
                                        direction={id in sorts ? sorts[id] : 'asc'}
                                        onClick={() => handleSort(id)}
                                        sx={{
                                            '& .MuiTableSortLabel-icon': {
                                                transform: () => {
                                                    const baseTransform =
                                                        !(id in sorts) || sorts[id] === 'desc'
                                                            ? 'rotate(180deg)'
                                                            : 'rotate(0deg)';
                                                    return `translate(calc(100% + 5px), -50%) ${baseTransform} `;
                                                },
                                                position: 'absolute',
                                                right: 0,
                                                top: '50%',
                                                width: '0.8em',
                                                height: '0.8em',
                                            },
                                            '&.Mui-active:before': {
                                                content: `"${getSortIndex(id)}"`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '14px',
                                                height: '14px',
                                                position: 'absolute',
                                                left: 0,
                                                top: '50%',
                                                transform: 'translate(calc(-100% - 3px), -50%)',
                                                borderRadius: '50%',
                                                background: 'rgba(0, 0, 0, 0.15)',
                                                color: '#fff',
                                                fontSize: '10px',
                                                fontWeight: '200',
                                            },
                                        }}
                                    >
                                        <span>{label}</span>
                                    </TableSortLabel>
                                );
                            }

                            // 기본 렌더링
                            return <span>{label}</span>;
                        };

                        return (
                            <TableCell
                                key={id}
                                align={align}
                                style={{ width }}
                                size="small"
                                sortDirection="desc"
                            >
                                {renderContent()}
                            </TableCell>
                        );
                    })}

                {/* 삭제 컬럼 (권한이 있을 경우에만 표시) */}
                {useDelete && methods && methods.includes('DELETE') && (
                    <TableCell key="delete" align="center" size="small" style={{ width: 50 }}>
                        삭제
                    </TableCell>
                )}
            </TableRow>
        </TableHead>
    );
};

export { Head };
