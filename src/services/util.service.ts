

export const utilService = {
    saveToStorage,
    loadFromStorage,
    makeId,
    makeLorem,
    getRandomIntInclusive,
    debounce,
    getFormattedDate,
    getFormDate
}

function saveToStorage(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key: string) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}

function makeId(length: number = 6): string {
    let txt = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return txt;
}

function makeLorem(size: number = 100): string {
    const words = [
        'The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All',
        'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally',
        'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn'
    ];
    let txt = '';
    while (size > 0) {
        size--;
        txt += words[Math.floor(Math.random() * words.length)] + ' ';
    }
    return txt.trim();
}

function getRandomIntInclusive(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; // The maximum is inclusive and the minimum is inclusive 
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





