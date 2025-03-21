import { css } from '@emotion/react';

import { useTheme } from '@mui/material/styles';

const TreeViewStyle = () => {
    const theme = useTheme();

    return css`
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        height: 100%;
        box-sizing: border-box;

        ul,
        li {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .header {
            flex: 0 0;
        }

        > .wrap {
            flex: 1 1;
            width: 100%;
            height: 100%;
            overflow: auto;

            > ul {
                position: relative;
                width: 100%;
                height: 100%;

                &:empty {
                    &::before {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        content: '데이터가 없습니다';
                        font-size: 13px;
                        color: #999;
                    }
                }
                > li {
                    border-top: 1px solid #ddd;

                    .treeItem {
                        display: flex;
                        align-items: center;
                        gap: 2px;
                        padding: 4px;
                        padding-left: calc(var(--depth) * 10px);

                        &:hover {
                            background: #f3f3f3;
                        }

                        .expandBtn {
                            flex: 0 0;
                            position: relative;
                            top: 1px;
                            opacity: 1;

                            &.is-hide {
                                opacity: 0;
                                pointer-events: none;
                            }
                        }

                        .itemWrap {
                            position: relative;
                            flex: 1 1 100%;

                            &.is-selected {
                                > .textWrap {
                                    > .folderIcon,
                                    .name {
                                        color: ${theme.palette.primary.main} !important;
                                    }
                                }
                            }

                            &:hover {
                                .functionWrap {
                                    > .btnWrap {
                                        opacity: 1;
                                    }
                                }
                            }

                            .textWrap {
                                position: relative;
                                display: flex;
                                align-items: center;
                                gap: 3px;
                                width: 100%;

                                > .folderIcon {
                                    color: #666;
                                }

                                > .name {
                                    min-width: auto;
                                    width: 100%;
                                    max-width: calc(138px - (var(--depth) * 10px));
                                    box-sizing: border-box;
                                    white-space: nowrap;
                                    text-overflow: ellipsis;
                                    overflow: hidden;
                                }
                            }

                            .functionWrap {
                                display: flex;
                                align-items: center;

                                > .btnWrap {
                                    display: flex;
                                    gap: 3px;
                                    opacity: 0;
                                }
                            }
                        }
                    }
                }
            }
        }
    `;
};

const popoverStyle = css`
    padding: 6px;
    border: 1px solid #999;
    border-radius: 4px;
    box-sizing: border-box;
    background-color: #fff;
    z-index: 20;

    .toggleButtonGrp {
        > button {
            &:disabled {
                color: #999;
                background: #d9d9d9;
            }
        }
    }

    .btnWrap {
        display: flex;
        justify-content: center;
        gap: 6px;

        button {
            font-size: 12px;
        }
    }
`;

const searchBarStyle = css`
    width: 100%;
    padding: 10px;
    border-radius: 4px;
    background: #f3f3f3;
    box-sizing: border-box;

    .searchBarWrap {
        flex: 1 1;
    }

    .btnWrap {
        flex: 0 0;
    }
`;

export { TreeViewStyle, popoverStyle, searchBarStyle };
