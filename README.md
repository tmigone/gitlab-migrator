# gitlab-migrator
Utility to migrate projects from GitLab to GitHub

## Usage

Populate `.env` file in root folder with the following:
- GITHUB_TOKEN
- GITLAB_TOKEN
- GITHUB_ORG
- GITLAB_GROUP
- GITLAB_GROUP_ID

```bash
npm install
./node_modules/ts-node/dist/bin.js src/index.ts
```