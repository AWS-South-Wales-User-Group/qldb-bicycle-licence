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

An example `script.yml` has been created to carry out an initial data load. This can be customised for individual requirements. The following gives a simple overview of the main structure of the script.

The `phases` attribute specifies how many virtual users will be generated in a given time period. In the example below, 3 virtual users will be created every second for 20 seconds. It is possible to specify the maximum number of concurrent users, or to ramp up the arrival rate, if necessary.

The `processor` attribute specifies the path to a `Javascript` file that implements custom business logic.

The `plugins` attribute is used to setup artillery to record response data in `CloudWatch`.

```yaml
config:
    target: "https://{example}.execute-api.eu-west-1.amazonaws.com/dev"
    phases:
      - duration: 20
        arrivalRate: 3
    processor: "createBicycleLicence.js"
    plugins:
      cloudwatch:
        namespace: "serverless-artillery-qldb-loadtest"
```

The `scenarios` section defines the scenarios that are to be run.

In the first example below, a call is made to the `createBicycleLicence` function of the JavaScript file referenced earlier. This scenario involves an `HTTP POST` request to the `/licences/` endpoint. The `json` attribute specifies the `JSON` object to be sent in the request body. The values are generated using the `Faker` library in the `Javascript` function.

Finally, the `licenceId` attribute that is returned in the response is captured, so that it can be used for later requests.

```yaml
scenarios:
    - flow:
        # call createTestPerson() to create the govid, firstName, lastName, DOB, type and address variables
        - function: "createBicycleLicence"
        - post:
            url: "/licences/"
            json:
                firstName: "{{ firstName }}"
                lastName: "{{ lastName }}"
                email: "{{ email }}"
                street: "{{ street }}"
                county: "{{ county }}"
                postcode: "{{ postcode }}"
            capture:
                json: "$.licenceId"
                as: "licenceId"
```

The next scenario makes an `HTTP PUT` call to the `/licences/` endpoint to add penalty points (a random number between 1 and 6) to a specific licence. The virtual user is paused for 30 seconds using the `think` action.

```yaml
        - think: 30
        - function: "generateRandom"
        - put:
            url: "/licences/"
            ifTrue: "{{ random }} > 1"
            json:
                licenceId: "{{ licenceId }}"
                points: "{{$randomNumber(1,6)}}"
```

The final example scenario updates a contact record with a new address.

```yaml
        - think: 30
        - function: "createNewAddress"
        - put:
            url: "/licences/contact/"
            ifTrue: "{{ random }} > 2"
            json:
                licenceId: "{{ licenceId }}"
                street: "{{ street }}"
                county: "{{ county }}"
                postcode: "{{ postcode }}"
```

## Removing the stack

The stack can be removed at any point using the following command:

```bash
npm run sls -- remove --stage dev
```
