
export const MessageKey = {
    FN_HEADER_NAME: 'FN_HEADER_NAME',
};
export class AppUltil {
    /**
     * Constructor
     */
    constructor() {
    }

    public static base64ToBlob(base64) {
        try {
            const binaryString = window.atob(base64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; ++i) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return new Blob([bytes], { type: 'application/octet-stream' });
        }
        catch { return undefined; }
    };

    public static blobToBase64(blob: Blob) {
        return new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }

    public static async getBase64ImageFromFile(file) {
        const reader = new FileReader();
        const future = new Promise((resolve, reject) => {
            reader.addEventListener('load', function () {
                resolve(reader.result);
            }, false);
            reader.addEventListener('error', function (event) {
                reject(event);
            }, false);

            reader.readAsDataURL(file);
        });
        return future;
    }

    public static timeDifferenceInMinutes(start: Date, end: Date): number {
        const diffInMilliseconds = end.getTime() - start.getTime();
        return Math.floor(diffInMilliseconds / (1000 * 60)); // Chuyển đổi từ mili-giây sang phút
    }

    public static splitTextToParagraph(text, numberOfSentencePerPara) {
        let textArray = text.split('</p>');
        textArray = textArray.map(element => element + '</p>');

        let numberOfPara = textArray.length / numberOfSentencePerPara;
        let paragraph = []
        for (let i = 0; i < numberOfPara; i++) {
            let para = ''
            let firstPosition = i * numberOfSentencePerPara
            let lastPosition = ((i + 1) * numberOfSentencePerPara - 1)
            let maxj = lastPosition > (textArray.length - 1) ? (textArray.length - 1) : lastPosition
            for (let j = firstPosition; j <= maxj; j++) {
                para += textArray[j];
            }
            paragraph.push(para)
        }
        return paragraph;
    }
}
