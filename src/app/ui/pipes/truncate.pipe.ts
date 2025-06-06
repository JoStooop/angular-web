import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
    transform(value: string, limit: number = 100, ellipsis: string = '...'): string {
        if (!value) return '';

        const shouldTruncate: boolean = value.length > limit
        const truncatedValue: string = value.slice(0, limit) + ellipsis

        return shouldTruncate ? truncatedValue : value
    }
}
