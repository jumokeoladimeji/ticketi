# CareTeam

# ZHICHI
* A customer support ticketing system for korapay


## Tools Used
| **Dependency** | **Use** |
|----------|-------|
|Nodejs|It is fast. It is JavaScript run-time environment for executing JavaScript code|
|MySQL| An object-relational database management system (ORDBMS)|
|Sequelize|A promise-based ORM for Node.js. It helps with data conversion|
|Express| A flexible Node.js web application framework|


## Test Tools
| **Dependency** | **Use** |
|----------|-------|
|Mocha| JavaScript testing library |
|Chai| A BDD/TDD assertion library for node and the browser that can be paired with any javascript testing framework|
|Cypress||


## HTTP ENDPOINTS
This can be found in service-events.md


### Set Up locally
* git clone
* cd to zhichi

### Installing dependencies
Run
```
npm install
```
```
brew install mysql
```

### DB set up
In MySQL Shell
* Connect to mysql server with the root user
mysql -uroot


* Create a user
```
CREATE USER 'test_user'@'localhost' IDENTIFIED BY 'password';
```

```
GRANT ALL PRIVILEGES ON *.* TO 'test_user'@localhost';
```

* Create a database
```
CREATE DATABASE db_name;
```

Update the database/config/config.json file with the details


### Populate the DB with meal and user data
In your terminal cd to the database folder and run:

```sequelize db:migrate
```


### To start the app
* Start app
```
npm start
```
or
```
nodemon start
```

### Running tests
* Create the test database

* Run the tests
```
npm test
```