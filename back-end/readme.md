
# back-end
Follow the below instruction to impletement and run back end on your local computer or server:

 - First of all, install NodeJs and MongoDB.
 - Open up your terminal/command line and go to back-end folder.
 - Install dependencies and packages using below command:

 npm install

 - install Nodemon for local and/or PM2 for the server from npm:

 npm install nodemon --global
or

 npm install pm2 --global

 - Then, run **mongod** command to start  mongo drive.
- Then, run one of the below commands to start project and

 nodemon app.js
or
 pm2 start app.js
