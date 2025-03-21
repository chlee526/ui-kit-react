import { css } from '@emotion/react';

// import { Theme } from '@mui/material';

// const Style = (theme: Theme) => {
const Style = () => {
    return css`
        display: flex;
        gap: 0.5em;

        > .wrap {
            > * {
                &:hover {
                    z-index: 1;
                }
                &.inputKeyword {
                    min-width: 200px;

                    .MuiInputBase-root {
                        width: calc(100% + 1px);
                        border-top-right-radius: 0;
                        border-bottom-right-radius: 0;
                    }
                }
                &:not(div:first-of-type) {
                    &.inputKeyword {
                        margin-left: -1px;

                        .MuiInputBase-root {
                            border-top-left-radius: 0;
                            border-bottom-left-radius: 0;
                        }
                    }
                }

                .selectType {
                    border-top-right-radius: 0;
                    border-bottom-right-radius: 0;
                }
            }

            button {
                min-width: 0;
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            }
        }
    `;
};
export { Style };
