import { useCallback, useMemo } from 'react';

import { useVirtualizer } from '@tanstack/react-virtual';
import DOMPurify from 'dompurify';
import ReactHTMLParser from 'html-react-parser';

import { useDefaultBoard } from './hook/useDefaultBoard';
import { BoardBodyProps } from './model';

import { useCheckedItem, useMenuAuthContext } from '../../hook';

import DeleteIcon from '@mui/icons-material/Delete';
import {
    Checkbox,
    FormControlLabel,
    IconButton,
    Switch,
    TableBody,
    TableCell,
    TableRow,
} from '@mui/material';

/**
 * SafeHTML 컴포넌트
 * HTML 문자열을 DOMPurify로 XSS 공격 방지,
 * ReactHTMLParser로 HTML 문자열을 React 요소로 변환
 */
const SafeHTML = ({ html }: { html: string }) => ReactHTMLParser(DOMPurify.sanitize(html));

const ScrollElement = document.querySelector('#root');

const Body = <
    Data extends { [key: string]: unknown },
    Update,
    Delete,
    Search extends { state: string[]; sort: string[]; rowLimit: number },
>({
    selectedItem: selected,
    checkedItems: check,
    columns,
    boardDatas,
    updateEvent,
    deleteEvent,
    searchParameter: search,
    useDelete = true,
    rowHeight = 48,
}: BoardBodyProps<Data, Update, Delete, Search>) => {
    const virtualizer = useVirtualizer({
        // 수평 방향으로 virtual 적용 (true: 수평, false: 수직)
        horizontal: true,

        // virtual 적용할 총 항목 수
        count: boardDatas.list.length,

        // 스크롤이벤트 감지할 DOM 요소
        getScrollElement: () => ScrollElement,

        // 각 행 크기 추정 함수
        estimateSize: useCallback(() => rowHeight, [rowHeight]),

        // 화면에 보이는 항목 외에 추가로 렌더링할 항목 수
        // 스크롤 성능 향상을 위해 사용
        overscan: 50,
    });

    const [selectedItem, setSelectedItem] = selected ?? [null, null];
    const [searchParameter] = search;

    // 메뉴 권한 컨텍스트 사용
    const methods = useMenuAuthContext();

    // 최소 행 갯수를 맞추기 위해 추가해야 할 빈 행 갯수
    const { rowsToAdd } = useDefaultBoard(boardDatas, searchParameter.rowLimit);

    // 체크박스 상태 관리 훅 사용
    const { isChecked, handleCheckBox } = useCheckedItem(check);

    // `editItem` 변경 함수
    const changeEditItem = (row: Data) => {
        if (setSelectedItem) {
            if (selectedItem && row && row.seq === selectedItem.seq) {
                setSelectedItem(null);
            } else {
                setSelectedItem(row);
            }
        }
    };

    // 상태 스위치 핸들러
    const handleStateSwitch = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();

        const { checked, name: seq } = event.target as HTMLInputElement;

        const param = {
            seq: [Number(seq)],
            state: checked ? 'Y' : 'N',
        };

        // 상태 업데이트 함수 호출
        // 파라미터 전달까지만
        if (updateEvent) updateEvent(param as Update);
    };

    // 삭제 버튼 클릭 핸들러
    const clickDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();

        const { name: seq } = event.currentTarget as HTMLInputElement;

        const param = {
            seq: [Number(seq)],
        };

        // 삭제 함수 호출
        // 파라미터 전달까지만
        if (deleteEvent) deleteEvent(param as Delete);
    };

    /**
     * 선택된 행인지 확인
     */
    const isSelected = useCallback(
        (seq: number) => {
            return selectedItem && selectedItem.seq === seq;
        },
        [selectedItem],
    );

    /**
     *  selectedItem 사용할 때만 cursor pointer 적용
     */
    const useSelected = useMemo(() => (setSelectedItem ? 'use-selected' : ''), [setSelectedItem]);

    const items = virtualizer.getVirtualItems();

    return (
        <TableBody
            className={useSelected}
            sx={{
                // height: virtualizer.getTotalSize(),
                transform: `translateY(${items[0]?.start}px)`,
            }}
        >
            {virtualizer.getVirtualItems().map(virtualRow => {
                // console.log('virtualRow', virtualRow, virtualizer, items);
                const row = boardDatas.list[virtualRow.index];

                if (!row) return null;

                const seq = row.seq as number;

                const isItemSelected = isSelected(seq) || false;
                const isItemChecked = isChecked(seq) || false;

                return (
                    <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={seq}
                        selected={isItemSelected}
                        onClick={() => changeEditItem(row)}
                    >
                        {/* 체크박스 셀 */}
                        {check && (
                            <TableCell key={seq} align="center" size="small">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name={String(seq)}
                                            checked={isItemChecked}
                                            size="small"
                                        />
                                    }
                                    label=""
                                    onClick={handleCheckBox}
                                />
                            </TableCell>
                        )}

                        {/* 각 컬럼 데이터 렌더링 */}
                        {columns
                            .filter(({ useColumns, disabled }) => useColumns && !disabled)
                            .map(column => {
                                const value = (row as Data) ? row[column.id] : undefined;

                                // 사용 여부
                                if (column.id === 'state') {
                                    // switch보다 format 우선
                                    if (column.format) {
                                        return (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                size="small"
                                            >
                                                <SafeHTML html={column.format(value)} />
                                            </TableCell>
                                        );
                                    }

                                    if (methods && methods.includes('PUT')) {
                                        return (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                size="small"
                                            >
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            name={String(seq)}
                                                            size="small"
                                                            color="default"
                                                            checked={value === 'Y'}
                                                            onClick={handleStateSwitch}
                                                        />
                                                    }
                                                    label=""
                                                />
                                            </TableCell>
                                        );
                                    }
                                    return null;
                                }

                                return (
                                    <TableCell key={column.id} align={column.align} size="small">
                                        {column.format ? (
                                            <SafeHTML html={column.format(value)} />
                                        ) : (
                                            String(value)
                                        )}
                                    </TableCell>
                                );
                            })}

                        {/* 삭제 버튼 셀 */}
                        {useDelete && methods && methods.includes('DELETE') && (
                            <TableCell key="삭제" align="center" size="small">
                                <IconButton
                                    aria-label="delete"
                                    size="small"
                                    name={String(seq)}
                                    onClick={clickDelete}
                                >
                                    <DeleteIcon fontSize="inherit" />
                                </IconButton>
                            </TableCell>
                        )}
                    </TableRow>
                );
            })}

            {/* 빈 행 추가 (최소 행 개수 맞추기) */}
            {Array.from({ length: rowsToAdd }, (_, index) => (
                <TableRow className="no-data" key={`empty-${index}`} tabIndex={-1}>
                    {columns
                        .filter(({ useColumns }) => useColumns)
                        .map(column => {
                            if (methods && !methods.includes('PUT') && column.id === 'state') {
                                return null;
                            }
                            return <TableCell key={column.id} size="small" />;
                        })}

                    {check && <TableCell size="small" />}

                    {useDelete && methods && methods.includes('DELETE') && (
                        <TableCell size="small" />
                    )}
                </TableRow>
            ))}
        </TableBody>
    );
};

export { Body };
