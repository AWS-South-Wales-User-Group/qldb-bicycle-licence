import React, { useState } from "react";
import { Form, Card, Row, Col, InputGroup, Button } from "react-bootstrap";

import API from "@aws-amplify/api";

export default function Search() {
  const [licenceId, setLicenceId] = useState("");
  const [response, setResponse] = useState({});
  const [error, setError] = useState();


  function handleSubmit(evt) {
    evt.preventDefault();
    get(licenceId);
  }

  function get(licenceId) {
    const apiName = "ApiGatewayRestApi";
    const path = `/dynamodb/${licenceId}`;
    API.get(apiName, path)
      .then((response) => {
        setResponse(response);
        setError(null);
      })
      .catch((error) => {
        setError(error.response);
        setResponse({});
      });
  }

  function deleteLicence(evt) {
    evt.preventDefault();
    console.log('I AM HERE: ' + licenceId);
    const apiName = "ApiGatewayRestApi";
    const path = "/licences";
    const payload = {
      body: {
        licenceId,
      },
    };
    API.del(apiName, path, payload)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }


  function field(key, label, value) {
    return (
      <>
        <Form.Group as={Row} controlId={key}>
          <Form.Label column sm='2'>
            {label}:
          </Form.Label>
          <Col sm='10'>
            <Form.Control type='text' readOnly defaultValue={value} />
          </Col>
        </Form.Group>
      </>
    );
  }

  return (
    <>
      <Form className='mt-3' onSubmit={handleSubmit}>
        <InputGroup className='mb-2'>
          <InputGroup.Prepend>
            <InputGroup.Text>Licence ID</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            type='text'
            value={licenceId}
            onChange={(e) => setLicenceId(e.target.value)}
            placeholder='Enter Licence ID'
          />
          <InputGroup.Append>
            <Button variant='outline-secondary' type='submit'>
              Find
            </Button>
            <Button variant='outline-secondary' onClick={deleteLicence}>
              Delete
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Form>
      {error ? (
        <Card className='text-center mt-4'>
          <Card.Body className='mt-0'>
            <h4>{error.data.detail}</h4>
          </Card.Body>
        </Card>
      ) : (
        <>
          <Card border='light'>
            <Card.Body className='mt-0'>
              <Form mt-4>
                {field("licenceId", "Licence ID", response.id)}
                {field("postcode", "PostCode", response.postcode)}
                {field(
                  "penaltyPoints",
                  "Penalty Points",
                  response.penaltyPoints
                )}
              </Form>
            </Card.Body>
          </Card>
        </>
      )}
    </>
  );
}
