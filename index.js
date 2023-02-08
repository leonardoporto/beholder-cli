#!/usr/bin/env node
require('dotenv').config({ path: '~/.beholder' })
const program = require('commander');
const package = require('./package.json');
const Table = require('cli-table');

const github = require('./github')


const concatLists = (lists) => [].concat.apply([], lists)
const convert = (pullRequests) => pullRequests.map((pullRequest) => ({
  repository: pullRequest.repository,
  title: pullRequest.title,
  user: pullRequest.user.login,
  url: pullRequest.html_url,
  approves: pullRequest.approves,
  updatedAt: pullRequest.updated_at
}))
const filterByOptions = (pullRequests, options) => {
  let data = pullRequests
  if (!options.bot) {
    data = data.filter(pullRequest => !pullRequest.user.includes('bot'))
  }
  if (!options.wip) {
    data = data.filter(pullRequest => !pullRequest.title.toUpperCase().includes('WIP'))
  }
  if (options.repos || process.env.GITHUB_REPOSITORY_GROUP) {
    const groups = options.repos || process.env.GITHUB_REPOSITORY_GROUP
    const repositories = groups.split(',')
    data = data.filter(pullRequest => repositories.includes(pullRequest.repository))
  }
  return data
}

const show = (pullRequests) => {
  const table = new Table({
    head: ['id', 'repository', 'title', 'user', 'link', 'approves', 'updated at'],
    colWidths: [4, 30, 40, 20, 70, 10, 25]
  })
  pullRequests.forEach(({ repository, title, user, updatedAt, url, approves }, index) => table.push([index + 1, repository, title, user, url, approves, updatedAt]))
  console.log(table.toString());
}

program.version(package.version);

program
  .option('-o, --org <org>', 'organization name', process.env.GITHUB_ORGANIZATION)
  .option('-b, --bot', 'list pr by bot', false)
  .option('-w, --wip', 'list pr with status work in progress', false)
  .option('-d, --debug', 'enable debug', false)
  .option('-r, --repos <repos>', 'filter by repos - separate by ","', process.env.GITHUB_REPOSITORY_GROUP)
  .action((options) => {
    options.debug && console.log(options)

    github
      .repositories(options)
      .then((repos) => Promise.all(repos.map(github.pullRequestsByRepository)))
      .then(concatLists)
      .then((pullRequests) => Promise.all(pullRequests.map(github.reviewsByPullRequest)))
      .then(convert)
      .then((pullRequests) => filterByOptions(pullRequests, options))
      .then(show)
      .catch(error => {
        options.debug && console.log({
          status: error && error.response && error.response.status,
          url: error && error.response && error.response.url,
        })
        console.log('Check your ~/.beholder file with github credentials.')
      })
  });

program.parse(process.argv);