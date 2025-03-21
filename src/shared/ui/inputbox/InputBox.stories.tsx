import { useArgs as UseArgs } from '@storybook/preview-api';

import { InputBox } from './InputBox';
import { InputBoxDefaultProps } from './model/InputBoxModel';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'Shared/ui/form/InputBox',
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        value: 'value값',
        type: 'text',
        label: '라벨',
        placeholder: '',
        helperText: '',
        size: 'medium',
        required: false,
        readOnly: false,
        fullWidth: true,
        sx: { width: 300 },
        color: '',
        disabled: false,
        errorMessage: '',
    },
    argTypes: {
        value: {
            description: '선택 값',
        },
        type: {
            description: '타입',
            options: ['text', 'password', 'number'],
            control: {
                type: 'select',
            },
            table: {
                defaultValue: { summary: 'text' },
                type: { summary: 'text | password | number' },
            },
        },
        label: {
            description: 'label명',
        },
        placeholder: {
            description: 'placeholder명',
        },
        helperText: {
            description: 'FormHelper 사용 여부 및 텍스트 설정',
        },
        required: {
            description: '필수 여부',
        },
        readOnly: {
            description: '읽기 전용 설정',
        },
        sx: {
            description: 'MUI sx 추가 설정, select로 sx가 상속.',
        },
        color: {
            description: '컬러',
            options: ['primary', 'secondary', 'success'],
            control: {
                type: 'select',
            },
            table: {
                defaultValue: { summary: 'text' },
                type: { summary: 'primary | secondary | success' },
            },
        },
        disabled: {
            description: '미사용 여부',
        },
        errorMessage: {
            description: '에러메시지 전달, 에러메시지가 전달되면 label이 활성화 되며 에러 표기',
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

type Story = StoryObj<typeof InputBox>;
// type multiStory = StoryObj<typeof SelectMultiple>;

// 컴포넌트 기본
const StoryComponent = (args: InputBoxDefaultProps) => {
    const [{ value }, setValue] = UseArgs();

    return (
        <InputBox
            {...args}
            value={[
                value,
                (tmpValue: string | number | null | typeof NaN) => setValue({ value: tmpValue }),
            ]}
        />
    );
};

/**
 * 스토리 - Default
 */
export const basic: Story = {
    name: '기본',
    render: args => StoryComponent(args as InputBoxDefaultProps),
};
