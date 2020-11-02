import React, { useState } from "react";
import API from "@aws-amplify/api";
import { Form, Button, Col, Row, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Code from "./prism/Code";
import faker from "faker";

export default function Register() {
  const [firstName, setFirstName] = useState(faker.name.firstName);
  const [lastName, setLastName] = useState(faker.name.lastName);
  const [street, setStreet] = useState(faker.address.streetName);
  const [county, setCounty] = useState(faker.address.county);
  const [postcode, setPostcode] = useState(faker.address.zipCode);
  const [email, setEmail] = useState(faker.internet.email);
  const [message, setMessage] = useState({});
  const [isCreated, setIsCreated] = useState(false);
  const [licenceId, setLicenceId] = useState("");
  const [penaltyPoints, setPenaltyPoints] = useState(0);

  function handlePointsSubmit(evt) {
    evt.preventDefault();

    const apiName = "ApiGatewayRestApi";
    const path = "/licences";
    const payload = {
      body: {
        licenceId,
        points: penaltyPoints,
      },
    };
    API.put(apiName, path, payload)
      .then((response) => {
        console.log(response);
        setMessage(response);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  function handleSubmit(evt) {
    evt.preventDefault();

    if (isCreated) {
      update(evt);
    } else {
      create(evt);
    }
  }

  function create(evt) {
    const apiName = "ApiGatewayRestApi";
    const path = "/licences";
    const payload = {
      body: {
        firstName,
        lastName,
        street,
        county,
        postcode,
        email,
      },
    };
    setIsCreated(true);
    API.post(apiName, path, payload)
      .then((response) => {
        console.log(response);
        setMessage(response);
        setLicenceId(response.licenceId);
        setPenaltyPoints(response.penaltyPoints);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  function update(evt) {
    const apiName = "ApiGatewayRestApi";
    const path = "/licences/contact";
    const payload = {
      body: {
        licenceId,
        street,
        county,
        postcode,
      },
    };
    API.put(apiName, path, payload)
      .then((response) => {
        console.log(response);
        setMessage(response);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  return (
    <>
      <Row className='mt-3'>
        <Col md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId='firstname'>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type='text'
                value={firstName}
                disabled={isCreated}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder='Enter first name'
              />
            </Form.Group>
            <Form.Group controlId='lastname'>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type='text'
                value={lastName}
                disabled={isCreated}
                onChange={(e) => setLastName(e.target.value)}
                placeholder='Enter last name'
              />
            </Form.Group>
            <Form.Group controlId='street'>
              <Form.Label>Street</Form.Label>
              <Form.Control
                type='text'
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder='Enter street'
              />
            </Form.Group>
            <Form.Group controlId='county'>
              <Form.Label>County</Form.Label>
              <Form.Control
                type='text'
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                placeholder='Enter County'
              />
            </Form.Group>
            <Form.Group controlId='postcode'>
              <Form.Label>Postcode</Form.Label>
              <Form.Control
                type='text'
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder='Enter postcode'
              />
            </Form.Group>
            <Form.Group controlId='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='text'
                value={email}
                disabled={isCreated}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter email'
              />
            </Form.Group>
            <Button variant='dark' type='submit'>
              {!isCreated ? "create" : "update contact"}
            </Button>
          </Form>
        </Col>
        <Col md={6}>
          <Row>
            <Col>
              <Code
                code={JSON.stringify(message, null, 2)}
                language='javascript'
              />
            </Col>
          </Row>
          {isCreated ? (
            <Row className='mt-3'>
              <Col>
                <Card>
                  <Card.Body>
                    <Form onSubmit={handlePointsSubmit}>
                      <Form.Group>
                        <Form.Label xs='auto'>Penalty Points</Form.Label>

                        <Form.Control
                          type='number'
                          value={penaltyPoints}
                          onChange={(e) => setPenaltyPoints(e.target.value)}
                        />
                      </Form.Group>
                      <Row>
                        <Col>
                          <Button
                            className='float-right'
                            variant='dark'
                            type='submit'
                          >
                            update licence
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
                <Card className='mt-3'>
                  <Card.Body>
                    <Link
                      to={{
                        pathname: "/history",
                        state: {
                          licenceId,
                        },
                      }}
                    >
                      <Button block variant='secondary' type='submit'>
                        latest
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ) : (
            <></>
          )}
        </Col>
      </Row>
    </>
  );
}
