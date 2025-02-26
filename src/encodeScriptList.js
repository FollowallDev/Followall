const fs = require('fs');
const Joi = require('joi');

// Define the object
const filename = process.argv[2];

if (!filename) {
  console.error('Please provide a filename as a command line argument');
  process.exit(1);
}
console.log(process.cwd());
const scriptlist = require(process.cwd() + "/" + filename);

const scriptListSchema = Joi.object({
  url: Joi.string().uri().required(),
  status: Joi.string(),
  disabled: Joi.boolean(),
  description: Joi.string().max(1000),
  name: Joi.string().max(250).required(),
  homepage: Joi.string().uri().required(),
})

const scriptSchema = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' }).required(),
  version: Joi.number().integer(), //If you supply a version number it will be used to determine if the script needs to be updated otherwise it will always be updated
  name: Joi.string().max(250).required(),
  regex: Joi.string().pattern(new RegExp('^.*$')).required(),
  updateMethod: Joi.string().valid('xhr', 'screen').required(),
  type: Joi.string().valid('remote').required(),
  description: Joi.string().max(1000).required(),
  script: Joi.string().required()
});


try {

  for (const script of scriptlist.scripts) {

    scriptSchema.validate(script);
    console.log('Valid Script Schema:', script.name);
  }

  scriptListSchema.validate(scriptlist)

  console.log('Valid Scriptlist Schema');
  // Convert the object to a JSON string
  const jsonString = JSON.stringify(scriptlist, null, 2);
  let fileNameStart = filename.split('.')[0]
  // Attempt to parse the JSON string back into an object
  JSON.parse(jsonString);

  // If no error was thrown, the JSON is valid
  console.log('Valid JSON');



  // Write the JSON string to a file
  fs.writeFile(fileNameStart + '.json', jsonString, (err) => {
    if (err) throw err;
    console.log('The file has been saved as ' + fileNameStart + '.json');
  });
} catch (error) {
  // If an error was thrown, the JSON is not valid
  console.error('Invalid JSON:', error);
}