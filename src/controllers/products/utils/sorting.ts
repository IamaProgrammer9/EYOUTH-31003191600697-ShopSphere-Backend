import { Request } from "express";

export function generateSortQueryFromRequest(req: Request) {
    const { sort } = req.query;
    
    const baseQuery: Record<string, string>[] = [
        { createdAt: 'desc' },
    ]
    
    if (!sort) return baseQuery;

    if (sort === 'Ascending') {
        baseQuery.push({ name: 'asc' });
    } else if (sort === 'Descending') {
        baseQuery.push({ name: 'desc' });
    } else if (sort === 'Oldest') {
        baseQuery[0].createdAt = 'asc';
    }

    return baseQuery;
}