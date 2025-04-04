import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import axios from 'axios';

const TestPage = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(`/api/tests/${id}/`, {
          headers: {
            'X-Telegram-User-ID': user.id,
          },
        });
        setTest(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load test');
        setLoading(false);
      }
    };

    if (user) {
      fetchTest();
    }
  }, [id, user]);

  const handleAnswerChange = (questionId, answerId) => {
    setAnswers({
      ...answers,
      [questionId]: answerId,
    });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`/api/tests/${id}/submit/`, {
        answers: Object.entries(answers).map(([questionId, answerId]) => ({
          question_id: questionId,
          answer_id: answerId,
        })),
      }, {
        headers: {
          'X-Telegram-User-ID': user.id,
        },
      });

      setResult(response.data);
      setSubmitted(true);

      // Send test result to Telegram
      window.Telegram.WebApp.sendData(JSON.stringify({
        type: 'test_completed',
        test_id: id,
        user_id: user.id,
        score: response.data.score,
        passed: response.data.passed,
      }));

      // Navigate back to course detail page after a delay
      setTimeout(() => {
        navigate(`/course/${response.data.course_id}`);
      }, 3000);
    } catch (err) {
      setError('Failed to submit test');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="error">{error}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.Telegram.WebApp.close()}
          sx={{ mt: 2 }}
        >
          Close
        </Button>
      </Box>
    );
  }

  if (submitted) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h4" gutterBottom>
          Test Results
        </Typography>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Score: {result.score}%
            </Typography>
            <Typography
              variant="h6"
              color={result.passed ? 'success.main' : 'error.main'}
            >
              {result.passed ? 'Passed' : 'Failed'}
            </Typography>
          </CardContent>
        </Card>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.Telegram.WebApp.close()}
        >
          Close
        </Button>
      </Box>
    );
  }

  const currentQuestion = test.questions[activeStep];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {test.title}
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {test.questions.map((question, index) => (
          <Step key={question.id}>
            <StepLabel>{index + 1}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Question {activeStep + 1} of {test.questions.length}
          </Typography>
          <Typography variant="body1" paragraph>
            {currentQuestion.text}
          </Typography>

          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <RadioGroup
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            >
              {currentQuestion.answers.map((answer) => (
                <FormControlLabel
                  key={answer.id}
                  value={answer.id}
                  control={<Radio />}
                  label={answer.text}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        {activeStep === test.questions.length - 1 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!answers[currentQuestion.id]}
          >
            Submit
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={!answers[currentQuestion.id]}
          >
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default TestPage; 