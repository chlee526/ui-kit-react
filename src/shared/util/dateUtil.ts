import { numberAddZero } from './index';
/**
 * 날짜 > 텍스트 변환
 * @param {String} format 날짜포멧(YYYY-MM-DD)
 * @param {String} separator 구분자
 * @returns {String} 2000-01-01
 */
const dateToString = (target: Date | string, format: string, separator: string = '-') => {
    const tmpDate = new Date(target);
    const year = tmpDate.getFullYear();
    const month = numberAddZero(tmpDate.getMonth() + 1);
    const date = numberAddZero(tmpDate.getDate());
    const hour = numberAddZero(tmpDate.getHours());
    const min = numberAddZero(tmpDate.getMinutes());
    const sec = numberAddZero(tmpDate.getSeconds());

    if (format) {
        const resultDate = [];
        const resultTime = [];
        if (format.includes('YYYY')) resultDate.push(year);
        if (format.includes('MM')) resultDate.push(month);
        if (format.includes('DD')) resultDate.push(date);
        if (format.includes('hh')) resultTime.push(hour);
        if (format.includes('mm')) resultTime.push(min);
        if (format.includes('ss')) resultTime.push(sec);
        return resultTime
            ? `${resultDate.join(separator)} ${resultTime.join(':')}`
            : resultDate.join(separator);
    }
    return [year, month, date].join(separator);
};

export { dateToString };
