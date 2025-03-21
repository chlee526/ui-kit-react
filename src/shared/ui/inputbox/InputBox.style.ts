import { css } from '@emotion/react';

// import { Theme } from '@mui/material';

// const Style = (theme: Theme) => {
const Style = () => {
    return css`
        border-bottom: none;
        background-color: #fff;

        &:after {
            content: none !important;
        }
    `;
};
export { Style };
