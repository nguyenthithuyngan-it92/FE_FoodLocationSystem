import React from "react";
import { Form } from "react-bootstrap";

const InputFormUser = React.forwardRef((props, ref) => {
  if (props.type === "file")
    return (
      <Form.Group className="mb-3" controlId={props.controlId}>
        <Form.Label>{props.label}</Form.Label>
        <Form.Control type="file" ref={ref} />
      </Form.Group>
    );

  return (
    <Form.Group className="mb-3" controlId={props.controlId}>
      <Form.Label style={{ color: "gray" }}>{props.label}</Form.Label>
      <Form.Control
        type={props.type}
        value={props.value}
        onChange={props.setValue}
        placeholder={props.label}
        disabled={props.disabled}
      />
    </Form.Group>
  );
});

export default InputFormUser;
