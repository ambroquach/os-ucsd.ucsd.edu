const fetch = require('node-fetch');

/*
 * Gets the name of the user who made a given PR and the repo they made the PR to
 */
function getListOfReposAndPRs(allPRs){
	let listOfPRs = []
	for (var i = 0; i < allPRs.length; i++){
		// each element in allPRs is a list of PRs, sorted ascending
		let currRepo = allPRs[i];

		// iterates through list of pr's for a repo
		for (var j = 0; j < currRepo.length; j++){
			let user = currRepo[j].user.login;
			// get repo url by remove the /pull/{number} at the end
			let repoURL = currRepo[j].html_url.split("/pull/", 2)[0];
			let repoName = repoURL.split("/os-ucsd/", 2)[1];
			let merged_time = currRepo[j].merged_at;
		
			// make sure the pr was actually merged in
			if (currRepo[j].merged_at != null){
				listOfPRs.push({
					user: user, 
					repoURL: repoURL,
					repoName: repoName,
					merged_time: merged_time,
				});
			}
		}
	}

	// sorting all of the pr's based on time merged in
	listOfPRs = listOfPRs.sort((a,b) => {
		let dateA = new Date(a.merged_time);
		let dateB = new Date(b.merged_time);
		return dateB - dateA;	
		/*
		if (dateA - dateB === 0){	
			let timeA = Date.parse('1/01/2019 ' + a.time);
			let timeB = Date.parse('1/01/2019 ' + b.time);	
			return timeB - timeA;
		}
		return new Date(b.date) - new Date(a.date);
	*/
	});
	
	return listOfPRs;
}

/*
 * Returns list of all PRs made to a given repo
 */
async function getPullRequests(repo){
	let prResponse = await fetch(repo.pulls_url.replace('{/number}', '?state=closed'));
	let pr = await prResponse.json();
	return pr;
}

/*
 * Make HTTP request to retrieve list of repos from os-ucsd
 */
async function getRepos(){
	// try-catch in case we reach the limit for github api and we get some error trying to use repos var
	try{
		let reposResponse = await fetch('https://api.github.com/orgs/os-ucsd/repos')
		let repos = await reposResponse.json();
	
		// get pr's for all repos
		let allPRs = await Promise.all( 
			repos.map(repo => {
				// each pr returned is a list of pr's for a single repo
				return getPullRequests(repo);
			})
		);

		return getListOfReposAndPRs(allPRs)
	}
	catch(err){
		console.log("error!")
		return null;
	}
}

async function getAllPRs(){
	return getRepos();
}

//module.exports = getAllPRs;
export default getAllPRs;