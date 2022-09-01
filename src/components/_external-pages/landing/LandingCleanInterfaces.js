import { useTranslation } from 'react-i18next';
// material
import { alpha, styled } from '@material-ui/core/styles';
import { Box, Container, Typography, useTheme } from '@material-ui/core';
//
import { varFadeInUp, MotionInView } from '../../animate';
import Map from './Map';

// ----------------------------------------------------------------------


const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 520,
  margin: 'auto',
  textAlign: 'center',
  [theme.breakpoints.up('md')]: {
    zIndex: 11,
    textAlign: 'left',
    position: 'absolute'
  }
}));

// ----------------------------------------------------------------------

export default function LandingCleanInterfaces() {
  const theme = useTheme();
  const {t} = useTranslation();
  const isLight = theme.palette.mode === 'light';
  const center = { lat: 7.3696495, lng: 12.3445856 };
  const coords = [
    { lat: 4.061536, lng: 9.786072, title: 'Douala' },
    { lat: 3.844119, lng: 11.501346, title: 'Soon' },
    { lat: 5.480752, lng: 10.428418, title: 'Soon'}
  ];
  return (
    <RootStyle>
      <Container maxWidth="lg">
        <ContentStyle>
          <MotionInView variants={varFadeInUp}>
            <Typography component="p" variant="overline" sx={{ mb: 2, color: 'text.secondary' }}>
              {t('landing.landingCleanInterfaces.title')}
            </Typography>
          </MotionInView>

          <MotionInView variants={varFadeInUp}>
            <Typography
              variant="h2"
              paragraph
              sx={{
                ...(!isLight && {
                  textShadow: (theme) => `4px 4px 16px ${alpha(theme.palette.grey[800], 0.48)}`
                })
              }}
            >
              {t('landing.landingCleanInterfaces.subtitle')}
            </Typography>
          </MotionInView>
        </ContentStyle>
        <Box sx={{ paddingTop: 15 }}>
            <MotionInView
              variants={varFadeInUp}
              
            >
              <Map center={center} coords={coords} />
            </MotionInView>
        </Box>
      </Container>
    </RootStyle>
  );
}
