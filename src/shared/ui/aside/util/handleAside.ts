const handleAside = (savePersonalization: (newWidth: string) => void) => {
    let mouseX = 0;
    let asideWidth = 0;

    const handleMouseMove = (e: MouseEvent) => {
        const container = document.querySelector('#container') as HTMLElement;
        const aside = container.querySelector('aside') as HTMLElement;
        const main = container.querySelector('main') as HTMLElement;

        if (!container || !aside) return;

        // 마우스가 움직이면 초기 마우스 위치에서 현재 위치값과 차이 계산
        const dx = e.clientX - mouseX;

        // 마우스 커서 변경
        container.style.cursor = 'col-resize';

        // 이동 중 양쪽 영역에서 마우스 이벤트와 텍스트 선택을 방지하기 위해 추가
        main.style.userSelect = 'none';
        main.style.pointerEvents = 'none';

        aside.style.userSelect = 'none';
        aside.style.pointerEvents = 'none';
        aside.style.transitionDuration = 'unset';

        let newWidth: string | number = 0;
        const minWidth = aside.style.minWidth || getComputedStyle(aside).minWidth;

        const minWidthValue = parseInt(minWidth.replace(/px/g, ''), 10);

        // ✅ 마우스 옮길 때 실제 마우스 위치와 간격 차이 발생 오류 확인중
        if (minWidthValue > asideWidth - dx) {
            newWidth = ((minWidthValue * 100) / container.getBoundingClientRect().width).toFixed(2);

            // console.log('true', newWidth, asideWidth);
        } else {
            newWidth = (
                ((asideWidth - dx) * 100) /
                container.getBoundingClientRect().width
            ).toFixed(2);

            // console.log('false', newWidth);
        }

        if (parseFloat(newWidth) > 50) newWidth = '50';

        console.log('minWidthValue', asideWidth, e.clientX, mouseX, asideWidth - dx, newWidth);
        aside.style.width = `${newWidth}%`;

        savePersonalization(`${newWidth}%`);
    };

    const handleMouseUp = () => {
        // 커서 관련 스타일 및 이벤트 해제
        const container = document.querySelector('#container') as HTMLElement;
        const main = container.querySelector('main') as HTMLElement;
        const aside = container.querySelector('aside') as HTMLElement;

        container.style.removeProperty('cursor');

        main.style.removeProperty('user-select');
        main.style.removeProperty('pointer-events');

        aside.style.removeProperty('user-select');
        aside.style.removeProperty('pointer-events');
        aside.style.removeProperty('transition-duration');

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleMouseDown = (e: MouseEvent) => {
        // 마우스 위치값 저장
        mouseX = e.clientX;

        // aside 넓이 저장
        const aside = document.querySelector('aside') as HTMLAreaElement;
        asideWidth = aside.getBoundingClientRect().width;

        // 마우스 이동, 해제 이벤트 등록
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const Resizer = document.querySelector('#resizer') as HTMLElement;
    Resizer.addEventListener('mousedown', handleMouseDown);

    return asideWidth;
};

export { handleAside };
