var CronJob = require('cron').CronJob;

const fetchGithub = require('./task/fetch-github');

var job = new CronJob('*/1 * * * * *', fetchGithub, null, true, 'America/Los_Angeles');
job.start(); 