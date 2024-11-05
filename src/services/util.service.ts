

export const utilService = {
    debounce,
    getFormattedDate,
    getFormDate,
    getDateRange
}

function debounce<T extends (...args: any[]) => void>(func: T, timeout: number = 300): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>): void => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

function getFormattedDate(date = new Date()): string {
    const today = new Date(date);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so we add 1
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getFormDate(date: number): string {
    const today = new Date(date);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so we add 1
    const day = String(today.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
}


function getDateRange(start, end) {
    const dateArray = [];
    let currentDate = new Date(start);

    while (currentDate <= new Date(end)) {
        dateArray.push(utilService.getFormDate(currentDate.getTime())); // Format date as needed
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }

    return dateArray;
}


