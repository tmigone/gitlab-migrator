import yesno from 'yesno'
import { ghCreateRepo, ghStartImport } from './github'
import { glAuthedURL, glListProjects } from './gitlab'
import { GITHUB_ORG, GITLAB_GROUP, GITLAB_GROUP_ID } from './constants'

async function runMigration (): Promise<void> {
  console.log('--- GitLab to GitHub migration tool ---')

  // Get projects from GitLab
  console.log('Getting projects from GitLab')
  const projects = await glListProjects(GITLAB_GROUP, parseInt(GITLAB_GROUP_ID))

  // Choose which projects to migrate
  const projectsToMigrate: string[] = []
  const migrateAll = await yesno({
    question: `Found ${projects.length} projects. Do you want to migrate all of them? Select "no" to select manually [Y/n]`,
    defaultValue: true
  })

  if (migrateAll) {
    projectsToMigrate.push(...projects)
  } else {
    for (const project of projects) {
      const yes = await yesno({
        question: `Found: ${project}. Do you want to migrate it? [Y/n]`,
        defaultValue: true
      })
      if (yes) {
        projectsToMigrate.push(project)
      }
    }
  }

  console.log(`${projectsToMigrate.length} project(s) selected for migration!`)

  // Run migration
  for (const project of projectsToMigrate) {
    // GitHub does not support folders or subgroups, so replace them with --
    const ghRepo = project.split('/').join('--')
    console.log(`${project}`)
    console.log(`- Creating GitHub repo: ${GITHUB_ORG}/${ghRepo}`)
    await ghCreateRepo(GITHUB_ORG, ghRepo)
    console.log(`- Starting GitHub import from ${project}`)
    await ghStartImport(GITHUB_ORG, glAuthedURL(project), ghRepo)
    console.log('- Import queued successfully!')
  }
}

/* eslint-disable-next-line */
runMigration()