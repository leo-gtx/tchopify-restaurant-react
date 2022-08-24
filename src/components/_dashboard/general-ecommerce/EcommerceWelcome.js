import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
// material
import { styled } from '@material-ui/core/styles';
import { Typography, Button, Card, CardContent } from '@material-ui/core';
//
import { MotivationIllustration } from '../../../assets';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  backgroundColor: theme.palette.primary.lighter,
  [theme.breakpoints.up('md')]: {
    height: '100%',
    display: 'flex',
    textAlign: 'left',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
}));

// ----------------------------------------------------------------------

export default function EcommerceWelcome() {
  const { t } = useTranslation();
  const {fullname} = useSelector((state)=>state.authedUser);
  return (
    <RootStyle>
      <CardContent
        sx={{
          color: 'grey.800',
          p: { md: 0 },
          pl: { md: 5 }
        }}
      >
        <Typography gutterBottom variant="h4">
          {t('dashboard.greating')} {fullname}!
        </Typography>

        <Typography variant="body2" sx={{ pb: { xs: 3, xl: 5 }, maxWidth: 480, mx: 'auto' }}>
          {t('dashboard.ads')}
        </Typography>

        <Button variant="contained">{t('actions.goNow')}</Button>
      </CardContent>

      <MotivationIllustration
        sx={{
          p: 3,
          width: 360,
          margin: { xs: 'auto', md: 'inherit' }
        }}
      />
    </RootStyle>
  );
}
