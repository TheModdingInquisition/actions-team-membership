import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';

const query = `query($pg: String, $organization: String!, $userLogins: [String!])  {
    organization(login: $organization) {
      teams (first:100, userLogins: $userLogins, after: $pg) {
          nodes {
            name
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
}`;

interface GraphQLQueryResponse {
    organization: {
        teams: {
            nodes: {
                name: string;
            }[];
            pageInfo: {
                hasNextPage: boolean;
                endCursor: string;
            };
        };
    };
}

const getTeams = async function(token: string, username: string): Promise<string[]> {
    const octokit = getOctokit(token);
    const org = core.getInput('organization') || context.repo.owner;

    let teams: string[] = [];
    let pg: string | null = null;
    let data: GraphQLQueryResponse | null = null;

    do {
        data = await octokit.graphql(query, {
            "pg": pg,
            "organization": org,
            "userLogins": [username],
        });

        teams = teams.concat(data!.organization.teams.nodes.map(val => val.name));
        pg = data!.organization.teams.pageInfo.endCursor;
    } while (data!.organization.teams.pageInfo.hasNextPage);

    return teams;
}

export { getTeams };