const numberAddZero = (target: number | string, digit = 2) => {
    let result = String(target);

    if (result.length < digit) {
        const len = digit - result.length;

        // len만큼 앞에 '0'을 추가하여 result를 패딩
        result = result.padStart(len + result.length, '0');
    }

    return result;
};

export { numberAddZero };
