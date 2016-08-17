##Prerequisite
before configureing and running karma test runner, we have to install the following software n your PC
1.Install [Node.js](https://nodejs.org/en/download) 
2.Install grunt and its depandencey package globally```npm install -g grunt-cli``` and ```npm install -g grunt```


##How to configure Karma
1.Clone the karma repositry from Gitlab server ```http://gitlab.cisco.com/overkill/karma-test-runner.git```
2.Navigate into ```karma-test-runner``` folder
3.Run the command ```npm install``` and will install the depandency node.js modules which are specified in the ```package.json``` to run the karma test case
4.Excute the karma test case by ```grunt karma:phantomjs,grunt karma:chrome```  or ```./node_modules/karma/bin/karma start``` 


##How to run the jslint test
1.we have installed ```jshint``` and added the task in grunt configuration file 
2.We invoke the task by using ```grunt jshint:all``` 