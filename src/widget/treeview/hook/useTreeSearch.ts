import { SetStateAction, useCallback } from 'react';

import { TreeViewDataModel, TreeNodeRef } from '../model/TreeViewModel';

interface OwnProps<Data> {
    originData: TreeViewDataModel[];
    treeRef: React.RefObject<TreeNodeRef>;
    getFindParentSeq: (seq: number, originData: TreeViewDataModel[]) => number[];
    setSearchResult: React.Dispatch<SetStateAction<Data[]>>;
}

const useTreeSearch = <Data extends TreeViewDataModel>({
    originData,
    treeRef,
    getFindParentSeq,
    setSearchResult,
}: OwnProps<Data>) => {
    /**
     * 검색 키워드와 일치하는 아이템의 모든 부모 노드 시퀀스를 찾는 함수
     * @param {string} keyword - 검색할 키워드
     * @returns {number[]} 부모 노드 시퀀스 배열
     */
    const getTargetParentSeq = useCallback(
        (keyword: string): number[] => {
            const parentSeq = new Set<number>();
            const processNode = (node: TreeViewDataModel): void => {
                if (node.name.toLowerCase().includes(keyword.toLowerCase())) {
                    getFindParentSeq(node.seq, originData).forEach(seq => parentSeq.add(seq));
                }
                node.children?.forEach(processNode);
            };

            originData.forEach(processNode);
            return Array.from(parentSeq);
        },
        [originData, getFindParentSeq],
    );

    /**
     * 트리 데이터 검색 처리 핸들러
     * @param {string} keyword - 검색할 키워드
     */
    const handleSearchTreeView = useCallback(
        (keyword: string) => {
            treeRef.current?.closeAll();

            // 빈값 검색시 전체 목록
            if (!keyword.trim()) {
                setSearchResult(structuredClone(originData) as SetStateAction<Data[]>);
                return;
            }

            /**
             * 재귀적으로 트리를 검색하는 내부 함수
             * @param {TreeViewDataModel[]} items - 검색할 트리 데이터
             * @returns {TreeViewDataModel[]} 검색 결과 트리 데이터
             */
            const searchTree = (items: TreeViewDataModel[]): TreeViewDataModel[] => {
                return items.reduce<TreeViewDataModel[]>((acc, item) => {
                    const matchKeyword = item.name.toLowerCase().includes(keyword.toLowerCase());
                    const childrenMatch = item.children ? searchTree(item.children) : [];

                    if (matchKeyword) {
                        acc.push({ ...item, children: item.children || [] });
                    } else if (childrenMatch.length > 0) {
                        acc.push({ ...item, children: childrenMatch });
                    }

                    return acc;
                }, []);
            };

            const result = searchTree(structuredClone(originData));
            setSearchResult(result as SetStateAction<Data[]>);

            // 검색 결과에 해당하는 부모 노드들을 펼침
            const parentSeq = getTargetParentSeq(keyword);
            setTimeout(() => treeRef.current?.open(parentSeq), 20);
        },
        [originData, getTargetParentSeq, treeRef, setSearchResult],
    );

    return { getTargetParentSeq, handleSearchTreeView };
};

export { useTreeSearch };
