import { ChangeEvent, useMemo, useState } from 'react';

const useDefaultBoard = <Data,>(
    boardDatas: {
        total: number;
        page: number;
        list: Data[];
    },
    rowLimit: number,
) => {
    // 게시판 최소 행 갯수
    const minRowLength = 20;
    // 데이터 목록 갯수
    const { length: listLength } = boardDatas.list;
    // 최소 행 갯수를 맞추기 위해 추가해야 할 빈 행 갯수
    const rowsToAdd = Math.max(minRowLength - listLength, 0);
    // 현재 페이지 번호
    const [page, setPage] = useState(1);

    /**
     * 총 페이지 갯수를 계산
     */
    const pageCount = useMemo(() => {
        // 총 데이터 수를 rowLimit으로 나누고 올림해 페이지 수 계산
        // 데이터가 없으면 1페이지로 설정
        return boardDatas.total > 0 ? Math.ceil(boardDatas.total / rowLimit) : 1;
    }, [boardDatas.total, rowLimit]);

    // 페이지 변경 처리 함수
    const handlePage = (_: ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return {
        page,
        pageCount,
        handlePage,
        rowsToAdd,
    };
};

export { useDefaultBoard };
