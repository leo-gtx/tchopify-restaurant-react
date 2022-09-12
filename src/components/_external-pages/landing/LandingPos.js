import { useTranslation } from 'react-i18next';
// material
import { styled } from '@material-ui/core/styles';
import { Box, Grid, Container, Typography } from '@material-ui/core';
//
import { MotionInView, varFadeInUp, varFadeInLeft } from '../../animate';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  padding: theme.spacing(30, 0),
  backgroundColor: theme.palette.grey[900]
}));

const ContentStyle = styled('div')(({ theme }) => ({
  textAlign: 'center',
  position: 'relative',
  marginBottom: theme.spacing(10),
  [theme.breakpoints.up('md')]: {
    height: '100%',
    marginBottom: 0,
    textAlign: 'left',
    display: 'inline-flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start'
  }
}));

// ----------------------------------------------------------------------

export default function LandingPos() {
  const {t} = useTranslation();
  return (
    <RootStyle>
      <Container maxWidth="lg" sx={{ position: 'relative'}}>
      <MotionInView variants={varFadeInLeft}>
        <Box
          component="img"
          alt="image shape"
          src="/static/home/bg_pos.jpg"
          sx={{
            top: 0,
            right: 0,
            bottom: 0,
            my: 'auto',
            position: 'absolute',
            filter: 'grayscale(1) opacity(48%)',
            display: { xs: 'none', md: 'block' },
          }}
        
        />
        </MotionInView>

        <Grid container spacing={5} direction="row-reverse" justifyContent="space-between">
          <Grid item xs={12}>
            <ContentStyle>
              <MotionInView variants={varFadeInUp}>
                <Typography component="p" variant="overline" sx={{ mb: 2, color: 'text.disabled', display: 'block' }}>
                  {t('landing.landingPos.title')}
                </Typography>
              </MotionInView>

              <MotionInView variants={varFadeInUp}>
                <Typography variant="h2" sx={{ mb: 3, color: 'common.white' }}>
                {t('landing.landingPos.subtitle')}
                </Typography>
              </MotionInView>

              <MotionInView variants={varFadeInUp}>
                <Typography sx={{ color: 'common.white', mb: 5 }}>
                {t('landing.landingPos.content')}
                </Typography>
              </MotionInView>
            </ContentStyle>
          </Grid>

        </Grid>
      </Container>
    </RootStyle>
  );
}
