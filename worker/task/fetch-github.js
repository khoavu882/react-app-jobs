var fetch = require("node-fetch");

const redis = require("redis");
const client = redis.createClient();

const { promisify } = require("util");
const setAsync = promisify(client.set).bind(client);
// const getAsync = promisify(client.get).bind(client);

const baseURL = "https://jobs.github.com/positions.json";

async function fetchGitub() {
  let resultCount = 1,
    onPage = 0;
  const allJobs = [];

  // All page
  while (resultCount > 0) {
    const res = await fetch(`${baseURL}?page=${onPage}`);
    const jobs = await res.json();
    allJobs.push(...jobs);
    resultCount = jobs.length;
    console.log("got", resultCount, "jobs");
    onPage++;
  }

  console.log("got", allJobs.length, "jobs total");

  // Filter page
  const jrJobs = allJobs.filter((job) => {
    const jobTitle = job.title.toLowerCase();

    if (
      jobTitle.includes("senior") ||
      jobTitle.includes("manager") ||
      jobTitle.includes("architect") ||
      jobTitle.includes("sr")
    ) {
      return false;
    }
    return true;
  });

  console.log("filtered down to", jrJobs.length);

  const success = await setAsync("github", JSON.stringify(allJobs));
  console.log({ success });
}

fetchGitub();

module.exports = fetchGitub;
