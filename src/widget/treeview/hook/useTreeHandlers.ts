import { useCallback } from 'react';

import {
    FlattenTreeDataModel,
    TreeViewDataModel,
    TreeNodeRef,
    TreeViewProps,
} from '../model/TreeViewModel';

interface OwnProps<Data extends TreeViewDataModel> {
    treeRef: React.RefObject<TreeNodeRef>;
    originData: Data[];
    itemToEdit: FlattenTreeDataModel | null;
    getFindOriginData: (items: Data[], targetId: number) => Data | null;
    closePopover: () => void;
    setSelected: (item: Data | null) => void;
    addEvent?: TreeViewProps<Data>['addEvent'];
    updateEvent?: TreeViewProps<Data>['updateEvent'];
}
const useTreeHandlers = <Data extends TreeViewDataModel>({
    treeRef,
    originData,
    itemToEdit,
    getFindOriginData,
    closePopover,
    setSelected,
    updateEvent,
    addEvent,
}: OwnProps<Data>) => {
    /**
     * 아이템 저장/수정 핸들러
     * @param {FlattenTreeDataModel} itemData - 저장/수정할 아이템 데이터
     */
    const handleSaveEdit = useCallback(
        (itemData: FlattenTreeDataModel) => {
            if (itemToEdit) {
                // 수정
                const restData = Object.fromEntries(
                    Object.entries(itemData).filter(
                        ([key]) => !['id', 'parent', 'text', 'droppable', 'children'].includes(key),
                    ),
                );
                const updatedData: TreeViewDataModel = {
                    ...restData,
                    seq: Number(itemData.id),
                    pseq: Number(itemData.parent),
                    name: itemData.text,
                    ...(itemData.filter && { filter: { ...itemData.filter } }),
                };
                updateEvent?.(updatedData as Data, false);
            } else {
                // 추가
                const restData = Object.fromEntries(
                    Object.entries(itemData).filter(
                        ([key]) =>
                            !['id', 'parent', 'text', 'droppable', 'children', 'seq'].includes(key),
                    ),
                );
                const newItem: Omit<TreeViewDataModel, 'seq'> = {
                    ...restData,
                    pseq: Number(itemData.parent),
                    name: itemData.text,
                    state: 'Y',
                    ...(itemData.filter && { filter: { ...itemData.filter } }),
                };
                addEvent?.(newItem as Data);
                treeRef.current?.open(Number(itemData.parent));
            }
            closePopover();
        },
        [itemToEdit, closePopover, addEvent, updateEvent, treeRef],
    );

    /**
     * 아이템 클릭 핸들러 (더블클릭 감지 포함)
     * @param {FlattenTreeDataModel} node - 클릭된 노드 데이터
     * @param {NodeJS.Timeout | null} clickTimeout - 더블클릭 감지용 타임아웃
     * @param {function} setClickTimeout - 타임아웃 설정 함수
     */
    const handleClickItem = useCallback(
        (
            node: FlattenTreeDataModel,
            clickTimeout: NodeJS.Timeout | null,
            setClickTimeout: (timeout: NodeJS.Timeout | null) => void,
        ) => {
            if (clickTimeout) {
                clearTimeout(clickTimeout);
                setClickTimeout(null);
            } else {
                const newTimeout = setTimeout(() => {
                    const targetItem = getFindOriginData(
                        structuredClone(originData),
                        Number(node.id),
                    );
                    setSelected(targetItem as Data);
                    setClickTimeout(null);
                }, 200);
                setClickTimeout(newTimeout);
            }
        },
        [originData, setSelected, getFindOriginData],
    );

    /**
     * 아이템 상태 변경 핸들러 (체크박스)
     * @param {React.ChangeEvent<HTMLInputElement>} e - 체인지 이벤트
     * @param {FlattenTreeDataModel} node - 변경할 노드 데이터
     */
    const handleStateChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>, node: FlattenTreeDataModel) => {
            e.stopPropagation();
            const restData = Object.fromEntries(
                Object.entries(node).filter(
                    ([key]) => !['id', 'parent', 'text', 'droppable', 'children'].includes(key),
                ),
            );
            const updatedData: TreeViewDataModel = {
                ...restData,
                seq: Number(node.id),
                pseq: Number(node.parent),
                name: node.text,
                state: e.currentTarget.checked ? 'Y' : 'N',
            };
            updateEvent?.(updatedData as Data, true);
        },
        [updateEvent],
    );

    return { handleSaveEdit, handleClickItem, handleStateChange };
};

export { useTreeHandlers };
