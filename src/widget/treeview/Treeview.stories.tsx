import { useState } from 'react';

import { useArgs } from '@storybook/preview-api';

import { TreeViewDataModel, TreeViewProps } from './model/TreeViewModel';
import { TreeView } from './TreeView';

import type { Meta, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof TreeView>;

const meta = {
    title: 'Widget/Treeview',
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        data: [
            {
                seq: 1,
                state: 'Y',
                pseq: 0,
                name: '카테고리',
                filter: { channel: [1, 2, 3, 4] },
                children: [
                    {
                        seq: 2,
                        state: 'Y',
                        pseq: 1,
                        name: '하위카테고리',
                        filter: { channel: [1, 2, 3] },
                        children: [
                            {
                                seq: 3,
                                state: 'Y',
                                pseq: 2,
                                name: '하위카테고리입니다',
                                filter: { channel: [1, 2] },
                            },
                        ],
                    },
                ],
            },
            {
                seq: 21,
                state: 'Y',
                pseq: 0,
                name: '카테고리2',
                filter: { channel: [1, 2, 3, 4, 5] },
                children: [
                    {
                        seq: 212,
                        state: 'Y',
                        pseq: 21,
                        name: '하위카테고리2',
                        filter: { channel: [1, 2, 3] },
                    },
                ],
            },
        ],
        filterOption: {
            channel: {
                label: '채널',
                option: [
                    { seq: 1, name: '뉴스' },
                    { seq: 2, name: '포털' },
                    { seq: 3, name: '카페' },
                    { seq: 4, name: '블로그' },
                    { seq: 5, name: '인스타그램' },
                ],
            },
        },
        selectedItem: null,
        isRequireSelect: true,
        addEvent: () => {},
        updateEvent: () => {},
        deleteEvent: () => {},
    },
    argTypes: {
        data: {
            description:
                '트리뷰 데이터 <br> { `seq`, `pseq`, `name` } 필수 <br> 필터 옵션 사용시 <br>`filter`:{ `필터 옵션 key값`: [seq배열...] }',
        },
        filterOption: {
            description: '필터 옵션',
        },
        selectedItem: {
            description: '선택 아이템',
        },
        isRequireSelect: {
            description: '아이템 필수 선택 여부 (기본값: true)',
        },
        addEvent: {
            description: '아이템 추가 이벤트 <br> `(item: Omit<TreeViewDataModel, "seq">) => void`',
        },
        updateEvent: {
            description:
                '아이템 수정 이벤트 <br> `(item: TreeViewDataModel, isStateChange?:boolean) => void`',
        },
        deleteEvent: {
            description: '아이템 삭제 이벤트 <br> `(item: TreeViewDataModel) => void`',
        },
    },
} satisfies Meta;
export default meta;

