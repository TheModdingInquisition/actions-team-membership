# Actions Team Membership

This GitHub action checks if a user is a member of a specific team within an organization. It's particularly useful for controlling workflow access or permissions based on team membership.

## Usage

To use this action, you'll need to create a workflow file (e.g., `.github/workflows/main.yml`) in your repository. Here is an example of how to set up the workflow:

```yaml
name: Check Team Membership

on:
  issues:
    types: [opened, edited]
  pull_request:
    types: [opened, edited]

jobs:
  check_membership:
    runs-on: ubuntu-latest
    steps:
      - name: Check if user is in the 'my-team'
        id: check
        uses: TheModdingInquisition/actions-team-membership@v1.0
        with:
          team: 'my-team'
```

### Inputs

The action supports the following input parameters:

| Name           | Description                                                                                                                            | Default                          | Required |
|----------------|----------------------------------------------------------------------------------------------------------------------------------------|----------------------------------|----------|
| `organization` | The organization to check for team membership.                                                                                         | `${{ github.repository_owner }}` | No       |
| `team`         | The slug of the team to check for.                                                                                                     |                                  | Yes      |
| `token`        | A personal access token with the `read:org` permission.                                                                                | `${{ github.token }}`            | No       |
| `comment`      | A comment to post on the issue or pull request if the user is not part of the team. This is only applicable in an issue or PR context. | `null`                           | No       |
| `exit`         | If set to `true`, the action will fail if the user is not a member of the team.                                                        | `true`                           | No       |

### Outputs

The action produces the following outputs:

-   `teams`: A JSON array containing the list of teams the user belongs to.
-   `permitted`: A boolean value (`true` or `false`) indicating whether the user is a member of the specified team.

You can use these outputs in subsequent steps of your workflow. For example:

```yaml
- name: Check Output
  run: echo "User is permitted: ${{ steps.check.outputs.permitted }}"
```

## License

This project is licensed under [MIT License](LICENSE)
