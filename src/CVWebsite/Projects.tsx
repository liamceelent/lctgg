import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Portfolio Website",
    description: "A modern portfolio website built with React and TypeScript.",
    imageUrl: "https://via.placeholder.com/600x300?text=Portfolio+Website",
    link: "/",
  },
  {
    id: 2,
    title: "Petition website",
    description: "Full stack petiton website.",
    imageUrl: "https://via.placeholder.com/600x300?text=E-commerce+App",
    link: "/petitions",
  },
  {
    id: 3,
    title: "Task Manager",
    description: "A task management tool for organizing and tracking daily tasks.",
    imageUrl: "https://via.placeholder.com/600x300?text=Task+Manager",
    link: "/taskManager",
  },
];

const Projects: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Projects
      </Typography>
      <Grid container spacing={4} direction="column">
        {projects.map((project) => (
          <Grid item key={project.id}>
            <Card sx={{ maxWidth: "100%", margin: "auto" }}>
              <CardMedia
                component="img"
                height="300"
                image={project.imageUrl}
                alt={project.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {project.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.description}
                </Typography>
                <Box sx={{ marginTop: 2, textAlign: "center" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleNavigation(project.link)}
                  >
                    View Project
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Projects;
