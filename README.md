<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Document Management of jkTech</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Document management is the nest js backend appliaction that provide Authaticationa and uplaod File and pass to python and using miscroservice get the status of the Ingestion.

## Installation

Clone the Application using the https://github.com/navnin2/document_management_jk.git 
```bash
git clone https://github.com/navnin2/document_management_jk.git
```

## Discription

In this API there is a user, role, documents and Ingestion Module,
User module the user can signup uisng the name, email and password,
Role module the has the role and permission of that,

1. Run npm intsall to install the packages in the package.json file
 ```bash
#npm install
   ```
2. crate a .env file a samble of env is provieded as .env.sample in the folder
3. after that run the below command to start the application 
 ```bash
# development
$ npm run start

# production mode
$ npm run start:prod
```
3. run the  GET /role to know all the role taht is seeded in the code.

4. then select teh role id and then craete the user with full_name , email, password amd role_id.
5. after success response you can login with that user email as username and password.

## Stay in touch

- Author - Navaneeth [https://www.linkedin.com/in/navaneeth-nodejs-developer/], Email: navneethnnair220@gmail.com

