# QLDB Bicycle Licence

The QLDB Bicycle Licence application is a sample application to demonstrate some of the capabilities of `Amazon QLDB` and how it can be used to build out a serverless event-driven application.

The basic architecture overview of the application is shown below:

![Architecture Overview](images/architecture-overview.png)

Each seperate deployment is setup in a different folder in this repository. This allows the application to be deployed one component at a time.

## Deployments

Once the repository is cloned, it is important to deploy components in a specific order.

### API Gateway

The first component to be deployed is the centralised API Gateway. This is used to provide a single endpoint

``` bash
cd apigateway
npm ci
npm run sls deploy
```

### Backend

Next to be deployed are the backend components, consisting of AWS Lambda functions and Amazon QLDB

``` bash
cd backend
npm ci
npm run sls deploy
```

### Frontend

At this point, the UI can be deployed and configured. The first step is to update the frontend Amplify configuration in ```./frontend/src/index.js```

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

The frontend can be run locally using the following commands:

``` bash
cd frontend
npm ci
npm run start
```
