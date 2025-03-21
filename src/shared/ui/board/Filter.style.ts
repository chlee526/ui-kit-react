import { css } from '@emotion/react';

const boardFilterStyle = css`
    .titleBtn {
        display: inline-block;
        color: #333333;

        .title {
            line-height: 1;

            .icon {
                position: relative;
                top: 1px;
                padding-right: 5px;
                font-size: 12px;
            }
        }

        span {
            font-size: 12px;
            color: #999999;
        }

        &:hover {
            background-color: inherit;

            .title {
                .icon {
                    transform: scale(1.2);
                }
            }
        }
    }
`;

const boardFilterPopover = css`
    .wrap {
        .header {
            padding: 10px 10px 0 10px;
            text-align: center;

            &::after {
                display: block;
                content: '';
                width: 90%;
                height: 1px;
                margin: 10px auto;
                background-color: #ededed;
            }

            .title {
                display: flex;
                flex-direction: column;
                gap: 5px;
                font-size: 14px;
                font-weight: bold;

                .icon {
                    position: relative;
                    top: 1px;
                    padding-right: 5px;
                    font-size: 12px;
                }

                .selected {
                    font-size: 12px;
                    font-weight: 400;
                    color: #999999;
                }
            }

            .allSelectBtn {
                min-width: 0;
                padding: 1px 5px;
                margin-top: 10px;
                font-size: 12px;
                background-color: #fff;
            }
        }

        .content {
            padding: 0 15px 10px;

            .opts {
                display: table-cell;

                dl {
                    display: table-row;
                    width: 100%;

                    dt {
                        display: table-cell;
                        padding: 0 30px 0 0;
                        vertical-align: middle;
                        text-align: left;
                        white-space: nowrap;
                        font-size: 13px;
                        font-weight: bold;
                    }

                    dd {
                        display: table-cell;
                        padding: 4px 0;
                        vertical-align: top;
                        white-space: nowrap;
                        text-align: left;
                        line-height: 1;
                        font-size: 13px;
                    }
                }
            }
        }

        .btnWrap {
            display: flex;
            justify-content: center;
            gap: 6px;
            padding: 10px;
            background-color: #f7f7f7;

            button {
                min-width: 0;
                padding: 3px 6px;
                font-size: 12px;

                &.cancel {
                    background-color: #fff;
                }
            }
        }
    }
`;

export { boardFilterStyle, boardFilterPopover };
