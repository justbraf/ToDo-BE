# Setup Guide

### Notes
Do not include the backend in your repository


### Installing dependencies
After cloning the repository, run the followwing commands in a terminal from the project folder

*npm i* - to install the dependecies listed in the package.json file
*npm i -D* - to install the development dependecies listed in the package.json file

## Using the API
### The **ADD** route
Adds a new task to the database
Method: POST
Expected fields:
- task
- owner

Optional fields:
- private [defaults to false if omitted]
- dueDate [defaults to the next day if omitted]

### The **REMOVE** route
Deletes a specified task from the database\
Method: DELETE\
Expected parameter: valid id

### The **UPDATE** route
Updates a specific task's field(s) or adds new field(s)\
Method: PUT\
Expected parameter: valid id\
Expected field: at least one field

### The **VIEW ALL** route
Returns all tasks stored in the database\
Method: GET\
Expected field: none

### The **VIEW ONE** route
Returns a specific task from the database\
Method: GET\
Expected parameter: valid id