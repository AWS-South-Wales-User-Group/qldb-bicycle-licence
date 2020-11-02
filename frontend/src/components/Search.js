import React, { useState } from "react";
import { Form, Table, Row, Col, InputGroup } from "react-bootstrap";
import API from "@aws-amplify/api";

export default function Search() {
  const [lastname, setLastname] = useState("");
  const [response, setResponse] = useState([]);
  const [error, setError] = useState();

  function handleChange(evt) {
    evt.preventDefault();
    setLastname(evt.target.value);
    if (evt.target.value.length > 2) {
      search(evt.target.value);
    } else{
      setResponse([]);

    }
  }

  function search(lastname) {
    const apiName = "ApiGatewayRestApi";
    const path = `/search/${lastname}`;
    API.get(apiName, path)
      .then((response) => {
        const { hits } = response.body.hits;
        setResponse(hits);
        setError(null);
      })
      .catch((error) => {
        setError(error.response);
        setResponse([]);
      });
  }

  return (
    <>
      <Form className='mt-3'>
        <InputGroup className='mb-2'>
          <InputGroup.Prepend>
            <InputGroup.Text>Last Name</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            type='text'
            value={lastname}
            onChange={(e) => handleChange(e)}
            placeholder='Enter at least 3 characters of the last name'
          />
        </InputGroup>
      </Form>

      <Table striped bordered hover size='sm' className='mt-4'>
        <thead>
          <tr>
            <th>Licence ID</th>
            <th>Points</th>
            <th>Postcode</th>
            <th>First Name</th>
            <th>Last Name</th>
          </tr>
        </thead>
        <tbody>
          {response.map((value, index) => {
            return (
              <tr key={index}>
                <td>{value._source.licenceId}</td>
                <td>{value._source.points}</td>
                <td>{value._source.postcode}</td>
                <td>{value._source.firstName}</td>
                <td>{value._source.lastName}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}
