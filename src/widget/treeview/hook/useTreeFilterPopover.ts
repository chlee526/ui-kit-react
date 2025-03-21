import { useMemo } from 'react';

import { useTreeUtils } from './useTreeUtils';
import {
    FilterOptionItemModel,
    FilterValueType,
    PopoverFilterOptionModel,
    TreePopoverProps,
} from '../model/TreeViewModel';

interface OwnProps
    extends Pick<TreePopoverProps, 'treeData' | 'popoverData' | 'itemToEdit' | 'filterOption'> {
    groupName: string;
    filterValue: FilterValueType;
    setFilterValue: (value: FilterValueType | ((prev: FilterValueType) => FilterValueType)) => void;
    closePopover: () => void;
    setItemToEdit: TreePopoverProps['setItemToEdit'];
    setDialog: TreePopoverProps['setDialog'];
    handleSaveData: TreePopoverProps['handleSaveData'];
}

const useTreeFilterPopover = ({
    treeData,
    popoverData,
    filterOption,
    itemToEdit,
    groupName,
    filterValue,
    setFilterValue,
    closePopover,
    setItemToEdit,
    setDialog,
    handleSaveData,
}: OwnProps) => {
    const { isFilterDifferent } = useTreeUtils();
    /**
     * 팝오버 열림 상태
     * @return {boolean}
     */
    const isPopoverOpen = useMemo(() => Boolean(popoverData.anchorElm), [popoverData]);

    /**
     * 필터 옵션 사용 여부
     * @return {boolean}
     */
    const isUseFilter = useMemo(
        () => filterOption && Object.keys(filterOption).length,
        [filterOption],
    );

    /**
     * 최상위 레벨 아이템 추가 여부
     * @return {boolean}
     */
    const isAddRootItem = useMemo(
        () => Boolean(popoverData.anchorElm && !popoverData.node),
        [popoverData],
    );

    /**
     * 적용 버튼 활성화 여부
     * @return {boolean}
     */
    const isConfirmValid = useMemo(() => {
        // 추가하는 경우
        if (!itemToEdit) return !groupName.trim().length;

        // 수정하는 경우
        const isNameChanged = popoverData.node?.text !== groupName;
        const isFilterChanged = isFilterDifferent(
            popoverData.node?.filter as FilterValueType,
            filterValue,
        );

        // 이름이나 필터값이 변경된 경우 버튼 활성화
        return !(isNameChanged || isFilterChanged);
    }, [itemToEdit, groupName, popoverData, filterValue, isFilterDifferent]);

    /**
     * 팝오버 외부 클릭 핸들러
     * @param {MouseEvent | TouchEvent} e - 클릭 이벤트
     */
    const handleClickAway = (e: MouseEvent | TouchEvent) => {
        const target = e.target as HTMLButtonElement;
        const isAddButton = target.closest('button[name="addBtn"]');
        if (!isAddButton) closePopover();
    };

    /**
     * 필터 값 변경 핸들러
     * @param {React.MouseEvent<HTMLElement>} e - 클릭 이벤트
     * @param {number[]} value - 선택된 필터 값 배열
     * @param {string} key - 필터 키
     */
    const handleFilterChange = (e: React.MouseEvent<HTMLElement>, value: number[], key: string) => {
        e.preventDefault();
        setFilterValue(prev => ({ ...prev, [key]: value }));
    };

    /**
     * 적용 버튼 클릭 핸들러
     * 변경사항을 저장하고 필요한 경우 확인 다이얼로그를 표시
     */
    const handleConfirm = () => {
        const exportData = {
            ...popoverData.node,
            text: groupName,
            ...(isUseFilter && { filter: { ...filterValue } }),
            ...(itemToEdit
                ? {
                      parent: Number(popoverData.node?.parent),
                      id: Number(popoverData.node?.id),
                  }
                : {
                      parent: Number(popoverData.node?.id) || 0,
                      id: Number(Date.now()),
                  }),
        };

        const isShowDialog =
            isUseFilter &&
            !isAddRootItem &&
            itemToEdit &&
            isFilterDifferent(popoverData.node?.filter as FilterValueType, filterValue);

        if (isShowDialog) {
            setItemToEdit(exportData);
            setDialog({
                open: true,
                contents: {
                    title: '저장하시겠습니까?',
                    content: '저장 시 하위 노드 변경이 있을 수 있습니다.',
                },
            });
        } else {
            handleSaveData(exportData);
        }
    };

    /**
     * 필터 옵션 업데이트 함수
     * 부모 노드의 필터 값에 따라 자식 노드의 필터 옵션을 비활성화
     * @param {PopoverFilterOptionModel} filterGroup - 현재 처리할 필터 그룹
     */
    const updateFilterOptions = (filterGroup: PopoverFilterOptionModel) => {
        const nodeFilterValue = popoverData.node?.filter?.[filterGroup.key] as number[] | undefined;

        // 최상위 레벨 아이템 추가: 모든 옵션 활성화 상태 유지
        if (isAddRootItem) return;

        /**
         * 옵션 비활성화 헬퍼 함수
         * @param {(item: FilterOptionItemModel) => boolean} condition - 비활성화 조건
         */
        const handleDisabledOption = (condition: (item: FilterOptionItemModel) => boolean) => {
            filterGroup.options.forEach(opt => {
                if (condition(opt)) Object.assign(opt, { disabled: true });
            });
        };

        if (popoverData.node?.parent !== 0) {
            const parent = treeData.find(item => item.id === popoverData.node?.parent);
            const parentValue = parent?.filter?.[filterGroup.key] as number[] | undefined;

            if (parentValue) {
                // 부모 노드의 옵션에 포함되지 않은 항목 비활성화
                handleDisabledOption(item => !parentValue.includes(item.seq as number));
            }

            if (!itemToEdit && nodeFilterValue) {
                // 현재 노드의 옵션에 포함되지 않은 항목도 비활성화
                handleDisabledOption(item => !nodeFilterValue.includes(item.seq as number));
            }
        } else if (!itemToEdit && nodeFilterValue) {
            handleDisabledOption(item => !nodeFilterValue.includes(item.seq as number));
        }
    };

    return {
        isPopoverOpen,
        isUseFilter,
        isConfirmValid,
        handleClickAway,
        handleFilterChange,
        handleConfirm,
        updateFilterOptions,
    };
};

export { useTreeFilterPopover };
