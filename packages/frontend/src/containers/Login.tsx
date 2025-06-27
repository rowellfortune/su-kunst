import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import LoaderButton from "../components/LoaderButton.tsx";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../lib/contextLib";
import { useFormFields } from "../lib/hooksLib";
import { onError } from "../lib/errorLib";
import { Auth } from "aws-amplify";

export default function Login() {
    const [fields, handleFieldChange] = useFormFields({
        username: "",
        password: "",
    });
    const { userHasAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    const nav = useNavigate();

    function validateForm() {
       return fields.username.length > 0 && fields.password.length > 0;
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsLoading(true);

        try {
            await Auth.signIn(fields.username, fields.password);
            userHasAuthenticated(true);
            nav("/");
        } catch (error) {
            onError(error);
            setIsLoading(false);
        }
    }

    return (
        <div className="Login">
        <Form onSubmit={handleSubmit}>
            <Stack gap={3}>
            <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    autoFocus
                    size="lg"
                    type="text"
                    value={fields.username}
                    onChange={handleFieldChange}
                />
            </Form.Group>
            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    size="lg"
                    type="password"
                    value={fields.password}
                    onChange={handleFieldChange}
                />
            </Form.Group>
                <LoaderButton
                    size="lg"
                    type="submit"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                >
                Login
                </LoaderButton>
            </Stack>
        </Form>
        </div>
    );
}