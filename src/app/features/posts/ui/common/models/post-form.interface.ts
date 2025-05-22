export interface EditPostForm {
    title: string
    body: string
}

export type PostStatus = 'empty' | 'view' | 'edit';
