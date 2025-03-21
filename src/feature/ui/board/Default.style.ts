import { css } from '@emotion/react';

const boardStyle = css`
    padding-top: 20px;

    strong {
        font-weight: bold;
        color: #666;
    }

    .infos {
        padding-bottom: 10px;
        color: #999;

        hr {
            display: block;
            width: 1px;
            height: 1em;
            margin: 0 10px;
            border: none;
            background: #d4d4d4;
        }
    }
    table {
        thead {
            th {
                background-color: #f7f8fa;
                color: #666;
                font-weight: bold;
            }
        }
        tbody {
            /* selectedItem 사용할 때만 cursor 적용 */
            &.use-selected {
                tr:not(.no-data) {
                    cursor: pointer;
                }
            }

            tr {
                th,
                td {
                    height: 39px;
                    padding: 4px 5px;
                    font-size: 13px;
                    line-height: 1;
                    color: #666;
                }
            }
        }
        padding-bottom: 20px;
    }

    label {
        width: 100%;
        height: 100%;
        justify-content: center;
        margin: 0;
    }
`;
export { boardStyle };
