import { ReactNode, useCallback, useEffect, useMemo } from 'react';

import { asideStyle, buttonStyle, resizerStyle } from './AsideLayout.style';
import { handleAside } from './util/handleAside';

import { useMenuAuthContext, usePersonalizationStore } from '../../hook';

import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { IconButton } from '@mui/material';

interface OwnProps {
    /**
     * 개인화 저장/조회를 위한 메뉴 이름
     */
    menuName: string;
    /**
     * 초기상태
     */
    initState?: {
        'min-width': string;
        'max-width': string;
    };
    /**
     * `aside` 열림 여부
     */
    isOpen: boolean;
    /**
     * `aside` 열림/닫힘 핸들러
     */
    handleOpen: (state: boolean) => void;
    /**
     * 자식요소
     */
    children: ReactNode;
}

/**
 * 기본 초기값 설정
 */
const initValue = {
    isOpen: true,
    'min-width': '150px',
    'max-width': 'unset',
};

const AsideLayout = ({
    menuName,
    initState = initValue,
    isOpen,
    handleOpen,
    children,
}: OwnProps) => {
    // 메뉴 권한 컨텍스트 사용
    const methods = useMenuAuthContext();

    // 최대/최소 너비 메모이제이션
    const maxWidth = useCallback(() => initState['max-width'], [initState]);
    const minWidth = useCallback(() => initState['min-width'], [initState]);

    // 개인화 스토어 훅 사용
    const { setPersonalization, getPersonalization } = usePersonalizationStore();

    // 사이드바 사용 가능 여부 확인 (POST 또는 PUT 권한 필요)
    const useAside = useMemo(() => {
        return !!(methods && (methods.includes('POST') || methods.includes('PUT')));
    }, [methods]);

    /**
     * aside 넓이 개인화 적용
     * 렌더될때만 동작
     */
    const applyPersonalization = useCallback(() => {
        const personalization = getPersonalization;
        const menuPersonalization = personalization[menuName];

        const $aside = document.querySelector('aside') as HTMLElement;

        // 개인화 정보에 aside 존재하는지 확인 타입가드
        if (
            menuPersonalization &&
            typeof menuPersonalization === 'object' &&
            'aside' in menuPersonalization
        ) {
            const { aside } = menuPersonalization;

            // 개인화 aside가 객체인지 확인
            if (typeof aside === 'object' && aside !== null && 'width' in aside && $aside) {
                $aside.style.width = aside.width as string;
            } else {
                $aside.style.width = '25%';
            }

            $aside.style.transitionProperty = 'min-width, padding, width';
        }
    }, [getPersonalization, menuName]);

    /**
     * aside 넓이 개인화 저장
     * @param {string} width 퍼센트 포함 넓이
     */
    const savePersonalization = (width: string) => {
        if (!menuName) return;

        setPersonalization(menuName, 'aside', { width });
    };

    /**
     * `aside` 토글
     */
    const toggleAside = () => {
        handleOpen(!isOpen);
    };

    /**
     * `aside` 열림/닫힘 스타일 적용을 위한 클래스 토글
     */
    const getClassName = () => {
        return useAside && isOpen ? '' : 'is-closed';
    };

    /**
     * 컴포넌트 마운트 시 실행
     */
    useEffect(() => {
        // aside 사용할때만 동작
        if (useAside) {
            // 개인화 넓이 적용
            applyPersonalization();

            // aside 넓이 조정 이벤트
            handleAside(savePersonalization);
        }
    }, []);

    return useAside ? (
        <>
            {/* 리사이저 */}
            <div id="resizer" role="button" css={resizerStyle} tabIndex={0}>
                <IconButton className={getClassName()} css={buttonStyle} onClick={toggleAside}>
                    {isOpen ? <NavigateNextRoundedIcon /> : <NavigateBeforeRoundedIcon />}
                </IconButton>
            </div>

            {/* aside */}
            <aside
                className={getClassName()}
                css={asideStyle}
                style={{ maxWidth: maxWidth(), minWidth: minWidth() }}
            >
                {children}
            </aside>
        </>
    ) : null;
};

export { AsideLayout };
