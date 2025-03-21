import { Dispatch, SetStateAction } from 'react';

/**
 * `BoardFilter` 필터 옵션 타입
 */
interface BoardFilterItemModel {
    code: string | number;
    name: string;
}

/**
 * `BoardData` 제네릭 인터페이스
 * @template T - 리스트에 포함될 데이터 아이템의 타입 ex) `ReplaceBoardDataModel`
 */
interface BoardDataModel<T> {
    /**
     * 총 데이터 갯수
     */
    total: number;
    /**
     * 현재 페이지 번호
     */
    page: number;
    /**
     * 현재 페이지 데이터 목록
     */
    list: T[];
}

/**
 * `Board` 컬럼 구조와 속성 정의 인터페이스
 */
interface BoardColumnsModel {
    /**
     * 컬럼 고유 식별자
     * ex) `state`, `keyword`, `mname`, ...
     */
    id: string;
    /**
     * 컬럼의 표시 라벨
     */
    label: string;
    /**
     * 컬럼 너비
     * ex) `100`, `100px`, ...
     */
    width?: number | string;
    /**
     * 컬럼 정렬 방식
     * `right`/`center` 지정 가능, 기본값 : `left`
     */
    align?: 'right' | 'center';
    /**
     * 컬럼 데이터 포맷팅 함수
     * 데이터를 받아 문자열로 변환하는 함수로 가공
     */
    format?: (value: unknown) => string;
    /**
     * 컬럼 사용 여부
     * 개인화 초기값으로 사용됨
     */
    useColumns: boolean;
    /**
     * 정렬 기능 사용 여부
     */
    useSort: boolean;
    /**
     * `key`: searchParam에 반영될 키랑 일치해야 함
     * ex) state/ authFilter
     * `options` : 필터 기능(`BoardFilter`) 옵션들
     * ex) {code: 'Y', name: '사용'}
     */
    filter?: {
        key: string;
        options: { code: string | number; name: string }[];
    };

    /**
     * 컬럼 비활성화 여부
     */
    disabled?: boolean;
}

/**
 * `BoardBody` 컴포넌트 props 제네릭 인터페이스
 *
 * @template Data - 보드 데이터 아이템의 타입
 * @template Update - 데이터 업데이트 매개변수의 타입
 * @template Delete - 데이터 삭제 매개변수의 타입
 * @template Search - Board 조회 API 파라미터 타입
 */
interface BoardBodyProps<Data, Update, Delete, Search> {
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
}

export type { BoardFilterItemModel, BoardColumnsModel, BoardDataModel, BoardBodyProps };
