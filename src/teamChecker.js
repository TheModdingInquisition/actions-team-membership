import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';

const query = `query($pg: String, $organization: String!, $userLogins: [String!], $username: String!)  {
    user(login: $username) {
        id
    }
    organization(login: $organization) {
      teams (first:1, userLogins: $userLogins, after: $pg) { 
          nodes {
            name
        }
        pageInfo {
          hasNextPage
          endCursor
        }        
      }
    }
}`

const getTeams = async function(token, username) {
    const octokit = getOctokit(token);
    const org = !core.getInput('organization') ? context.repo : core.getInput('organization');

    var teams = [];

    // Pagination
    var pg = null;
    let data = null;
    do {
        data = await octokit.graphql(query, {
            "pg": pg,
            "organization": org,
            "userLogins": [username],
            "username": username
        });

        teams = teams.concat(data.organization.teams.nodes.map(val => val.name));

        cursor = data.organization.teams.pageInfo.endCursor;
    } while (data.organization.teams.pageInfo.hasNextPage)
    return teams;
}

export { getTeams };