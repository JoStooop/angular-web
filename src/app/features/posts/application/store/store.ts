import {Post} from "../../common/models/post.model";
import {LoadingStatusType} from "../../../../core/common/models/loading-status.type";

export interface PostsState {
    data: Post[];
    status: LoadingStatusType;
    error: string | null;
}
// TODO: планировал вынести хранение постов сюда. Еще думаю над этим
export function createInitialState(): PostsState {
    return {
        data: [],
        status: 'idle',
        error: null
    };
}
