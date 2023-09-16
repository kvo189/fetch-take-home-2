
export const getSuggestedZipCodes = (zipCodeInput: string) => {
    const zLen = zipCodeInput.length;
    if (!(zLen >= 2 && zLen <= 5)) {
      return [];
    }

    let zipCodesArray: string[] = [];

    const generateZipCodes = (start: string, end: string, stepSize = 1) => {
      for (let i = +start; i <= +end; i += stepSize) {
        zipCodesArray.push(i.toString().padStart(5, '0'));
      }
    };

    switch (zLen) {
      case 2:
        const twoDigitStart = zipCodeInput.padEnd(5, '0');
        const twoDigitEnd = zipCodeInput + '999';
        const twoDigitStepSize = Math.ceil((parseInt(twoDigitEnd, 10) - parseInt(twoDigitStart, 10) + 1) / 100);
        generateZipCodes(twoDigitStart, twoDigitEnd, twoDigitStepSize);
        break;
      case 3:
      case 4:
        const startZIP = zipCodeInput.padEnd(5, '0');
        const endZIP = zipCodeInput.padEnd(5, '9');
        generateZipCodes(startZIP, endZIP);
        break;
      case 5:
        zipCodesArray.push(zipCodeInput);
        break;
      default:
        break;
    }
    return zipCodesArray;
  };
