import { ReactNode } from 'react';

import { asideBoxStyle } from './AsideBox.style';

import { Button } from '@mui/material';

interface OwnProps {
    /**
     * `AsideBox` 제목
     */
    title: string;
    /**
     * `AsideBox` 헤더 버튼 설정
     * ex) 키워드 등록 버튼
     */
    headerButton?: {
        /**
         * 버튼 텍스트
         */
        label: string;
        /**
         * 버튼 클릭 핸들러
         */
        onClick: () => void;
    } | null;
    /**
     *  자식 요소
     */
    children: ReactNode;
}
const AsideBox = ({ title, headerButton, children }: OwnProps) => {
    return (
        <div className="ui-box" css={asideBoxStyle}>
            {/* 헤더 영역 */}
            <div className="header">
                <h3>{title}</h3>
                {/* 헤더 버튼이 존재할 경우에만 렌더링 */}
                {headerButton && (
                    <Button
                        className="headerBtn"
                        variant="outlined"
                        size="small"
                        onClick={headerButton.onClick}
                    >
                        {headerButton.label}
                    </Button>
                )}
            </div>
            <hr />

            {/* 자식 요소 렌더링 */}
            {children}
        </div>
    );
};

export { AsideBox };
