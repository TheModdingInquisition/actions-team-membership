import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';
import { getTeams } from './teamChecker';

run();

async function run() {
    try {
        const token = core.getInput('token') ? core.getInput('token') : process.env['GITHUB_TOKEN'];
        const username = context.actor;
        const team = core.getInput('team', {required: true});
        const teams = await getTeams(token, username);

        core.setOutput('teams', teams);
        const teamPresent = teams.some(te => te.toLocaleLowerCase() == team.toLocaleLowerCase());
        core.setOutput('permitted', teamPresent);

        if (core.getInput('comment') && !teamPresent) {
            const comment = core.getInput('comment');
            const issueNumber = context.payload.issue?.number;
            if (comment.length > 0 && issueNumber != 0) {
                const octokit = getOctokit(token);
                const { owner, repo } = context.repo;
                await octokit.rest.issues.createComment({
                    owner: owner,
                    repo: repo,
                    issue_number: issueNumber,
                    body: comment,
                });
            }
        }

        if (core.getInput('exit').toLocaleLowerCase() == 'true' && !permitted) {
            core.setFailed('Not permitted.');
        }
    } catch (err) {
        core.setFailed(`Error while trying to establish team membership: ${err}`);
    }
}