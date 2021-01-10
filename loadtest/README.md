# QLDB Bicycle Licence - Load Testing

## Overview

Load Testing is set up to enable load to be placed on the service, both for adding some initial data, as well as for allowing monitoring and optimisation to be carried out.

Load Testing uses [Serverless Artillery](https://github.com/Nordstrom/serverless-artillery).

## Setup

A local copy of the deployment assets of serverless artillery was first created using the following command:

```bash
slsart configure
```

This generates the `serverless.yml` file. The latest version of serverless artillery does not support serverless franmework from version 2 onwards. Therefore, the `package.json` file specifies a local version of serverless. In addition, the `Faker` library is used to create synthetic data.

## Deploying the stack

Run the following commands to install all required modules.

```bash
cd loadtesting
npm ci
```

Before deploying the default configuration, you need to update the `target` value in the `script.yml` with the `API Gateway` endpoint as previously carried out:

```yml
config:
    target: "https://{example}.execute-api.eu-west-1.amazonaws.com/dev"
```

To use the sample configuration settings, you can deploy and invoke using the following commands:

```bash
npm run slsart -- deploy --stage dev
npm run slsart -- invoke --stage dev
```

## Customising script.yml

An example `script.yml` has been created to carry out an initial data load.
