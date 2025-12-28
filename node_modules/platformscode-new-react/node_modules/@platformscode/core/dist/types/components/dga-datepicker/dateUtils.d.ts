export declare const getMonthDays: (date: Date) => Date[];
export declare const getDaysFromPreviousMonth: (date: Date) => Date[];
export declare const getDaysFromNextMonth: (date: Date) => Date[];
export declare const isValidDate: (dateString: string) => boolean;
export declare const formatDate: (date: Date) => string;
export declare const defaultStaticRanges: {
    label: {
        en: string;
        ar: string;
    };
    range: () => {
        startDate: Date;
        endDate: Date;
    };
}[];
export declare function compareDatesWithoutTime(date1: Date, date2: Date): boolean;
export declare const validateInputDate: (date: string) => boolean;
export declare const daysMap: {
    en: string[];
    ar: string[];
};
export declare function sameDate(date1: any, date2: any): boolean;
