export interface AppPost {
    userId: number;
    id: number;
    title: string;
    body: string
}

type EventName = 'add' | 'delete' | 'update'

interface BasePostEvent {
    evt: EventName;
}

export interface AddPostEvent extends BasePostEvent {
    evt: 'add';
    post: AppPost;
}

export interface DeletePostEvent extends BasePostEvent {
    evt: 'delete';
    id: number;
}

export interface UpdatePostEvent extends BasePostEvent {
    evt: 'update';
    post: AppPost;
}

export type PostEvent = AppPost[] | AddPostEvent | DeletePostEvent | UpdatePostEvent
