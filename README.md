<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Document Management of jkTech</p>

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

## Test Case

1. test case hase been defined in the test directory
2. run the bellow comment to run the test .
```bash
npm run test:e2e
```
3. the logout is commented as the remoaing function need authorixation
4. athe documenet uplaod also comment as the path need to be correct

## swagger 
swagger is add for API documentation

## Stay in touch

- Author - Navaneeth [https://www.linkedin.com/in/navaneeth-nodejs-developer/], 
- Email: navneethnnair220@gmail.com

