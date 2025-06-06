export interface IAppPost {
    userId: number;
    id: number;
    title: string;
    body: string
}

export type AppEventType = 'init' | 'add' | 'delete' | 'update'

interface IAppBasePostEvent {
    action: AppEventType;
}

export interface IAppInitPostEvent extends IAppBasePostEvent {
    action: 'init';
    payload: IAppPost[];
}

export interface IAppAddPostEvent extends IAppBasePostEvent {
    action: 'add';
    payload: IAppPost;
}

export interface IAppDeletePostEvent extends IAppBasePostEvent {
    action: 'delete';
    payload: number;
}

export interface IAppUpdatePostEvent extends IAppBasePostEvent {
    action: 'update';
    payload: IAppPost;
}

export type AppPostEvent = IAppInitPostEvent | IAppAddPostEvent | IAppDeletePostEvent | IAppUpdatePostEvent

export interface IAppLoadingOperation {
    operation: AppEventType;
    postId: number;
}
