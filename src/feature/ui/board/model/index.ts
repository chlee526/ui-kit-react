import { Dispatch, SetStateAction } from 'react';

import { BoardColumnsModel } from '../../../../main';

/**
 * `BoardBody` 컴포넌트 props 제네릭 인터페이스
 *
 * @template Data - 보드 데이터 아이템의 타입
 * @template Update - 데이터 업데이트 매개변수의 타입
 * @template Delete - 데이터 삭제 매개변수의 타입
 * @template Search - Board 조회 API 파라미터 타입
 */
interface BoardDefaultProps<Data, Update, Delete, Search> {
    /**
     * 선택된 Data 객체 useState
     * 초기화 시 `null` 전달
     */
    selectedItem?: [Data | null, Dispatch<SetStateAction<Data | null>>];

    /**
     * `Board`에서 체크된 항목들의 `seq` 배열 useState
     *  미전달 시 체크박스 노출 안됨
     */
    checkedItems?: [readonly number[], Dispatch<SetStateAction<readonly number[]>>];

    /**
     * `Board`를 생성할 때 사용할 column 정보
     */
    columns: readonly BoardColumnsModel[];
    /**
     * `Board`에 표시될 데이터와 페이지네이션 정보
     */
    boardDatas: {
        total: number;
        page: number;
        list: (Data | null)[];
    };

    /**
     * 업데이트 API 요청 상위로 전달
     * @param {Update} param update api 파라미터 타입
     */
    updateEvent?: (param: Update) => void;
    /**
     * 삭제 API 요청 상위로 전달
     * @param {Delete} param delete api 파라미터 타입
     */
    deleteEvent?: (param: Delete) => void;

    /**
     * 조회 API 파라미터 useState
     */
    searchParameter: [Search, (param: Search) => void];

    /**
     * 삭제 버튼 사용여부
     * 기본값 : `true`
     */
    useDelete?: boolean;

    /**
     * 개인화 저장 및 조회를 위한 메뉴명
     * ex) replace, member
     */
    menuName: string;

    /**
     * TableBody row 높이값
     * Default : `48`
     */
    rowHeight?: number;

    /**
     * Table 높이값
     * Default: 400
     */
    tableHeight?: number;
}

export type { BoardDefaultProps };
