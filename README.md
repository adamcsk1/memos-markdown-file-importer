# Memos markdown file importer

An unofficial markdown file import script for the memos note app.

# Usage

Set up the parameters in the root folder config.json and then run the `npm start` command.

# Config parameters

**dataFolder:** The markdown file source folder for the import.

**baseUrl:** Your memos instance base path.

**token:** The generated api token for the API access.

**addTagsByPath:** Generate tags from the file paths in camel case format. The source folder and the file name are not included.

**changeFirstHeadingLevelTo:** Decrease the first line heading to the selected level.

# Example config:

```
{
  "dataFolder": "./tmp/",
  "baseUrl": "https://mymemos.com",
  "token": "abcdefg",
  "addTagsByPath":  true,
  "changeFirstHeadingLevelTo": 3
}
```
