import {Post} from "../../common/models/post.model";
import {LoadingStatus} from "../../../../core/common/models/loadingStatus.model";

export interface PostsState {
    data: Post[];
    status: LoadingStatus;
    error: string | null;
}

export function createInitialState(): PostsState {
    return {
        data: [],
        status: 'idle',
        error: null
    };
}
