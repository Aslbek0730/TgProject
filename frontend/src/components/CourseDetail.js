import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  CircularProgress,
  Box,
  Chip,
} from '@mui/material';
import axios from 'axios';

const CourseDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProgress, setUserProgress] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch course and user progress in parallel
        const [courseResponse, progressResponse] = await Promise.all([
          axios.get(`/api/courses/${id}/`, {
            headers: {
              'X-Telegram-User-ID': user.id,
            },
          }),
          axios.get(`/api/progress/?course=${id}`, {
            headers: {
              'X-Telegram-User-ID': user.id,
            },
          }),
        ]);

        setCourse(courseResponse.data);
        setLessons(courseResponse.data.lessons);
        setUserProgress(progressResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load course data');
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [id, user]);

  const handleLessonClick = (lessonId) => {
    if (course.is_paid && (!userProgress || !userProgress.has_paid)) {
      navigate(`/payment/${id}`);
    } else {
      navigate(`/lesson/${lessonId}`);
    }
  };

  const handleTestClick = (testId) => {
    if (course.is_paid && (!userProgress || !userProgress.has_paid)) {
      navigate(`/payment/${id}`);
    } else {
      navigate(`/test/${testId}`);
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

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {course.title}
      </Typography>
      <Typography variant="body1" paragraph>
        {course.description}
      </Typography>
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <Typography variant="h6" color="primary">
          ${course.price}
        </Typography>
        <Chip
          label={course.is_paid ? 'Paid' : 'Free'}
          color={course.is_paid ? 'primary' : 'success'}
        />
      </Box>

      {course.is_paid && (!userProgress || !userProgress.has_paid) && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/payment/${id}`)}
          sx={{ mb: 4 }}
        >
          Purchase Course
        </Button>
      )}

      <Typography variant="h5" gutterBottom>
        Lessons
      </Typography>
      <List>
        {lessons.map((lesson) => (
          <React.Fragment key={lesson.id}>
            <ListItemButton onClick={() => handleLessonClick(lesson.id)}>
              <ListItemText
                primary={lesson.title}
                secondary={lesson.description}
              />
            </ListItemButton>
            <Divider />
          </React.Fragment>
        ))}
      </List>

      {course.test && (
        <>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Final Test
          </Typography>
          <List>
            <ListItemButton onClick={() => handleTestClick(course.test.id)}>
              <ListItemText
                primary={course.test.title}
                secondary="Complete this test to finish the course"
              />
            </ListItemButton>
          </List>
        </>
      )}
    </Container>
  );
};

export default CourseDetail; 