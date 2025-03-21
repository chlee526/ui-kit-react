import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Tree, getBackendOptions, MultiBackend, DndProvider } from '@minoru/react-dnd-treeview';

import { useTreeHandlers } from './hook/useTreeHandlers';
import { useTreeSearch } from './hook/useTreeSearch';
import { useTreeUtils } from './hook/useTreeUtils';
import {
    FlattenTreeDataModel,
    PopoverDataModel,
    TreeViewDataModel,
    TreeDialogModel,
    TreeNodeRef,
    TreeViewProps,
} from './model/TreeViewModel';
import { TreeDialog } from './TreeDialog';
import { TreeFilterPopover } from './TreeFilterPopover';
import { TreeNode } from './TreeNode';
import { TreeSearchBar } from './TreeSearchBar';
import { TreeViewStyle } from './Treeview.style';

const TreeView = <Data extends TreeViewDataModel>({
    data,
    filterOption,
    selectedItem,
    isRequireSelect = true,
    deleteEvent,
    addEvent,
    updateEvent,
}: TreeViewProps<Data>) => {
    // State
    const [selected, setSelected] = selectedItem;
    const [searchResult, setSearchResult] = useState<Data[]>([]); // 검색 결과 데이터
    const [treeData, setTreeData] = useState<FlattenTreeDataModel[]>([]); // 트리 표시용 평면화 데이터
    const [popoverData, setPopoverData] = useState<PopoverDataModel>(() => ({
        anchorElm: null,
        node: null,
    }));
    const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null); // 더블 클릭 여부 체크
    const [dialog, setDialog] = useState<TreeDialogModel | null>(null); // 다이얼로그 데이터
    const [itemToDelete, setItemToDelete] = useState<Data | null>(null); // 삭제할 아이템 데이터
    const [itemToEdit, setItemToEdit] = useState<FlattenTreeDataModel | null>(null); // 수정할 아이템

    const originData = useMemo(() => structuredClone(data), [data]); // 원본 데이터의 복사본
    const treeRef = useRef<TreeNodeRef | null>(null); // 트리 컴포넌트 참조
    const treeViewRef = useRef<HTMLDivElement | null>(null); // 트리 컨테이너 참조
    const [rootWidth, setRootWidth] = useState(0); // 루트 엘리먼트 너비

    /**
     * 팝오버를 닫는 핸들러
     */
    const closePopover = useCallback(() => {
        setPopoverData({ anchorElm: null, node: null });
        setItemToEdit(null);
    }, []);

    // Hooks
    const { getFindOriginData, getFindParentSeq, getFlattenTreeData } = useTreeUtils();

    const { handleSearchTreeView } = useTreeSearch({
        originData,
        treeRef,
        getFindParentSeq,
        setSearchResult,
    });

    const { handleSaveEdit, handleClickItem, handleStateChange } = useTreeHandlers({
        treeRef,
        originData,
        itemToEdit,
        getFindOriginData,
        closePopover,
        setSelected,
        updateEvent,
        addEvent,
    });

    /**
     * 아이템 추가 팝오버를 열거나 닫는 핸들러
     * @param {React.MouseEvent<HTMLButtonElement>} e - 클릭 이벤트
     * @param {FlattenTreeDataModel} node - 선택된 노드 데이터
     */
    const handleAddPopover = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>, node: FlattenTreeDataModel) => {
            e.stopPropagation();
            setPopoverData(prev =>
                prev.anchorElm === e.currentTarget
                    ? { anchorElm: null, node: null }
                    : { anchorElm: e.currentTarget, node },
            );
        },
        [],
    );

    /**
     * 아이템 수정 팝오버를 여는 핸들러
     * @param {React.MouseEvent<HTMLDivElement>} e - 클릭 이벤트
     * @param {FlattenTreeDataModel} node - 수정할 노드 데이터
     */
    const openEditPopover = (e: React.MouseEvent<HTMLDivElement>, node: FlattenTreeDataModel) => {
        setItemToEdit(node);
        setPopoverData({ anchorElm: e.currentTarget, node });
    };

    /**
     * 아이템 삭제 다이얼로그를 여는 핸들러
     * @param {React.MouseEvent<HTMLButtonElement>} e - 클릭 이벤트
     * @param {FlattenTreeDataModel} node - 삭제할 노드 데이터
     */
    const openDeleteDialog = (
        e: React.MouseEvent<HTMLButtonElement>,
        node: FlattenTreeDataModel,
    ) => {
        e.stopPropagation();
        setItemToDelete(() => getFindOriginData(structuredClone(originData), Number(node.id)));
        setDialog({
            open: true,
            contents: {
                title: '삭제하시겠습니까?',
                content: '삭제 시 하위 노드 변경이 있을 수 있습니다.',
            },
        });
    };

    // Effects
    useEffect(() => {
        const updatedTreeData = getFlattenTreeData(searchResult);
        setTreeData(updatedTreeData);
    }, [searchResult, getFlattenTreeData]);

    useEffect(() => {
        if (treeData?.length && isRequireSelect) {
            const findOriginData = getFindOriginData(originData, treeData[0].id as number);
            setSelected(findOriginData);
        }
    }, [treeData, isRequireSelect]);
    useEffect(() => {
        setSearchResult(structuredClone(originData));
    }, [originData]);

    /**
     * 트리뷰 컨테이너의 크기 변경을 감지하여 rootWidth 업데이트
     */
    useEffect(() => {
        if (!treeViewRef.current) return;

        const resizeObserver = new ResizeObserver(entries => {
            const [entry] = entries;
            if (entry) {
                const { width } = entry.contentRect;
                setRootWidth(width);
            }
        });

        resizeObserver.observe(treeViewRef.current);

        /* eslint-disable */
        return () => {
            resizeObserver.disconnect();
        };
    }, [treeViewRef]);

    return (
        <div ref={treeViewRef} className="uiTreeView" css={TreeViewStyle}>
            {/* 트리뷰 상단 검색 영역 */}
            <div className="header">
                <TreeSearchBar
                    setPopoverData={setPopoverData}
                    handleSearchTreeView={handleSearchTreeView}
                    rootWidth={rootWidth}
                />
            </div>

            {/* 트리뷰 */}
            <div className="wrap">
                <DndProvider backend={MultiBackend} options={getBackendOptions()}>
                    <Tree
                        sort={false}
                        ref={treeRef}
                        listComponent="ul"
                        listItemComponent="li"
                        tree={treeData}
                        rootId={0}
                        onDrop={() => {}}
                        render={(
                            node: FlattenTreeDataModel,
                            { depth, isOpen, hasChild, onToggle },
                        ) => {
                            return (
                                <TreeNode
                                    node={node}
                                    depth={depth}
                                    isOpen={isOpen}
                                    hasChild={hasChild}
                                    selectedItem={selected}
                                    onToggle={onToggle}
                                    onClickItem={targetNode =>
                                        handleClickItem(targetNode, clickTimeout, setClickTimeout)
                                    }
                                    onDoubleClick={openEditPopover}
                                    onStateChange={handleStateChange}
                                    openPopover={handleAddPopover}
                                    onDeleteItem={openDeleteDialog}
                                    setItemToEdit={setItemToEdit}
                                />
                            );
                        }}
                    />
                </DndProvider>
            </div>

            {/* 속성 세팅 팝오버 */}
            <TreeFilterPopover
                popoverData={popoverData}
                filterOption={filterOption}
                itemToEdit={itemToEdit}
                treeData={treeData}
                closePopover={closePopover}
                setDialog={setDialog}
                setItemToEdit={setItemToEdit}
                handleSaveData={handleSaveEdit}
            />

            {/* 수정/삭제 컨펌 다이얼로그 */}
            <TreeDialog
                dialogData={dialog}
                closeDialog={() => setDialog(null)}
                confirmEvent={
                    itemToEdit
                        ? () => handleSaveEdit(itemToEdit as FlattenTreeDataModel)
                        : () => deleteEvent?.(itemToDelete as Data)
                }
            />
        </div>
    );
};

export { TreeView };
