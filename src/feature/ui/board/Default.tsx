import { useEffect, useMemo } from 'react';

import { boardStyle } from './Default.style';
import { BoardDefaultProps } from './model';

import { BoardHead, BoardSetting } from '../../../entity/ui/board';
import { usePersonalizationStore } from '../../../shared/hook';
import { BoardBody, useDefaultBoard } from '../../../shared/ui';

import { Pagination, Stack, Table } from '@mui/material';

const Default = <
    Data extends { [key: string]: unknown },
    Update,
    Delete,
    Search extends { state: string[]; sort: string[]; rowLimit: number; page: number },
>({
    selectedItem,
    checkedItems,
    columns,
    boardDatas,
    updateEvent,
    deleteEvent,
    searchParameter,
    menuName,
    useDelete,
    rowHeight = 48,
    tableHeight = 400,
}: BoardDefaultProps<Data, Update, Delete, Search>) => {
    const [searchParam, setSearchParam] = searchParameter;

    const personalization = usePersonalizationStore().getPersonalizationDataList(menuName);
    const colOpts = personalization?.colOpts;

    const setUseColumnsList = useMemo(() => {
        if (colOpts) {
            return columns.map(column => {
                const item = { ...column };
                item.useColumns = colOpts[item.id] !== undefined ? colOpts[item.id] : true;
                return item;
            });
        }
        return columns;
    }, [colOpts, columns]);

    const { page, pageCount, handlePage } = useDefaultBoard(boardDatas, searchParam.rowLimit);

    const defaultSettingColumns = useMemo(() => {
        return columns.map(({ id, label, useColumns, disabled }) => ({
            code: id,
            name: label,
            use: useColumns as boolean,
            disabled,
        }));
    }, [columns]);

    useEffect(() => {
        setSearchParam({ ...searchParam, page });
    }, [page]);

    return (
        <div css={boardStyle}>
            <Stack direction="row" className="infos" justifyContent="space-between">
                <Stack direction="row">
                    <Stack direction="row" gap="5px">
                        총 <strong>{boardDatas.total}</strong> 건
                    </Stack>
                    <hr />
                    <strong>{boardDatas.page}</strong>/{pageCount}Pages
                </Stack>
                <Stack direction="row">
                    <BoardSetting
                        rowLimit={searchParam.rowLimit}
                        columns={defaultSettingColumns}
                        menuName={menuName}
                    />
                </Stack>
            </Stack>
            <Table
                stickyHeader
                aria-label="sticky table"
                style={{ height: tableHeight, overflowY: 'auto' }}
            >
                <BoardHead
                    checkedItems={checkedItems}
                    columns={setUseColumnsList}
                    boardDatas={boardDatas}
                    searchParameter={searchParameter}
                    useDelete={useDelete}
                />
                <BoardBody
                    checkedItems={checkedItems}
                    selectedItem={selectedItem}
                    columns={setUseColumnsList}
                    boardDatas={boardDatas}
                    updateEvent={updateEvent}
                    deleteEvent={deleteEvent}
                    searchParameter={searchParameter}
                    menuName={menuName}
                    useDelete={useDelete}
                    rowHeight={rowHeight}
                />
            </Table>

            <Stack direction="row" justifyContent="center">
                <Pagination count={pageCount} page={page} onChange={handlePage} />
            </Stack>
        </div>
    );
};

export { Default };
