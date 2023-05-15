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

            tasks[task].push(` - [${date}] ${PR.title} (#${PR.number})`);
        }

    });
    
    return tasks;
}

function fillReleaseNotesTemplate(tasksChanges, version) {
    let releaseNote = `# Release Notes for ${version}\n\n`;
    const tasks = Object.keys(tasksChanges).sort();
    tasks.forEach(task => {
        releaseNote += `## ${task}\n`;
        releaseNote += tasksChanges[task].join('\n');
        releaseNote += '\n\n';
    });
    
    return releaseNote;
}
