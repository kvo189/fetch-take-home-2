

export const calculatePageEndIndex = (currentPage: number, pageSize: number, total: number) => {
    return Math.min((currentPage + 1) * pageSize, total);
};