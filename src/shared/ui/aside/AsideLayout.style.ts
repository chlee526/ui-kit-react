import { css } from '@emotion/react';

const resizerStyle = css`
    position: sticky;
    top: 0;
    width: 0;
    height: 100vh;
    margin-top: -42px;
    border: none;
    border-left: 2px solid #f7f8fa;
    border-right: 2px solid #eff1f4;
    background: transparent;
    cursor: e-resize;

    &:has(.is-closed) {
        pointer-events: none;
    }
`;

const buttonStyle = css`
    position: sticky;
    top: 60px;
    left: 0;
    width: 30px;
    min-width: auto;
    height: 80px;
    overflow: hidden;
    margin-left: -30px;
    border: 1px solid #e1e1e1;
    border-right: none;
    border-radius: 5px 0 0 5px;
    background: #eff1f4;
    text-align: left;
    text-indent: -9999px;
    z-index: 9;
    box-shadow: -1px 0 2px rgba(61, 61, 61, 0.16);
    transition: all 0.3s;
    pointer-events: auto;

    svg {
        transition: inherit;
    }

    &:hover {
        background: #eff1f4;

        svg {
            transform: scale(1.5);
        }
    }

    &.is-closed {
        background-color: #333333;
        color: #fff;

        &:hover {
            background: #333333;
        }
    }

    &:disabled {
        display: none;
    }
`;

const asideStyle = css`
    position: sticky;
    top: 42px;
    z-index: 1;
    width: 25%;
    height: calc(100vh - 42px);
    overflow: hidden;
    overflow-y: auto;
    padding: 20px;
    background: #eff1f4;
    box-sizing: border-box;
    margin-top: -42px;
    transition-duration: 0.3s;
    transition-property: min-width, padding;

    &.is-closed {
        width: 0 !important;
        min-width: 0 !important;
        padding-left: 0;
        padding-right: 0;
    }
`;
export { resizerStyle, buttonStyle, asideStyle };
