import type { Preview } from '@storybook/react';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { background } from 'storybook/internal/theming';

/*
 * Initializes MSW
 * See https://github.com/mswjs/msw-storybook-addon#configuring-msw
 * to learn how to customize it
 */
// initialize();

const preview: Preview = {
    parameters: {
        backgrounds: {
            default: 'custom-background',
            values: [
                { name: 'custom-background', value: '#f7f7f7' },
                { name: 'white', value: '#ffffff' },
                { name: 'black', value: '#000000' },
            ],
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    // loaders: [mswLoader],
};

export default preview;
