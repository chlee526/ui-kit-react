import { useArgs as UseArgs } from '@storybook/preview-api';

import { SelectBoxDefaultProps } from './model/selectModel';
import { SelectBox } from './SelectBox';

import type { Args, Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'Shared/ui/form/SelectBox',
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        value: '',
        list: [
            { seq: '1', name: '옵션 1' },
            { seq: '2', name: '옵션 2' },
            { seq: '3', name: '옵션 3' },
            { seq: '4', name: '옵션 4' },
            { seq: '5', name: '옵션 5' },
        ],
        label: '라벨',
        placeholder: '플레이스홀더',
        helperText: '',
        size: 'medium',
        required: false,
        readOnly: false,
        allSelect: '',
        emptySelect: '',
        sx: { width: 300 },
        disabled: false,
        errorMessage: '',
    },
    argTypes: {
        value: {
            description: '선택 값',
        },
        list: {
            description: '옵션 목록',
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
        allSelect: {
            description: `옵션에 '전체' 추가 되며, 선택값에 빈값 사용 가능`,
        },
        emptySelect: {
            description: `옵션에 '선택없음' 추가 되며, 선택값에 빈값 사용 가능`,
        },
        sx: {
            description: 'MUI sx 추가 설정, select로 sx가 상속.',
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

type Story = StoryObj<typeof SelectBox>;
// type multiStory = StoryObj<typeof SelectMultiple>;

// 컴포넌트 기본
const StoryComponent = (args: SelectBoxDefaultProps) => {
    const [{ value }, setValue] = UseArgs();

    return (
        <SelectBox
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...args}
            value={[value, (tmpValue: string | number | null | typeof NaN) => setValue({ value: tmpValue })]}
            list={args?.list}
            size={args?.size}
            required={args?.required}
            label={args?.label}
            // placeholder={args?.placeholder}
            errorMessage={args?.errorMessage}
            helperText={args?.helperText}
        />
    );
};

/**
 * 스토리 - Default
 */
export const basic: Story = {
    name: '기본',
    render: (args) => StoryComponent(args as SelectBoxDefaultProps),
};

/**
 * 스토리 - Error(외부 메시지형)
 */
export const error1: Story = {
    name: 'Error(필수선택)',
    args: {
        value: '',
        required: true,
    } as Partial<Args>,
    render: (args) => StoryComponent(args as SelectBoxDefaultProps),
};

/**
 * 스토리 - Error(외부 메시지형)
 */
export const error2: Story = {
    name: 'Error(외부메시지)',
    args: {
        errorMessage: '에러 메시지',
    } as Partial<Args>,
    render: (args) => StoryComponent(args as SelectBoxDefaultProps),
};

/**
 * 스토리 - Error(내부 메시지형 - 비정상값 할당)
 */
export const error3: Story = {
    name: 'Error(내부 메시지 - 비정상값 할당)',
    args: {
        value: 999,
    } as Partial<Args>,
    render: (args) => StoryComponent(args as SelectBoxDefaultProps),
};
