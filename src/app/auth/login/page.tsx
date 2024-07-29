"use client";

import React, { useState } from "react";
import "./page.css";
import { Button, Box, Typography, TextField } from "@mui/material";
import {FeedBack} from "@/components/FeedBack";
import { useRouter } from "next/navigation";

export default function Page() {
  interface SignInCredentials {
    username: string;
    password: string;
  }

  interface Feedback {
    status: 'error' | 'warning' | 'info' | 'success';
    message: string;
    outlined: boolean;
  }

  const [credentials, setCredentials] = useState<SignInCredentials>({
    username: '',
    password: ''
  });

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loggingIn, setLoggingIn] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setLoggingIn(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (username && password) {
      setCredentials({ username, password });

      setFeedback({
        status: "success",
        message: "Logged in successfully",
        outlined: true
      });

      setTimeout(() => {
        setLoggingIn(false);
        setFeedback(null);
        router.push('/students');
      }, 2000);
    } else {
      setFeedback({
        status: "error",
        message: "Please provide both username and password",
        outlined: true
      });
      setLoggingIn(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
        padding: 3,
      }}
    >
      <Box
        sx={{
          height: "20vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h5">School Management System</Typography>
      </Box>

      <FeedBack 
        outlined={feedback ? feedback.outlined : false} 
        open={feedback != null} 
        message={feedback ? feedback.message : ''} 
        status={feedback ? feedback.status : 'success'} 
      />

      <Box
        sx={{
          width: 300,
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            margin="normal"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
            disabled={loggingIn}
          >
            {loggingIn ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Box>
    </Box>
  );
}
