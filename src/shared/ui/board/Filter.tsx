import React from 'react';

import { boardFilterPopover, boardFilterStyle } from './Filter.style';
import { useBoardFilter } from './hook/useBoardFilter';
import { BoardFilterItemModel } from './model';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Switch } from '@mui/material';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';

interface OwnProps {
    id: string;
    title: string;
    isMulti?: boolean;
    options: BoardFilterItemModel[];
    value: (string | number)[];
    onChange: (value: (string | number)[]) => void;
}

/**
 *
 * @param {string} id
 * @param {string} title 필터 타이틀
 * @param {boolean} isMulti 멀티 여부 (기본: false)
 * @param {BoardFilterItemModel[]} options 필터 옵션
 * @param {string} value 선택된 값
 * @param {function} onChange 선택 값 업데이트 함수
 */

const Filter = ({ id, title, isMulti = false, options, value, onChange }: OwnProps) => {
    const {
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
    } = useBoardFilter(value, options, isMulti);

    // 필터 버튼 클릭 핸들러
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setIsOpen(true);
    };

    // 팝오버 닫기 핸들러
    const handleClose = () => {
        setAnchorEl(null);
        setIsOpen(false);
    };

    // 확인 버튼 클릭 핸들러
    const onConfirm = () => {
        const newValue = handleConfirm();
        onChange(newValue);
    };

    return (
        <div className="uiBoardFilter" css={boardFilterStyle}>
            <Button className="titleBtn" aria-describedby={id} size="small" onClick={handleClick}>
                <div className="title">
                    <FilterAltIcon className="icon" />
                    <strong>{title}</strong>
                </div>
                <span>{getSelectedLabel()}</span>
            </Button>

            {/* 팝오버 컨텐츠 */}
            <Popover
                id={id}
                className="boardFilterPopover"
                open={isOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                css={boardFilterPopover}
            >
                <div className="wrap">
                    <div className="header">
                        <div className="title">
                            <strong>
                                <FilterAltIcon className="icon" />
                                {title}
                            </strong>
                            <span className="selected">{getSelectedLabel()}</span>
                        </div>
                        {isMulti && (
                            <Button
                                className="allSelectBtn"
                                variant="outlined"
                                size="small"
                                onClick={handleAllSelect}
                            >
                                전체선택
                            </Button>
                        )}
                    </div>
                    <div className="content">
                        <div className="opts">
                            {options?.map(option => (
                                <dl key={option.code}>
                                    <dt>{option.name}</dt>
                                    <dd>
                                        <Switch
                                            size="small"
                                            color="default"
                                            checked={tmpSelectedOptions.includes(option.code)}
                                            onChange={() => handleToggle(option.code)}
                                        />
                                    </dd>
                                </dl>
                            ))}
                        </div>
                    </div>
                    <div className="btnWrap">
                        <Button
                            className="confirm"
                            variant="contained"
                            size="small"
                            onClick={onConfirm}
                            disabled={!tmpSelectedOptions.length}
                        >
                            적용
                        </Button>
                        <Button
                            className="cancel"
                            variant="outlined"
                            size="small"
                            onClick={handleCancel}
                        >
                            취소
                        </Button>
                    </div>
                </div>
            </Popover>
        </div>
    );
};

export { Filter };
