export interface AppPost {
    userId: number;
    id: number;
    title: string;
    body: string
}

type AppEventName = 'add' | 'delete' | 'update'

interface IAppBasePostEvent {
    evt: AppEventName;
}

export interface IAppAddPostEvent extends IAppBasePostEvent {
    evt: 'add';
    post: AppPost;
}

export interface IAppDeletePostEvent extends IAppBasePostEvent {
    evt: 'delete';
    id: number;
}

export interface IAppUpdatePostEvent extends IAppBasePostEvent {
    evt: 'update';
    post: AppPost;
}

export type PostEvent = AppPost[] | IAppAddPostEvent | IAppDeletePostEvent | IAppUpdatePostEvent
