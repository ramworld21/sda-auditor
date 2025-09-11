// Gets the days in a given month
export const getMonthDays = (date) => {
    const month = date.getMonth();
    const year = date.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
};
// Gets the remaining days from the previous month to display on the calendar
export const getDaysFromPreviousMonth = (date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const prevMonth = new Date(date.getFullYear(), date.getMonth(), 0); // Last day of previous month
    const dates = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        dates.unshift(new Date(prevMonth.getFullYear(), prevMonth.getMonth(), prevMonth.getDate() - i));
    }
    return dates;
};
// Gets the initial days from the next month to display on the calendar
export const getDaysFromNextMonth = (date) => {
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1); // First day of next month
    const dates = [];
    for (let i = 0; i < (6 - lastDayOfMonth); i++) {
        dates.push(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), nextMonth.getDate() + i));
    }
    return dates;
};
// const defineds = {
//   startOfWeek: startOfWeek(new Date()),
//   endOfWeek: endOfWeek(new Date()),
//   startOfLastWeek: startOfWeek(addDays(new Date(), -7)),
//   endOfLastWeek: endOfWeek(addDays(new Date(), -7)),
//   startOfToday: startOfDay(new Date()),
//   endOfToday: endOfDay(new Date()),
//   startOfYesterday: startOfDay(addDays(new Date(), -1)),
//   endOfYesterday: endOfDay(addDays(new Date(), -1)),
//   startOfMonth: startOfMonth(new Date()),
//   endOfMonth: endOfMonth(new Date()),
//   startOfLastMonth: startOfMonth(addMonths(new Date(), -1)),
//   endOfLastMonth: endOfMonth(addMonths(new Date(), -1)),
// };
// const staticRangeHandler = {
//   range: {},
//   isSelected(range) {
//     const definedRange = this.range();
//     return (
//       isSameDay(range.startDate, definedRange.startDate) &&
//       isSameDay(range.endDate, definedRange.endDate)
//     );
//   },
// };
export const isValidDate = (dateString) => {
    // Match D/M/Y or DD/MM/YYYY format
    const regex = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/;
    if (!regex.test(dateString))
        return false;
    // Parse and check validity
    const [day, month, year] = dateString.split('/').map(Number);
    const parsedDate = new Date(year, month - 1, day);
    return (parsedDate.getDate() === day &&
        parsedDate.getMonth() === month - 1 &&
        parsedDate.getFullYear() === year);
};
export const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const startOfToday = new Date(today);
startOfToday.setHours(0, 0, 0, 0);
const endOfToday = new Date(today);
endOfToday.setHours(23, 59, 59, 999);
const startOfYesterday = new Date(yesterday);
startOfYesterday.setHours(0, 0, 0, 0);
const endOfYesterday = new Date(yesterday);
endOfYesterday.setHours(23, 59, 59, 999);
const startOfWeek = new Date(today);
startOfWeek.setDate(today.getDate() - today.getDay());
const endOfWeek = new Date(today);
endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
const startOfLastWeek = new Date(startOfWeek);
startOfLastWeek.setDate(startOfWeek.getDate() - 7);
const endOfLastWeek = new Date(endOfWeek);
endOfLastWeek.setDate(endOfWeek.getDate() - 7);
const startOfMonth = new Date(today);
startOfMonth.setDate(1);
const endOfMonth = new Date(today);
endOfMonth.setMonth(endOfMonth.getMonth() + 1, 0);
const startOfLastMonth = new Date(startOfMonth);
startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1, 1);
const endOfLastMonth = new Date(startOfMonth);
endOfLastMonth.setDate(endOfLastMonth.getDate() - 1);
const startOfLast3Months = new Date(startOfMonth);
startOfLast3Months.setMonth(startOfLast3Months.getMonth() - 3, 1);
const endOfLast3Months = new Date(startOfMonth);
endOfLast3Months.setDate(endOfLast3Months.getDate() - 1);
const startOfLast7Days = new Date(today);
startOfLast7Days.setDate(startOfLast7Days.getDate() - 6);
const startOfLast30Days = new Date(today);
startOfLast30Days.setDate(startOfLast30Days.getDate() - 29);
const startOfLast90Days = new Date(today);
startOfLast90Days.setDate(startOfLast90Days.getDate() - 89);
export const defaultStaticRanges = [
    {
        label: {
            en: 'Today',
            ar: 'اليوم'
        },
        range: () => ({
            startDate: startOfToday,
            endDate: endOfToday,
        }),
    },
    {
        label: {
            en: 'Yesterday',
            ar: 'الأمس'
        },
        range: () => ({
            startDate: startOfYesterday,
            endDate: endOfYesterday,
        }),
    },
    {
        label: {
            en: 'This Week',
            ar: 'هذا الأسبوع'
        },
        range: () => ({
            startDate: startOfWeek,
            endDate: endOfWeek,
        }),
    },
    {
        label: {
            en: 'Last Week',
            ar: 'الأسبوع الماضي'
        },
        range: () => ({
            startDate: startOfLastWeek,
            endDate: endOfLastWeek,
        }),
    },
    {
        label: {
            en: 'This Month',
            ar: 'هذا الشهر'
        },
        range: () => ({
            startDate: startOfMonth,
            endDate: endOfMonth,
        }),
    },
    {
        label: {
            en: 'Last Month',
            ar: 'الشهر الماضي'
        },
        range: () => ({
            startDate: startOfLastMonth,
            endDate: endOfLastMonth,
        }),
    },
    {
        label: {
            en: 'Last 3 Months',
            ar: 'آخر 3 أشهر'
        },
        range: () => ({
            startDate: startOfLast3Months,
            endDate: endOfLast3Months,
        }),
    },
    {
        label: {
            en: 'Last 7 Days',
            ar: 'آخر 7 أيام'
        },
        range: () => ({
            startDate: startOfLast7Days,
            endDate: endOfToday,
        }),
    },
    {
        label: {
            en: 'Last 30 Days',
            ar: 'آخر 30 يوم'
        },
        range: () => ({
            startDate: startOfLast30Days,
            endDate: endOfToday,
        }),
    },
    {
        label: {
            en: 'Last 90 Days',
            ar: 'آخر 90 يوم'
        },
        range: () => ({
            startDate: startOfLast90Days,
            endDate: endOfToday,
        }),
    },
];
export function compareDatesWithoutTime(date1, date2) {
    return (date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate());
}
export const validateInputDate = (date) => {
    // Regular expression to match the date format "Month Day, Year"
    const dateFormat = /^(?:January|February|March|April|May|June|July|August|September|October|November|December) (?:0?[1-9]|[12][0-9]|3[01]), (?:19|20)\d{2}$/;
    if (dateFormat.test(date)) {
        // Date format is valid
        console.log("date is valid");
        return true;
    }
    else {
        // Date format is invalid
        console.log("date is not valid");
        return false;
    }
};
export const daysMap = {
    en: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    ar: ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"]
};
export function sameDate(date1, date2) {
    return (date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate());
}
