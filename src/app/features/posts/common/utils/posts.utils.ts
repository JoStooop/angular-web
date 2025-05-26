import {Post} from "../models/post.interface";
import {FilterType} from "../../ui/common/models/filter-type.type";

// TODO: я утилиты прям зашил, можно сделать более универсальным. Без явного указания "posts" и перенести на ур. выше)

export const hasTitle = (post: Post) => post.title.length > 0;
export const hasBody = (post: Post) => post.body.length > 0;

export const filterPosts = (posts: Post[], filter: FilterType | null): Post[] => {
    if (!filter) return [...posts]

    switch (filter) {
        case "title":
            return posts.filter(hasTitle)
        case "body":
            return posts.filter(hasBody);
        case "noTitle":
            return posts.filter(post => !hasTitle(post))
        case "noBody":
            return posts.filter(post => !hasBody(post))
        default:
            return [...posts]
    }
}

export const searchPosts = (posts: Post[], query: string): Post[] => {
    if (!query) return [...posts]

    return posts.filter(post => post.body.toLowerCase().includes(query.toLowerCase()))
}

export const filtersAndSearchPosts = (posts: Post[], filter: FilterType | null, query: string): Post[] => {
    let result = [...posts]

    if (filter) result = filterPosts(result, filter)
    if (query) result = searchPosts(result, query)

    return result
}
