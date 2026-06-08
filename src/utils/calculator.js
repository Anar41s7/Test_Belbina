import { roleMapping } from '../data';

export function calculateResults(answers) {
    const scores = {
        "И": 0,
        "П": 0,
        "Ф": 0,
        "М": 0,
        "Р": 0,
        "О": 0,
        "К": 0,
        "Д": 0
    };

    for (const [key, value] of Object.entries(answers)) {
        const role = roleMapping[key];
        if (role && scores[role] !== undefined) {
            scores[role] += value;
        }
    }

    const sortedRoles = Object.entries(scores)
        .sort(([, a], [, b]) => b - a)
        .map(([role, score]) => ({ role, score }));

    return {
        scores,
        sortedRoles,
        topRole: sortedRoles[0]?.role || null
    };
}