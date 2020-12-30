# QLDB Bicycle Licence

The QLDB Bicycle Licence application is a sample application to demonstrate some of the capabilities of `Amazon QLDB` and how it can be used to build out a serverless event-driven application.

The basic architecture overview of the application is shown below:

![Architecture Overview](images/architecture-overview.png)

Each seperate deployment is setup in a different folder in this repository. This allows the application to be deployed one component at a time.

## Deployments

### API Gateway


### Backend

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

