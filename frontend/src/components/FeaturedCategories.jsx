// components/FeaturedCategories.jsx
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardActionArea, 
  CardContent, 
  CardMedia,
  useTheme,
  useMediaQuery,
  Zoom,
  Grow,
  Container
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Example categories with one missing (for demonstration)
const categories = [
  {
    title: 'Furniture',
    image: '/images/furniture.jpg',
    description: 'Stylish pieces for every room'
  },
  {
    title: 'Lighting',
    image: '/images/lighting.jpg',
    description: 'Illuminate your space beautifully'
  },
  {
    title: 'Wall Decor',
    image: '/images/decor.jpg',
    description: 'Transform your walls with art'
  },
  // Intentionally missing one category to demonstrate the layout adjustment
];

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[10],
  },
}));

const GradientOverlay = styled('div')({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: '40%',
  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
});

const FeaturedCategories = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Calculate the appropriate grid item size based on number of categories
  const getGridItemSize = () => {
    const count = categories.length;
    if (count === 0) return 12; // fallback
    if (count === 1) return 12; // full width if only one
    if (count === 2) return 6;  // 2 per row
    if (count === 3) return 4;  // 3 per row
    return 3; // default 4 per row
  };

  const gridItemSize = getGridItemSize();

  return (
    <Box sx={{ 
      py: 8,
      backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
    }}>
      <Container maxWidth="lg">
        <Zoom in={true} style={{ transitionDelay: '100ms' }}>
          <Typography 
            variant="h3" 
            align="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              color: 'text.primary',
              mb: 6,
              position: 'relative',
              '&:after': {
                content: '""',
                display: 'block',
                width: '80px',
                height: '4px',
                background: theme.palette.primary.main,
                margin: '16px auto 0',
                borderRadius: 2
              }
            }}
          >
            Featured Categories
          </Typography>
        </Zoom>

        {categories.length > 0 ? (
          <Grid container spacing={4} justifyContent="center">
            {categories.map((cat, index) => (
              <Grid item xs={12} sm={6} md={gridItemSize} key={index}>
                <Grow in={true} style={{ transitionDelay: `${200 + index * 100}ms` }}>
                  <StyledCard>
                    <CardActionArea>
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="220"
                          image={cat.image}
                          alt={cat.title}
                          sx={{
                            filter: theme.palette.mode === 'dark' ? 'brightness(0.9)' : 'none'
                          }}
                        />
                        <GradientOverlay />
                        <Typography 
                          variant="h6" 
                          sx={{
                            position: 'absolute',
                            bottom: 16,
                            left: 16,
                            color: 'common.white',
                            fontWeight: 'bold'
                          }}
                        >
                          {cat.title}
                        </Typography>
                      </Box>
                      <CardContent sx={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : 'background.paper',
                        '&:last-child': { pb: 2 }
                      }}>
                        <Typography variant="body2" color="text.secondary" align="center">
                          {cat.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </StyledCard>
                </Grow>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" align="center" color="text.secondary">
            No categories available at the moment.
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default FeaturedCategories;