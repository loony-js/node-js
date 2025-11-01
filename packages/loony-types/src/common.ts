export enum ApiEvent {
    INIT,
    START,
    SUCCESS,
    FAILED,
    IDLE,
}

export type BooleanDispatchAction = React.Dispatch<React.SetStateAction<boolean>>;
export type VoidReturnFunction = () => void;