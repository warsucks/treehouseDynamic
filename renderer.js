var fs = require('fs');

function view(templateName, values, response)
{
	var fileContents = fs.readFileSync('./views/'+templateName+'.html', 'utf8');
	fileContents = mergeValues(values, fileContents);
	response.write(fileContents);
}

function mergeValues(keyValObj, content)
{
	for(var key in keyValObj)
	{
		content = content.replace("{{"+key+"}}", keyValObj[key])
	}
	return content;
}


module.exports.view = view;