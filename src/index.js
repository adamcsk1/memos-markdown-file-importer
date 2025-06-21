const fs = require('fs');
const path = require("path");
const request = require('request');
const _ =  require('lodash');
const config = JSON.parse(fs.readFileSync('config.json', {encoding: 'utf-8'}));
const fileList  = [];

const sendToMemos = async (mdContent) =>
  new Promise((resolve, reject) => {
    const createDate = new Date().toISOString();
    request.post(
      `${config.baseUrl}/api/v1/memos`,
      {
        json: {
          "state": "NORMAL",
          "creator": "Webhook",
          "createTime": createDate,
          "updateTime": createDate,
          "displayTime": createDate,
          "content": mdContent,
          "visibility": "PRIVATE",
          "pinned": false
        },
        headers: {
          'Authorization': `Bearer ${config.token}`
        }
      },
      (error, response) => {
        console.log(`Response status code: ${response.statusCode}`);
        if (!error && response.statusCode == 200) resolve();
        else reject(error);
      }
    );
  });

const collectFileList = (directory) =>
  fs.readdirSync(directory).forEach(file => {
    const absolutePath = path.join(directory, file);
    if (fs.statSync(absolutePath).isDirectory()) return collectFileList(absolutePath);
    else return fileList.push(absolutePath);
  });


(async () => {
  try{
    console.log('Import started');

    collectFileList(config.dataFolder);

    for(const file of fileList) {
      if(!file.endsWith('.md')) continue;
      console.log(file);

      let fileContent = fs.readFileSync(file, {encoding: 'utf-8'});

      if(config.addTagsByPath) {
        const filePathParts = file.split('\\');
        const tagByPath = _.camelCase(filePathParts.slice(1,filePathParts.length - 1).join(' '));
        fileContent = `${fileContent}\n#${tagByPath}`;
        if(config.changeFirstHeadingLevelTo && fileContent.startsWith('# ')) fileContent = fileContent.replace('# ', `${'#'.repeat(config.changeFirstHeadingLevelTo)} `);
      }

      await sendToMemos(fileContent);
    }
    console.log('Import finished');
  } catch(error) {
    console.log(error);
  }
})();