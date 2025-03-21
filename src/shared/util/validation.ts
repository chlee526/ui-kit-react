/**
 * 이메일 유효성 인증
 * @param {string} email 유효성 검증이 필요한 문자열 데이터
 * @returns {boolean} true: 이메일 유효, false: 이메일 유효하지 않음
 */
const getValidationEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
};

export { getValidationEmail };
