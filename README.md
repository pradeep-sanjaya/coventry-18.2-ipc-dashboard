### BSc (Hons) in Computing
18.2

NIB307CR - Interactive Pervasive Computing

Course Work-2

SID : 9256224

NIBM ID: COBSCCOMP182P-030


## Prerequisite Softwares
1. Clone the Repo using the URL - https://github.com/pradeep-sanjaya/coventry-18.2-ipc-smartsleep.git

```
 https://github.com/pradeep-sanjaya/coventry-18.2-ipc-smartsleep.git
```

2. Run either of the following commands to install dependencies

```
 npm install
```

OR 

```
 yarn
```

3. Signup at [https://pusher.com/signup](https://pusher.com/signup).

4. Create a new app to obtain the API Key, secret & appId. Also, I have chosen the cluster **'ap2 (Mumbai, India)**, but you will be required to choose a cluster specific to your app users.

Replace the respective key, secret & appId for pusher initialisation in **server.js** file with your values:

```javascript
    var pusher = new Pusher({
    appId: '<your-app-id>',
    key: '<your-api-key>',
    secret: '<your-app-secret>',
    encrypted: true
    });
```

5. Finally you will have to also replace your app-key in **app.js** file too:

```javascript
 ...
 pusher = new Pusher('<your-api-key>', {
    authEndpoint: '/usersystem/auth',
    encrypted: true
 }),
 ...
```

6. Now we are ready to run our app using the following node commands

```
node server
```

7. We will be able to access the app at [http://localhost:9000](http://localhost:9000)
