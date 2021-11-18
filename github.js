require('dotenv').config()
const { Octokit } = require("@octokit/core");
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

const findRepositories = async (options) => octokit.request("GET /orgs/{org}/repos", {
  org: options.org,
  per_page: 999
}).then(({ data }) => data)

const findPullRequests = async ({ name: repositoryName }) => octokit.request("GET /repos/{owner}/{repo}/pulls", {
  owner: process.env.GITHUB_ORGANIZATION,
  repo: repositoryName
}).then(({ data }) => data.map(pullRequest => ({ ...pullRequest, repository: repositoryName })))

const findReviews = async (pullRequest) => octokit.request("GET /repos/{owner}/{repo}/pulls/{id}/reviews", {
  owner: process.env.GITHUB_ORGANIZATION,
  repo: pullRequest.repository,
  id: pullRequest.number,
}).then(({ data }) => ({ ...pullRequest, approves: data.filter(reviews => reviews.state === 'APPROVED').length }))

module.exports = {
  repositories: findRepositories,
  pullRequestsByRepository: findPullRequests,
  reviewsByPullRequest: findReviews,
}
