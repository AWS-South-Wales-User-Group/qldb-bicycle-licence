# qldb-bicycle-licence


### Development

#### backend deployment
``` bash
$ cd backend
$ npm ci
$ npm run sls -- deploy --stage <name>
```

#### frontend deployment
Update the frontend Amplify configuration in ```./frontend/src/index.js```
``` javascript
Amplify.configure({
  API: {
    endpoints: [
      {
        endpoint:
          "https://....execute-api.eu-west-1.amazonaws.com/....",
        name: "ApiGatewayRestApi",
        region: "eu-west-1",
      },
    ],
  },
});
```
``` bash
$ cd frontend
$ npm ci
$ npm run start
```

