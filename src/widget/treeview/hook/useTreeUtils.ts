import { useCallback } from 'react';

import { FilterValueType, FlattenTreeDataModel, TreeViewDataModel } from '../model/TreeViewModel';

const useTreeUtils = () => {
    /**
     * 특정 노드의 모든 부모 노드 시퀀스를 찾는 함수
     * @param {number} seq - 대상 노드의 시퀀스 번호
     * @param {TreeViewDataModel[]} originData - 원본 트리 데이터
     * @returns {number[]} 부모 노드들의 시퀀스 배열 (최상위 부모부터 직계 부모 순)
     */
    const getFindParentSeq = (seq: number, originData: TreeViewDataModel[]): number[] => {
        /**
         * 재귀적으로 부모 노드들을 찾는 내부 함수
         * @param {TreeViewDataModel[]} items - 현재 탐색 중인 트리 데이터
         * @param {number} targetSeq - 찾고자 하는 노드의 시퀀스
         * @param {number[]} currentPath - 현재까지의 경로 (부모 노드들의 시퀀스)
         * @returns {number[] | null} 부모 노드의 시퀀스 배열
         */
        const findParentRecursive = (
            items: TreeViewDataModel[],
            targetSeq: number,
            currentPath: number[] = [],
        ): number[] | null => {
            return items.reduce<number[] | null>((result, item) => {
                if (result) return result;

                // 현재 아이템의 자식들 중에서 targetSeq를 찾음
                if (item.children?.some(child => child.seq === targetSeq)) {
                    return [...currentPath, item.seq];
                }

                // 더 깊은 레벨 탐색
                if (item.children?.length) {
                    const childResult = findParentRecursive(item.children, targetSeq, [
                        ...currentPath,
                        item.seq,
                    ]);
                    if (childResult) {
                        return childResult;
                    }
                }

                return null;
            }, null);
        };

        return findParentRecursive(structuredClone(originData), seq) || [];
    };

    /**
     * 트리 데이터에서 특정 ID를 가진 노드를 찾는 함수
     * @param {TreeViewDataModel[]} origin - 검색할 트리 데이터
     * @param {number} targetId - 찾고자 하는 노드의 ID
     * @returns {TreeViewDataModel | null} 찾은 노드 또는 null
     */
    const getFindOriginData = (origin: TreeViewDataModel[], targetId: number) => {
        let result = null;
        origin.find(item => {
            if (item.seq === targetId) {
                result = item;
                return true;
            }

            if (item.children?.length) {
                const found = getFindOriginData(item.children, targetId);
                if (found) {
                    result = found;
                    return true;
                }
            }
            return false;
        });

        return result;
    };

    /**
     * 계층 구조의 트리 데이터를 평면화된 형태로 변환하는 함수
     * @param {TreeViewDataModel[]} originData - 원본 트리 데이터
     * @returns {FlattenTreeDataModel[]} 평면화된 트리 데이터 배열
     */
    const getFlattenTreeData = useCallback(
        (originData: TreeViewDataModel[]): FlattenTreeDataModel[] => {
            return originData.flatMap(item => {
                const node: FlattenTreeDataModel = {
                    id: Number(item.seq),
                    parent: item.pseq,
                    text: item.name,
                    droppable: true,
                    ...(item.filter &&
                        Object.keys(item.filter).length && { filter: { ...item.filter } }),
                    ...item,
                };

                return [node, ...(item.children?.length ? getFlattenTreeData(item.children) : [])];
            });
        },
        [],
    );

    /**
     * 두 필터 값 객체를 비교하여 차이가 있는지 확인하는 함수
     * @param {FilterValueType} prevFilter - 이전 필터 값 객체
     * @param {FilterValueType} newFilter - 새로운 필터 값 객체
     * @returns {boolean} 필터 값이 다르면 true, 같으면 false
     */
    const isFilterDifferent = (
        prevFilter: FilterValueType = {},
        newFilter: FilterValueType = {},
    ): boolean => {
        // 키 목록 생성
        const allKeys = [...new Set([...Object.keys(prevFilter), ...Object.keys(newFilter)])];

        return allKeys.some(key => {
            const prevValues = prevFilter[key] || [];
            const newValues = newFilter[key] || [];

            // 배열 길이가 다르면 변경된 것
            if (prevValues.length !== newValues.length) {
                return true;
            }

            // 정렬 후 값 비교 (순서 무관하게 비교)
            const sortedPrev = [...prevValues].sort();
            const sortedNew = [...newValues].sort();

            return sortedPrev.some((value, index) => value !== sortedNew[index]);
        });
    };

    return { getFindParentSeq, getFindOriginData, getFlattenTreeData, isFilterDifferent };
};

export { useTreeUtils };
