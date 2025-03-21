import { Dispatch, SetStateAction, useCallback } from 'react';

interface OwnProps {
    value?: [readonly number[], Dispatch<SetStateAction<readonly number[]>>];
}

const useCheckedItem = (value: OwnProps['value']) => {
    const [checkedItems, setCheckedItems] = value ?? [null, () => {}];

    /**
     * 체크 여부 반환
     */
    const isChecked = useCallback(
        (seq: number) => {
            if (!checkedItems) return null;

            return checkedItems.indexOf(seq) !== -1;
        },
        [checkedItems],
    );

    /**
     * 체크박스를 클릭했을 때 호출되는 함수
     * @param event
     * @param seq
     */
    const handleCheckBox = (event: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
        if (!checkedItems) return;

        event.stopPropagation();

        const { name: seq } = event.target as HTMLInputElement;

        const checkedIndex = checkedItems.indexOf(Number(seq));

        // 새로운 checkedItems 배열 생성
        let newChecked;

        if (checkedIndex === -1) {
            // 체크되지 않은 항목 추가
            newChecked = [...checkedItems, Number(seq)];
        } else {
            // 이미 체크된 항목 제거
            newChecked = [
                ...checkedItems.slice(0, checkedIndex),
                ...checkedItems.slice(checkedIndex + 1),
            ];
        }

        setCheckedItems(newChecked);
    };

    /**
     * 전체 선택/해제 처리 함수
     * @param event
     * @param list
     */
    const handleSelectAllClick = <T extends { [key: string]: unknown }>(
        event: React.ChangeEvent<HTMLInputElement>,
        list: (T | null)[],
    ) => {
        if (!checkedItems) return;

        if (list && event.target.checked) {
            // null이 아닌 유효한 항목만 필터링
            const validList = list.filter((item): item is T => item !== null);

            // 모든 항목을 체크된 상태로 만듦
            const newSelected: number[] = validList.map(({ seq }) => seq as number);
            setCheckedItems(newSelected);
        } else {
            // 모든 항목의 체크를 해제
            setCheckedItems([]);
        }
    };

    return {
        isChecked,
        handleCheckBox,
        handleSelectAllClick,
    };
};

export { useCheckedItem };
