import { useCallback, useEffect, useMemo, useState } from 'react';

import { SettingButtonStyle, SettingPopoverStyle } from './Setting.style';

import { usePersonalizationStore } from '../../../shared/hook';
import { SelectBox } from '../../../shared/ui';

import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import SettingsIcon from '@mui/icons-material/Settings';
import {
    Button,
    Divider,
    FormControlLabel,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Popover,
    Stack,
    Switch,
} from '@mui/material';

interface OwnProps {
    rowLimit?: number;
    rowLimitList?: number[];
    columns: {
        code: string;
        name: string;
        use: boolean;
        disabled?: boolean;
    }[];
    menuName: string;
}

const Setting = ({
    rowLimit,
    rowLimitList = [50, 100, 200, 300, 500],
    columns,
    menuName,
}: OwnProps) => {
    const parseRowLimitList = useMemo(
        () => rowLimitList.map(limit => ({ code: limit, name: `${limit}개씩보기` })),
        [rowLimitList],
    );

    // 일괄설정 popover관련
    const [anchorElement, setanchorElement] = useState<HTMLButtonElement | null>(null);
    const isPopoverOpen = useMemo(() => Boolean(anchorElement), [anchorElement]);

    // 개인화
    const { setPersonalization } = usePersonalizationStore();
    const dataList = usePersonalizationStore().getPersonalizationDataList(menuName);

    // 개인화 저장이 없을 때 컴포턴트 props로 저장
    useEffect(() => {
        if (!dataList) {
            const object: {
                colOpts: {
                    [key: string]: boolean;
                };
                rowLimit?: number;
            } = {
                colOpts: {},
            };

            if (rowLimit) {
                object.rowLimit = rowLimit;
            }

            columns.forEach(({ code, use }) => {
                object.colOpts = {
                    ...object.colOpts,
                    [code]: use,
                };
            });

            setPersonalization(menuName, 'main', {
                dataList: {
                    ...object,
                },
            });
        }
    }, []);

    // 컴포넌트 내부에서 사용하는 데이터
    const getSettingOptions = useMemo(() => {
        let result: {
            columns: {
                code: string;
                name: string;
                use: boolean;
                disabled?: boolean;
            }[];
            rowLimit?: number;
        } = {
            columns: [],
        };

        if (rowLimit) {
            result = {
                ...result,
                rowLimit: dataList?.rowLimit,
            };
        }

        const colOpts = columns.map(item => {
            const column = { ...item };

            column.use =
                dataList?.colOpts && dataList?.colOpts[item.code] !== undefined
                    ? dataList?.colOpts[item.code]
                    : item.use;

            // disabled 속성 유지
            column.disabled = item.disabled;

            return column;
        });

        result = {
            ...result,
            columns: [...colOpts],
        };

        return result;
    }, [dataList, rowLimit, columns]);

    const togglePopover = useCallback((element: HTMLButtonElement | null) => {
        setanchorElement(element);
    }, []);

    const handleUseSwitch = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const { checked, name } = event.target as HTMLInputElement;

        setPersonalization(menuName, 'main', {
            dataList: {
                ...dataList,
                colOpts: {
                    ...dataList?.colOpts,
                    [name]: checked,
                },
            },
        });
    };

    const handleRowLimit = (value: string | number | null) => {
        setPersonalization(menuName, 'main', {
            dataList: {
                ...dataList,
                rowLimit: value,
            },
        });
    };

    const resetColOpts = () => {
        const colOpts: {
            [key: string]: boolean;
        } = {};

        columns.forEach(({ code, use }) => {
            colOpts[code] = use;
        });

        setPersonalization(menuName, 'main', {
            dataList: {
                ...dataList,
                colOpts: { ...colOpts },
            },
        });
    };

    return (
        <>
            <IconButton
                css={SettingButtonStyle}
                aria-describedby="settingButton"
                size="small"
                className={isPopoverOpen ? 'is-active' : ''}
                onClick={event => togglePopover(event.currentTarget)}
            >
                <SettingsIcon />
            </IconButton>
            <Popover
                id="settingButton"
                anchorEl={anchorElement}
                open={isPopoverOpen}
                onClose={() => togglePopover(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                slotProps={{
                    paper: {
                        sx: {
                            mt: '3px',
                        },
                    },
                }}
            >
                <List css={SettingPopoverStyle}>
                    {rowLimit && (
                        <ListItem className="row-limit">
                            <ListItemText>
                                <strong>보기건수</strong>
                            </ListItemText>
                            <SelectBox
                                className="select-box"
                                value={[getSettingOptions?.rowLimit ?? 100, handleRowLimit]}
                                list={parseRowLimitList}
                                size="small"
                            />
                        </ListItem>
                    )}

                    <Divider variant="middle" component="li" />
                    <ListItem>
                        <ListItemText>
                            <strong>노출필드</strong>
                            <IconButton className="reset-button" onClick={resetColOpts}>
                                <RotateLeftIcon />
                            </IconButton>
                        </ListItemText>
                        <List>
                            {getSettingOptions?.columns &&
                                getSettingOptions.columns.map(item => {
                                    return (
                                        <ListItem key={item.code}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        name={item.code}
                                                        size="small"
                                                        color="default"
                                                        checked={item.use}
                                                        disabled={item.disabled}
                                                        onClick={handleUseSwitch}
                                                    />
                                                }
                                                label={item.name}
                                                labelPlacement="start"
                                            />
                                        </ListItem>
                                    );
                                })}
                        </List>
                    </ListItem>
                    <Stack>
                        <Button onClick={() => togglePopover(null)}>닫기</Button>
                    </Stack>
                </List>
            </Popover>
        </>
    );
};

export { Setting };
