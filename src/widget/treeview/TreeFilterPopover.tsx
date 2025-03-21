import { useLayoutEffect, useState } from 'react';

import { useTreeFilterPopover } from './hook/useTreeFilterPopover';
import { FilterValueType, PopoverFilterOptionModel, TreePopoverProps } from './model/TreeViewModel';
import { popoverStyle } from './Treeview.style';

import { InputBox } from '../../main';

import {
    Button,
    ClickAwayListener,
    List,
    ListItem,
    Popper,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';

/**
 * 필터 설정 팝오버 컴포넌트
 */
const TreeFilterPopover = ({
    treeData,
    popoverData,
    filterOption,
    handleSaveData,
    closePopover,
    itemToEdit,
    setItemToEdit,
    setDialog,
}: TreePopoverProps) => {
    // State
    const [groupName, setGroupName] = useState('');
    const [filterOpts, setFilterOpts] = useState<PopoverFilterOptionModel[]>([]);
    const [filterValue, setFilterValue] = useState<FilterValueType>({});

    // Hooks
    const {
        isPopoverOpen,
        isUseFilter,
        isConfirmValid,
        handleClickAway,
        handleFilterChange,
        handleConfirm,
        updateFilterOptions,
    } = useTreeFilterPopover({
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
    });

    /**
     * 필터 옵션과 값 업데이트
     */
    useLayoutEffect(() => {
        const filterData = structuredClone(filterOption) || {};

        const arrFilterData = Object.entries(filterData).map(([key, data]) => ({
            key,
            label: data.label,
            options: data.option,
        }));

        if (itemToEdit) {
            setGroupName(popoverData.node?.text ?? '');
            const selectedValues = arrFilterData.reduce(
                (acc, group) => ({
                    ...acc,
                    [group.key]: popoverData.node?.filter?.[group.key] ?? [],
                }),
                {} as FilterValueType,
            );
            setFilterValue(selectedValues);
        } else {
            setGroupName('');
            const selectedValues: FilterValueType = {};
            arrFilterData.forEach(group => {
                const seqArray = group.options.filter(item => !item.disabled).map(item => item.seq);
                selectedValues[group.key] = seqArray as number[];
            });
            setFilterValue(selectedValues);
        }

        if (isUseFilter) {
            arrFilterData.forEach(filterGroup => updateFilterOptions(filterGroup));
            setFilterOpts(structuredClone(arrFilterData));
        }
    }, [filterOption, treeData, popoverData, itemToEdit, isUseFilter]);

    return (
        <ClickAwayListener onClickAway={handleClickAway} mouseEvent="onMouseDown">
            <Popper
                id="addBtn"
                className="popOver"
                open={isPopoverOpen}
                anchorEl={popoverData.anchorElm}
                css={popoverStyle}
            >
                <List>
                    <ListItem>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ width: '100%' }}
                            gap={2}
                        >
                            <strong>이름</strong>
                            <div style={{ flexGrow: 1 }}>
                                <InputBox
                                    size="small"
                                    value={[
                                        groupName,
                                        value => {
                                            setGroupName(value as string);
                                        },
                                    ]}
                                />
                            </div>
                        </Stack>
                    </ListItem>
                    {filterOpts?.length > 0 &&
                        filterOpts.map(filter => (
                            <ListItem key={filter.key}>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ width: '100%' }}
                                    gap={2}
                                >
                                    <strong>{filter.label}</strong>
                                    <ToggleButtonGroup
                                        className="toggleButtonGrp"
                                        size="small"
                                        id={filter.key}
                                        value={filterValue[filter.key]}
                                        onChange={(e, value) =>
                                            handleFilterChange(e, value as number[], filter.key)
                                        }
                                    >
                                        {filter.options.map(item => (
                                            <ToggleButton
                                                key={item.seq}
                                                value={item.seq}
                                                disabled={item.disabled}
                                            >
                                                {item.name}
                                            </ToggleButton>
                                        ))}
                                    </ToggleButtonGroup>
                                </Stack>
                            </ListItem>
                        ))}
                </List>
                <div className="btnWrap">
                    <Button
                        className="saveBtn"
                        size="small"
                        variant="contained"
                        onClick={handleConfirm}
                        disabled={isConfirmValid}
                    >
                        적용
                    </Button>
                    <Button size="small" variant="contained" onClick={closePopover}>
                        취소
                    </Button>
                </div>
            </Popper>
        </ClickAwayListener>
    );
};

export { TreeFilterPopover };
