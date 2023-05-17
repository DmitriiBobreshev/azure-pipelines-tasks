function generateReleaseNotesForPRs(PRs, version) {
    const tasksChanges = getTaskChangesFromPRs(PRs);
    return fillReleaseNotesTemplate(tasksChanges, version);
}
exports.generateReleaseNotesForPRs = generateReleaseNotesForPRs;

function getTaskChangesFromPRs(PRs) {
    const tasks = {};
    PRs.forEach(PR => {
        if (!PR.tasks) return;

        const closedDate = PR.pull_request.merged_at;
        const date = new Date(closedDate).toISOString().split('T')[0];
        for (let task of PR.tasks) {
            if (!tasks[task]) tasks[task] = [];

            tasks[task].push(` - ${PR.title} (#${PR.number}) (${date})`);
        }

    });
    
    return tasks;
}

function fillReleaseNotesTemplate(tasksChanges, version) {
    let releaseNote = `# Sprint ${version}\n\n`;
    const tasks = Object.keys(tasksChanges).sort();
    const reg = /(.*)(V[0-9]{1})$/;

    tasks.forEach(task => {
        const taskMatch = task.match(reg);
        if (taskMatch && taskMatch.length > 2) {
            releaseNote += `## ${taskMatch[1]} (${taskMatch[2]})\n`;
        } else {
            releaseNote += `## ${task}\n`;
        }
        releaseNote += tasksChanges[task].join('\n');
        releaseNote += '\n\n';
    });
    
    return releaseNote;
}
