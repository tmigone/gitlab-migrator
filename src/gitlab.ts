import { Gitlab } from '@gitbeaker/node'
import { GITLAB_TOKEN, GITLAB_SERVER } from './constants'
type SubGroup = Pick<Record<string, unknown>, 'id' | 'parent_id' | 'full_path'>

const api = new Gitlab({
  token: GITLAB_TOKEN,
  host: GITLAB_SERVER.includes('http') ? GITLAB_SERVER : `http://${GITLAB_SERVER}`
})

export function glAuthedURL (url: string): string {
  return `http://oauth2:${GITLAB_TOKEN}@${GITLAB_SERVER}/${url}`
}

async function getSubgroupsDeep (subgroup: SubGroup, result: SubGroup[]): Promise<SubGroup[]> {
  const subs = await api.Groups.subgroups(subgroup.id as number) as SubGroup[]
  if (subs.length === 0) {
    result.push(subgroup)
    return result
  } else {
    result.push(subgroup)
    for (const sub of subs) {
      await getSubgroupsDeep(sub, result)
    }
    return result
  }
}

export async function glListProjects (group: string, groupId: number): Promise<string[]> {
  const subgroups = await getSubgroupsDeep({ id: groupId, parent_id: null, full_path: group }, [])
  const groups = subgroups.map(s => s.full_path as string)

  // Populate projects
  const projects: string[] = []
  for (const gr of groups) {
    const repos = await api.GroupProjects.all(gr)
    for (const r of [...repos.map(r => `${gr}/${r.name}`)]) {
      if (!projects.includes(r)) {
        projects.push(r)
      }
    }
  }
  return projects
}
