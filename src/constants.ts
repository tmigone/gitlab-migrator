import * as dotenv from 'dotenv'

dotenv.config()

// Check values were provided
for (const envVar of ['GITLAB_TOKEN', 'GITHUB_TOKEN', 'GITHUB_ORG', 'GITLAB_GROUP', 'GITLAB_GROUP_ID']) {
  if (process.env[envVar] === undefined) {
    throw new Error(`${envVar} was not provided!`)
  }
}

// If env vars don't exist then we shouldn't get to this point, so it's safe to type assert them
export const GITLAB_TOKEN = process.env.GITLAB_TOKEN as string
export const GITHUB_TOKEN = process.env.GITHUB_TOKEN as string
export const GITHUB_ORG = process.env.GITHUB_ORG as string
export const GITLAB_GROUP = process.env.GITLAB_GROUP as string
export const GITLAB_GROUP_ID = process.env.GITLAB_GROUP_ID as string
export const GITLAB_SERVER = process.env.GITLAB_SERVER ?? 'gitlab.com'
