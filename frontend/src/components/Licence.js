import React, { useEffect, useState } from "react";
import API from "@aws-amplify/api";
import { Form, Row, Col } from "react-bootstrap";
export default function Licence(props) {
  const [licence, setLicence] = useState({});

  useEffect(() => {
    if (props.licenceId) {
      //execute your code.
      getLicence(props.licenceId);
    }
  }, [props.licenceId]);

  function getLicence(licenceid) {
    const apiName = "ApiGatewayRestApi";
    const path = `/licences/${licenceid}`;
    API.get(apiName, path)
      .then((response) => {
        setLicence(response);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  function field(key, label, value) {
    return (
      <Form.Group as={Row} controlId={key}>
        <Form.Label column sm='2'>
          {label}:
        </Form.Label>
        <Col sm='10'>
          <Form.Control type='text' readOnly defaultValue={value} />
        </Col>
      </Form.Group>
    );
  }

  return (
    <>
      <Form>
        {field("firstName", "First Name", licence.firstName)}
        {field("lastName", "Last Name", licence.lastName)}
        {field("email", "Email", licence.email)}
        {field("street", "Street", licence.street)}
        {field("county", "County", licence.county)}
        {field("postcode", "PostCode", licence.postcode)}
        {field("penaltyPoints", "Penalty Points", licence.penaltyPoints)}
      </Form>
    </>
  );
}
