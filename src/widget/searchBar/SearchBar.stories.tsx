import { useArgs as UseArgs } from '@storybook/preview-api';

import { SearchBarDefaultProps } from './model/SearchBarModel';
import { SearchBar } from './SearchBar';

import { SearchChipType } from '../../feature/chipList';

import type { Args, Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'Widget/SearchBar',
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        // value: [],
        value: null,
        typeList: null,
        multiple: false,
        size: 'small',
        selectProps: {
            sx: {
                width: '120px',
            },
        },
        inputProps: {
            sx: {
                width: '300px',
            },
        },
    },
    argTypes: {
        value: {
            description: '선택 값',
        },
        typeList: {
            description: '옵션 목록',
        },
        multiple: {
            description: '멀티 검색조건 사용 여부',
        },
        size: {
            description: '사이즈',
            options: ['small', 'medium'],
            control: {
                type: 'select',
            },
            table: {
                defaultValue: { summary: 'medium' },
                type: { summary: 'small | medium' },
            },
        },
    },
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof SearchBar>;
// type multiStory = StoryObj<typeof SelectMultiple>;

// 컴포넌트 기본
const StoryComponent = (args: SearchBarDefaultProps<SearchChipType | SearchChipType[]>) => {
    const [{ value }, setValue] = UseArgs();

    return (
        <SearchBar<SearchChipType>
            {...args}
            value={[value as SearchChipType, tmpValue => setValue({ value: tmpValue })]}
            typeList={args?.typeList}
            size={args?.size}
        />
    );
};

/**
 * 스토리 - Default
 */
export const basic: Story = {
    name: '기본',
    render: StoryComponent,
};

/**
 * 스토리 - 타입포함
 */
export const inType: Story = {
    name: '타입포함',
    args: {
        typeList: [
            { seq: '1', name: '옵션 1' },
            { seq: '2', name: '옵션 2' },
            { seq: '3', name: '옵션 3' },
            { seq: '4', name: '옵션 4' },
            { seq: '5', name: '옵션 5' },
        ],
    } as Partial<Args>,
    render: StoryComponent,
};

/**
 * 스토리 - 멀티 검색 조건
 */
export const multiple: Story = {
    name: 'Multiple',
    args: {
        value: [],
        typeList: [
            { seq: '1', name: '옵션 1' },
            { seq: '2', name: '옵션 2' },
            { seq: '3', name: '옵션 3' },
            { seq: '4', name: '옵션 4' },
            { seq: '5', name: '옵션 5' },
        ],
        multiple: true,
    } as Partial<Args>,
    render: StoryComponent,
};

/**
 * 스토리 - Error(외부 메시지형)
 */
// export const error2: Story = {
//     name: 'Error(외부메시지)',
//     args: {
//         errorMessage: '에러 메시지',
//     } as Partial<Args>,
//     render: StoryComponent,
// };

/**
 * 스토리 - Error(내부 메시지형 - 비정상값 할당)
 */
// export const error3: Story = {
//     name: 'Error(내부 메시지 - 비정상값 할당)',
//     args: {
//         value: 999,
//     } as Partial<Args>,
//     render: StoryComponent,
// };
