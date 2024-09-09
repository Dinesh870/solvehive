let mapDifficulty = {
    easy: 1,
    medium: 2,
    hard: 3
}
export const sort_problem_in_increasing_order = (problems) => {
    const sorted_problems = problems.sort((a,b) => {
        const diffA = a.difficulty || 0;
        const diffB = b.difficulty || 0;
        return mapDifficulty[diffA] - mapDifficulty[diffB];
    });
    return sorted_problems;
}

export const sort_reverse_order = (problems) => {
    const sorted_problems = problems.sort((a,b) => {
        const diffA = a.difficulty || 0;
        const diffB = b.difficulty || 0;
        return mapDifficulty[diffB] - mapDifficulty[diffA];
    });
    
    return sorted_problems;
}