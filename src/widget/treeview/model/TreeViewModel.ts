import React, { Dispatch, SetStateAction } from 'react';

import { NodeModel } from '@minoru/react-dnd-treeview';

// 트리뷰 데이터
interface TreeViewDataModel {
    seq: number;
    pseq: number;
    name: string;
    state?: string;
    filter?: {
        [key: string]: number[];
    };
    children?: TreeViewDataModel[];
}

// 평면화 트리 데이터
interface FlattenTreeDataModel extends NodeModel {
    filter?: Record<string, number[]>;
    state?: string;
}

// 트리뷰 노드 ref
interface TreeNodeRef {
    close: (seq: string | number | (string | number)[]) => void;
    open: (seq: string | number | (string | number)[]) => void;
    openAll: () => void;
    closeAll: () => void;
}

// 트리뷰 팝오버
interface PopoverDataModel {
    anchorElm: HTMLButtonElement | HTMLDivElement | null;
    node: FlattenTreeDataModel | null;
}

// 트리뷰 다이얼로그
interface TreeDialogModel {
    open: boolean;
    contents: {
        title: string;
        content: string;
    };
}

// 필터 옵션 아이템
interface FilterOptionItemModel {
    seq: number | string;
    name: string;
    disabled?: boolean;
}

// 필터 값
type FilterValueType = Record<string, number[]>;

// 팝오버 컴포넌트 내 필터 옵션
interface PopoverFilterOptionModel {
    key: string;
    label: string;
    options: FilterOptionItemModel[];
}

// 트리뷰 props
interface TreeViewProps<Data> {
    data: Data[];
    filterOption?: Record<string, { label: string; option: FilterOptionItemModel[] }>;
    selectedItem: [Data | null, Dispatch<SetStateAction<Data | null>>];
    deleteEvent?: (target: Data) => void;
    addEvent?: (target: Omit<Data, 'seq'>) => void;
    updateEvent?: (target: Data, isStateChange?: boolean) => void;
    isRequireSelect?: boolean;
}

// 팝오버 props
interface TreePopoverProps {
    treeData: FlattenTreeDataModel[];
    popoverData: PopoverDataModel;
    itemToEdit: FlattenTreeDataModel | null;
    filterOption?: Record<string, { label: string; option: FilterOptionItemModel[] }>;
    setDialog: React.Dispatch<SetStateAction<TreeDialogModel | null>>;
    setItemToEdit: (item: FlattenTreeDataModel) => void;
    handleSaveData: (data: FlattenTreeDataModel) => void;
    closePopover: () => void;
}

// 트리뷰 검색 props
interface TreeSearchBarProps {
    setPopoverData: React.Dispatch<React.SetStateAction<PopoverDataModel>>;
    handleSearchTreeView: (keyword: string) => void;
    rootWidth: number | undefined;
}

// 트리 노드 props
interface TreeNodeProps {
    node: FlattenTreeDataModel;
    depth: number;
    isOpen: boolean;
    hasChild: boolean;
    selectedItem: TreeViewDataModel | null;
    onToggle: (id: NodeModel['id']) => void;
    onClickItem: (node: FlattenTreeDataModel) => void;
    onDoubleClick: (e: React.MouseEvent<HTMLDivElement>, node: FlattenTreeDataModel) => void;
    onStateChange: (e: React.ChangeEvent<HTMLInputElement>, node: FlattenTreeDataModel) => void;
    openPopover: (e: React.MouseEvent<HTMLButtonElement>, node: FlattenTreeDataModel) => void;
    onDeleteItem: (e: React.MouseEvent<HTMLButtonElement>, node: FlattenTreeDataModel) => void;
    setItemToEdit: (item: FlattenTreeDataModel | null) => void;
}

// 트리뷰 다이얼로그 props
interface TreeDialogProps<Confirm> {
    dialogData: TreeDialogModel | null;
    closeDialog: () => void;
    confirmEvent: (params?: Confirm) => void;
}

export type {
    TreeNodeRef,
    TreeSearchBarProps,
    TreeNodeProps,
    TreeViewDataModel,
    FlattenTreeDataModel,
    PopoverDataModel,
    TreeDialogModel,
    TreeViewProps,
    FilterValueType,
    TreePopoverProps,
    PopoverFilterOptionModel,
    FilterOptionItemModel,
    TreeDialogProps,
};
