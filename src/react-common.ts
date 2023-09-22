export interface ReactAppWindow<GameState> extends Window {
    socket: {
        of: (namespace: string) => WrappedSocket
        isConnected: boolean;
        on: (event: string, callback: (data: any) => void) => void;
    };
    gameState: GameState;
    gameApp: { userId: string };
}

export interface WrappedSocket {
    on: (event: string, callback: (data: any) => void) => void;
    emit: (event: string, ...args: any[]) => void;
    request: (event: string) => Promise<any>;
}


const requests = new Map<string, (result: any) => any>();

export interface SocketWrappedRequestResult {
    id: string;
    data: any;
}

export function requestWrap<ReturnType>(socket: WrappedSocket, eventName: string, ...args: any[]): Promise<ReturnType> {
    const id = `${+new Date()}`;
    socket.emit(eventName, id, ...args);
    return new Promise((resolve) => {
        requests.set(id, (result) => {
            resolve(result);
            requests.delete(id);
        });
    });
}

export function processWrappedRequest(result: SocketWrappedRequestResult) {
    requests.get(result.id)?.(result.data);
}