// 컴포넌트 기본
const StoryComponent = (args: TreeViewProps<TreeViewDataModel>) => {
    const [{ data }] = useArgs();
    const [selectedItem, setSelectedItem] = useState<TreeViewDataModel | null>(null);

    // const onDelete = (target: TreeViewDataModel) => {
    //     const deleteItemFromTree = (items: TreeViewDataModel[]): TreeViewDataModel[] => {
    //         return items.reduce<TreeViewDataModel[]>((acc, item) => {
    //             if (item.seq === target?.seq) {
    //                 return acc; // 삭제할 항목은 제외
    //             }

    //             const newItem = { ...item };
    //             if (item.children?.length) {
    //                 newItem.children = deleteItemFromTree(item.children);
    //             }

    //             return [...acc, newItem];
    //         }, []);
    //     };

    //     const updatedData = deleteItemFromTree(structuredClone(data));

    //     // console.log('DeleteEvent', target, updatedData);
    //     setData(updatedData);
    // };

    // const onAdd = (newItem: Omit<TreeViewDataModel, 'seq'>) => {
    //     const addItem = (items: TreeViewDataModel[]): TreeViewDataModel[] => {
    //         return items.map(item => {
    //             if (item.seq === Number(newItem.pseq)) {
    //                 const updatedChildren = item.children
    //                     ? [...item.children, { ...newItem, seq: Number(new Date()) }]
    //                     : [{ ...newItem, seq: Number(new Date()) }];
    //                 return { ...item, children: updatedChildren };
    //             }
    //             if (item.children && item.children.length > 0) {
    //                 return { ...item, children: addItem(item.children) };
    //             }
    //             return item;
    //         });
    //     };
    //     // console.log('addEvent', newItem);
    //     if (newItem.pseq === 0) {
    //         setData(prev => [...prev, { ...newItem, seq: Number(new Date()) }]);
    //     } else {
    //         const targetItem = addItem(structuredClone(data));

    //         setData(targetItem);
    //     }
    // };

    // child 요소 옵션값 부모 상속
    // const updateChildOpts = (
    //     node: TreeViewDataModel,
    //     parentGroupValues: FilterValueType | null = null,
    // ) => {
    //     // 현재 노드의 새로운 객체 생성
    //     const newNode = { ...node };

    //     // 부모의 옵션 값이 있는 경우, 각 그룹별로 처리
    //     if (parentGroupValues) {
    //         Object.entries(parentGroupValues).forEach(([groupKey, parentValues]) => {
    //             const currentValues = node.filter && (node.filter[groupKey] as number[]);
    //             if (Array.isArray(currentValues)) {
    //                 // 현재 노드의 값을 부모 값과 교차하여 필터링
    //                 newNode.filter = {};
    //                 newNode.filter[groupKey] = currentValues.filter(val =>
    //                     parentValues.includes(val),
    //                 );
    //             }
    //         });
    //     }

    //     // 자식 노드가 있는 경우 재귀적으로 처리
    //     if (node.children && node.children.length > 0) {
    //         // 현재 노드의 그룹 값들을 수집
    //         const currentGroupValues = Object.entries(newNode.filter ? newNode.filter : {}).reduce(
    //             (acc, [key, val]) => {
    //                 if (Array.isArray(val)) {
    //                     acc[key] = val;
    //                 }
    //                 return acc;
    //             },
    //             {} as FilterValueType,
    //         );

    //         newNode.children = node.children.map(child =>
    //             updateChildOpts(child, currentGroupValues),
    //         );
    //     }

    //     return newNode;
    // };

    // const onUpdate = (target: TreeViewDataModel) => {
    //     // 아이템 수정/ 업데이트
    //     const updateItem = (items: TreeViewDataModel[]): TreeViewDataModel[] => {
    //         return items.map(item => {
    //             if (item.seq === target.seq) {
    //                 return target.filter
    //                     ? {
    //                           ...item,
    //                           name: target.name,
    //                           state: target.state,
    //                           filter: { ...target.filter },
    //                       }
    //                     : { ...item, name: target.name, state: target.state };
    //             }
    //             if (item.children && item.children.length > 0) {
    //                 return { ...item, children: updateItem(item.children) };
    //             }
    //             return item;
    //         });
    //     };

    //     const originUpdated = updateItem(structuredClone(data));
    //     const updated = originUpdated.map(item => updateChildOpts(item));

    //     // console.log('스토리파일 - Update', target, updated);
    //     setData(updated);
    // };

    return (
        <div
            className="TreeviewWrap"
            style={{ width: '320px', height: '280px', padding: '16px', background: '#fff' }}
        >
            <TreeView
                data={data}
                selectedItem={[selectedItem, setSelectedItem]}
                filterOption={args?.filterOption}
                isRequireSelect={args?.isRequireSelect}
            />
        </div>
    );
};

/**
 * 스토리 - Default
 */
export const basic: Story = {
    name: '기본(필터 옵션 사용)',
    render: StoryComponent,
};

/**
 * 스토리 - 필터 옵션 포함
 */
export const inFilter: Story = {
    name: '필터 옵션 미사용',
    args: {
        data: [
            {
                seq: 1,
                state: 'Y',
                pseq: 0,
                name: '카테고리',
                children: [
                    {
                        seq: 2,
                        state: 'Y',
                        pseq: 1,
                        name: '하위카테고리',
                    },
                ],
            },
        ],
        filterOption: {},
        isRequireSelect: false,
    },
    render: StoryComponent,
};
