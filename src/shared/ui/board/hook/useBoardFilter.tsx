import { useEffect, useState } from 'react';

import { BoardFilterItemModel } from '../model';

const useBoardFilter = (
    initialValue: (string | number)[],
    options: BoardFilterItemModel[],
    isMulti: boolean,
) => {
    // 팝오버의 열림/닫힘 상태
    const [isOpen, setIsOpen] = useState(false);
    // 팝오버의 앵커 요소
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    // 실제 선택된 옵션들
    const [selectedOptions, setSelectedOptions] = useState<(string | number)[]>(initialValue);
    // 임시로 선택된 옵션들 (팝오버에서 사용)
    const [tmpSelectedOptions, setTmpSelectedOptions] = useState<(string | number)[]>(initialValue);

    // 팝오버가 열리거나 선택된 옵션이 변경될 때 임시 선택 옵션 업데이트
    useEffect(() => {
        setTmpSelectedOptions(selectedOptions);
    }, [isOpen, selectedOptions]);

    // 옵션 토글 처리
    const handleToggle = (optionCode: string | number) => {
        if (isMulti) {
            setTmpSelectedOptions(prev =>
                prev.includes(optionCode)
                    ? prev.filter(code => code !== optionCode)
                    : [...prev, optionCode],
            );
        } else {
            setTmpSelectedOptions([optionCode]);
        }
    };

    // 확인 버튼 처리
    const handleConfirm = () => {
        setSelectedOptions(tmpSelectedOptions);
        setIsOpen(false);
        return tmpSelectedOptions;
    };

    // 취소 버튼 처리
    const handleCancel = () => {
        setTmpSelectedOptions(selectedOptions);
        setIsOpen(false);
    };

    // 전체 선택 처리
    const handleAllSelect = () => {
        const allSelect = options.map(option => option.code);
        setTmpSelectedOptions(allSelect);
    };

    // 선택된 옵션들의 라벨 생성
    const getSelectedLabel = () => {
        const selected = options
            .filter(item => tmpSelectedOptions.includes(item.code))
            .map(option => option.name);
        if (selected.length === 0) return '( 선택 없음 )';
        if (selected.length === options.length) return '( 전체 )';
        return `( ${selected.join(', ')} )`;
    };

    return {
        isOpen,
        setIsOpen,
        anchorEl,
        setAnchorEl,
        tmpSelectedOptions,
        handleToggle,
        handleConfirm,
        handleCancel,
        handleAllSelect,
        getSelectedLabel,
    };
};

export { useBoardFilter };
