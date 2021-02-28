import { Octokit } from '@octokit/rest'
import { GITHUB_TOKEN } from './constants'

const octokit = new Octokit({
  auth: GITHUB_TOKEN
})

async function checkIfRepoExists (owner: string, repo: string): Promise<boolean> {
  try {
    const { status } = await octokit.request('GET /repos/{owner}/{repo}', {
      owner: owner,
      repo: repo
    })
    return status === 200
  } catch (error) {
    return false
  }
}

export async function ghCreateRepo (owner: string, repo: string, privateRepo: boolean = true): Promise<void> {
  const repoExists = await checkIfRepoExists(owner, repo)
  if (!repoExists) {
    await octokit.request('POST /orgs/{org}/repos', {
      org: owner,
      name: repo,
      private: privateRepo
    })
  }
}

export async function ghStartImport (org: string, sourceRepo: string, targetRepo: string): Promise<void> {
  await octokit.migrations.startImport({
    owner: org,
    repo: targetRepo,
    vcs_url: sourceRepo
  })
}
