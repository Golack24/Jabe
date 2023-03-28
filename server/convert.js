

import fs from 'fs'

import yaml from 'js-yaml'
import jsonlines from 'jsonlines'



const filePath = 'depression.yml';

try {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = yaml.load(fileContents);
  console.log(data);
} catch (e) {
  console.log(e);
}



try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(fileContents);
  
    if (!Array.isArray(data)) {
      throw new Error('Parsed data is not an array');
    }
  
    const output = [];
  
    data.forEach(convo => {
      let completion = '';
      convo.forEach((dialog, i) => {
        if (i === 0) {
          prompt = dialog;
          prompt = prompt.replace(/\xa0/g, ' ');
        } else {
          completion += ` ${dialog}`;
          completion = completion.replace(/\xa0/g, ' ');
        }
      });
      completion = completion.trim();
      const line = { prompt, completion };
      output.push(line);
    });
  
    const jsonlData = output.map(item => JSON.stringify(item)).join('\n');
    console.log(jsonlData);
  
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }