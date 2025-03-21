import { css } from '@emotion/react';

const SettingButtonStyle = css`
    width: 24px;
    border: 1px solid #d4d4d4;
    border-radius: 5px;

    &.is-active {
        background: #666666;

        > svg {
            color: #fff;
        }
    }

    > svg {
        font-size: 12px;
    }
`;

const SettingPopoverStyle = css`
    * {
        font-size: 13px;
        strong {
            font-weight: bold;
            color: #666;
        }
    }

    li {
        .reset-button {
            width: 24px;
            height: 24px;
            border: 1px solid #d4d4d4;
            border-radius: 5px;
            margin-left: 5px;

            &.is-active {
                background: #666666;

                > svg {
                    color: #fff;
                }
            }

            > svg {
                font-size: 13px;
            }
        }

        li {
            padding-left: 0;
        }
    }
`;

export { SettingButtonStyle, SettingPopoverStyle };
