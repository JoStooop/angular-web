import {ICoreFilterSelections} from "../../../../../core/common/models/filter-options.model";

const _filters = {
    hasTitle: { label: 'hasTitle' },
    hasBody: { label: 'hasBody' },
    noTitle: { label: 'noTitle' },
    noBody: { label: 'noBody' },
} as const

export const filters: ICoreFilterSelections[] = Object.values(_filters);

export const nameFilters = _filters;
