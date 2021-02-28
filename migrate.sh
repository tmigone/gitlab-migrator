#!/bin/bash

GITHUB_TOKEN=b9157c0df0424199f7310f1fd0d15fc5c05ae28b

# Get list of GitLab projects
# For each project:
# - clone code from gitlab
# - create github project
REPO_NAME="lalala2"
ORG_NAME="ghvault"
GITHUB_TOKEN="b9157c0df0424199f7310f1fd0d15fc5c05ae28b"

REPO_CREATED=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
  -H "Authorization: token '${GITHUB_TOKEN}'" \
  "https://api.github.com/orgs/'${ORG_NAME}'/repos" \
  -d '{"name":"'${REPO_NAME}'", "private": true}')
echo "$REPO_CREATED"

# - push code to github


