var log10 = Math.log(10);
export const getSignificantDigitCount = (n: number) => {
    if (n == 0) return 0;
    while (n != 0 && n % 10 == 0) n /= 10; //kill the 0s at the end of n

    return Math.floor(Math.log(n) / log10) + 1; //get number of digits
}