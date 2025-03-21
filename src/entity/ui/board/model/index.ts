import { Dispatch, SetStateAction } from 'react';

import { BoardColumnsModel } from '../../../../shared/ui/board';

interface BoardHeadProps<Data, Search> {
    /**
     * `Board`에서 체크된 항목들의 `seq` 배열 useState
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
     * 조회 API 파라미터 useState
     * 업데이트 시 `Board` 조회 API 호출
     */
    searchParameter: [Search, (param: Search) => void];

    /**
     * 삭제 버튼 사용여부
     * 기본값 : `true`
     */
    useDelete?: boolean;
}

export type { BoardHeadProps };
