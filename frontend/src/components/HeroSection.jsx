// components/HeroSection.jsx
import { Box, Typography, Grid, Button, useTheme } from '@mui/material';
import Slider from 'react-slick';
import { Link } from 'react-scroll';

const carouselImages = [
  'https://source.unsplash.com/800x400/?home,interior',
  'https://source.unsplash.com/800x400/?furniture,livingroom',
  'https://source.unsplash.com/800x400/?homedecor,design',
];

const HeroSection = () => {
  const theme = useTheme();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <Box
      sx={{
        mt: 10,
        py: 6,
        px: 2,
        background: 'linear-gradient(to right, #fff1eb, #ace0f9)',
        borderRadius: 3,
        mb: 6,
      }}
      id="hero-section"
    >
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              color: '#1a237e',
              fontFamily: 'Georgia, serif',
              mb: 2,
            }}
          >
            Welcome to DecorCart
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: '#424242', fontStyle: 'italic', mb: 3 }}
          >
            Discover beautiful products to enhance your home
          </Typography>
          
          <Link 
            to="products-section" 
            smooth={true} 
            duration={500} 
            offset={-70} // Adjust this if you have a fixed header
          >
            <Button
              variant="contained"
              size="large"
              sx={{ 
                backgroundColor: '#3f51b5', 
                color: '#fff', 
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#303f9f',
                }
              }}
            >
              Shop Now
            </Button>
          </Link>
        </Grid>

        <Grid item xs={12} md={6}>
          <Slider {...settings}>
            {carouselImages.map((src, idx) => (
              <Box 
                key={idx} 
                component="img"
                src={src}
                alt={`Slide ${idx}`}
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            ))}
          </Slider>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HeroSection;