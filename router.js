var Profile = require('./profile.js');
var renderer = require('./renderer.js');
var queryString = require('querystring');

var commonHeaders = {'Content-Type': 'text/html'};

function homeRoute(request,response)
{
	if(request.url==="/")
	{
		if(request.method.toLowerCase()==="get")
		{
			response.writeHead(200, commonHeaders);
			renderer.view("header", {}, response);
			renderer.view("search", {}, response);
			renderer.view("footer", {}, response);
			response.end();
		}
		else
		{
			request.on("data", function(postBody)
			{
				postBody = queryString.parse(postBody.toString());
				var username = postBody.username;
				console.log(username);
				response.writeHead(303, {"Location": "/"+username});
				response.end();
			});
		}
	}
}

function userRoute(request, response)
{
	var username = request.url.replace("/","");

	console.log("method: "+request.method + "\nurl: "+request.url);
	if(username.length && username!=="favicon.ico")
	{
		response.writeHead(200, commonHeaders);
		renderer.view("header", {}, response);

		var studentProfile = new Profile(username);
		studentProfile.on("end", function(profileJSON)
		{
			var values =
			{
				avatarUrl: profileJSON.gravatar_url,
				username: profileJSON.profile_name,
				badges: profileJSON.badges.length,
				points: profileJSON.points.JavaScript
			};
			renderer.view("profile", values, response);
			renderer.view("footer", {}, response);
			response.end();
		});

		studentProfile.on("error", function(error)
		{
			renderer.view("error", {errorMessage: error.message}, response);
			renderer.view("search", {}, response);
			renderer.view("footer", {}, response);
			response.end();
		});
	}
}

module.exports.home = homeRoute;
module.exports.user = userRoute;