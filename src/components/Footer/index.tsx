import React from 'react';
import { Box, Container, Typography, IconButton, Link as MuiLink } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import ArticleIcon from '@mui/icons-material/Article'; // For Medium

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 3,
        px: 2,
        backgroundColor: 'var(--darkBackground)',
        textAlign: 'center',
      }}
    >
      <Container maxWidth="md">
        <Box display="flex" justifyContent="center" gap={2} mb={1}>
          <IconButton
            component={MuiLink}
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            color="inherit"
          >
            <LinkedInIcon />
          </IconButton>
          <IconButton
            component={MuiLink}
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            color="inherit"
          >
            <YouTubeIcon />
          </IconButton>
          <IconButton
            component={MuiLink}
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            color="inherit"
          >
            <FacebookIcon />
          </IconButton>
          <IconButton
            component={MuiLink}
            href="https://medium.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Medium"
            color="inherit"
          >
            <ArticleIcon />
          </IconButton>
          <IconButton
            component={MuiLink}
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            color="inherit"
          >
            <TwitterIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="textSecondary">
          © {new Date().getFullYear()} MyApp. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};
