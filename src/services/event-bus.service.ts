export const SHOW_MSG: string = 'show-msg';

interface Listener {
    (data: any): void;
}

interface EventEmitter {
    on(evName: string, listener: Listener): () => void;
    emit(evName: string, data: any): void;
}

function createEventEmitter(): EventEmitter {
    const listenersMap: { [key: string]: Listener[] } = {};
    return {
        on(evName: string, listener: Listener) {
            listenersMap[evName] = listenersMap[evName] ? [...listenersMap[evName], listener] : [listener];
            return () => {
                listenersMap[evName] = listenersMap[evName].filter(func => func !== listener);
            };
        },
        emit(evName: string, data: any) {
            if (!listenersMap[evName]) return;
            listenersMap[evName].forEach(listener => listener(data));
        }
    };
}

export const eventBus: EventEmitter = createEventEmitter();

export function showUserMsg(msg: any) {
    eventBus.emit(SHOW_MSG, msg);
}

export function showSuccessMsg(txt: string) {
    showUserMsg({ txt, type: 'success' });
}

export function showErrorMsg(txt: string) {
    showUserMsg({ txt, type: 'error' });
}
