import {IAppPost} from "../../../application/common/models/post.interface";

export type AppEditEventType = 'start' | 'cancel' | 'save'

interface IAppBasePostEditEvent {
    type: AppEditEventType;
}

export interface IAppPostEditEvent extends IAppBasePostEditEvent {
    type: 'start'
}

export interface IAppPostCancelEvent extends IAppBasePostEditEvent {
    type: 'cancel'
}

export interface IAppPostSaveEvent extends IAppBasePostEditEvent {
    type: 'save';
    payload: IAppPost;
}

export type AppPostEditEvent = IAppPostEditEvent | IAppPostCancelEvent | IAppPostSaveEvent

export interface IPostEditState {
    isEditMode: boolean;
    formValues: { title: string; body: string };
}
