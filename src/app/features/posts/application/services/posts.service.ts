import {Injectable} from '@angular/core';
import {Post} from "../../common/models/post.interface";
import {HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiService} from "../../../../application/services/api.service";
import {EditPostForm} from "../../ui/common/models/post-form.interface";
import {FilterType} from "../../ui/common/models/filter-type.type";

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    private _endpoint = 'posts'

    constructor(private api: ApiService) {
    }

    private filterPosts(posts: Post[], filter: FilterType | null): Post[] {
        const hasTitle = (post: Post) => post.title.length > 0;
        const hasBody = (post: Post) => post.body.length > 0;

        if (!filter) return [...posts]

        switch (filter) {
            case "hasTitle":
                return posts.filter(hasTitle)
            case "hasBody":
                return posts.filter(hasBody);
            case "noTitle":
                return posts.filter(post => !hasTitle(post))
            case "noBody":
                return posts.filter(post => !hasBody(post))
            default:
                return [...posts]
        }
    }

    private searchPosts(posts: Post[], query: string): Post[] {
        if (!query) return [...posts]

        return posts.filter(post => post.body.toLowerCase().includes(query.toLowerCase()))
    }

    public getPosts(limit?: number): Observable<Post[]> {
        let params = new HttpParams();
        if (limit != null) params = params.set('_limit', limit);

        return this.api.get<Post[]>(this._endpoint, params)
    }

    public addPost(newPost: Post): Observable<Post> {
        return this.api.post<Post>(this._endpoint, newPost)
    }

    public updatePost(post: Post): Observable<Post> {
        return this.api.patch<Post, EditPostForm>(this._endpoint, post.id, {
            title: post.title,
            body: post.body
        })
    }

    public deletePost(id: number): Observable<void> {
        return this.api.delete<void>(this._endpoint, id)
    }

    public filtersAndSearchPosts(posts: Post[], filter: FilterType | null, query: string): Post[] {
        let result = [...posts]

        if (filter) result = this.filterPosts(result, filter)
        if (query) result = this.searchPosts(result, query)

        return result
    }
}
