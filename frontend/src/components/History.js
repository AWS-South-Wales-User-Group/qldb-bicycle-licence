import React, { useEffect, useState } from "react";
import API from "@aws-amplify/api";
import { Table, Card, Form, InputGroup, Button } from "react-bootstrap";
import Licence from "./Licence";

export default function History(props) {
  const [response, setResponse] = useState([]);
  const [licenceId, setLicenceId] = useState("");

  const routeProps = {
    match: props.match,
    history: props.history,
    location: props.location,
  };

  useEffect(() => {
    if (routeProps.location.state.licenceId) {
      setLicenceId(routeProps.location.state.licenceId);
      getHistory(routeProps.location.state.licenceId);
    }
  }, [routeProps.location.state.licenceId]);

  function getHistory(licenceid) {
    const apiName = "ApiGatewayRestApi";
    const path = `/licences/history/${licenceid}`;
    API.get(apiName, path)
      .then((response) => {
        const sortedResponse = response.sort(function (a, b) {
          return (
            new Date(b.data.events.eventDate) -
            new Date(a.data.events.eventDate)
          );
        });
        setResponse(sortedResponse);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  function handleSubmit(evt) {
    evt.preventDefault();
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
            <Button variant='outline-secondary'>Search</Button>
          </InputGroup.Append>
        </InputGroup>
      </Form>

      <Card border='light'>
        <Card.Body className='mt-0'>
          <Licence licenceId={routeProps.location.state.licenceId} />
        </Card.Body>
      </Card>
      <h5 className='mt-2'>Events</h5>
      <Table striped bordered hover size='sm' className='mt-3'>
        <thead>
          <tr>
            <th>Version</th>
            <th>Event Name</th>
            <th>Event Date</th>
          </tr>
        </thead>
        <tbody>
          {response.map((value, index) => {
            return (
              <tr key={index}>
                <td>{value.metadata.version}</td>
                <td>{value.data.events.eventName}</td>
                <td>{value.data.events.eventDate}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}
