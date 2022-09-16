import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import checkmarkFill from '@iconify/icons-eva/checkmark-fill';
import chevronRightFill from '@iconify/icons-eva/chevron-right-fill';
import {useTranslation } from 'react-i18next';
// material
import { useTheme, styled, alpha } from '@material-ui/core/styles';
import { Box, Grid, Card, Link, Stack, Button, Divider, Container, Typography } from '@material-ui/core';
//
import { varFadeIn, varFadeInUp, MotionInView, varFadeInDown } from '../../animate';
import IconFree from '../../../assets/icon_plan_free';
import IconPlus from '../../../assets/icon_plan_starter';
import IconExtended from '../../../assets/icon_plan_premium';
import { PATH_AUTH } from '../../../routes/paths';

// ----------------------------------------------------------------------

const LICENSES = [
  {
    license: 'pricing.solution1.title',
    price: 'pricing.price.1',
    icon: ()=> <IconFree/>,
    commons: [
      'pricing.solution1.specs.1',
      'pricing.solution1.specs.2', 
      'pricing.solution1.specs.3',
      'pricing.solution1.specs.4',
      'pricing.solution1.specs.5',
    ], 
    options : [
      'pricing.solution1.specs.6',
    ]
  },
  {
    license: 'pricing.solution2.title',
    price: 'pricing.price.2',
    icon: ()=><IconPlus/>,
    commons: [
      
    ], 
    options : [
      'pricing.solution2.specs.1',
      'pricing.solution2.specs.2', 
      'pricing.solution2.specs.3',
      'pricing.solution2.specs.4',
    ]
  },
  {
    license: 'pricing.solution3.title',
    price: 'pricing.price.3',
    icon: ()=><IconExtended/>,
    commons: [
     
    ], 
    options : [
      'pricing.solution3.specs.1',
      'pricing.solution3.specs.2', 
      'pricing.solution3.specs.3',
      'pricing.solution3.specs.4',
      
    ]
  }
  ];

const PLANS = [...Array(3)].map((_, index) => ({
  license: LICENSES[index].license,
  price: LICENSES[index].price,
  icon: LICENSES[index].icon,
  commons: LICENSES[index].commons,
  options: LICENSES[index].options,
}));

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(15),
  [theme.breakpoints.up('md')]: {
    paddingBottom: theme.spacing(15)
  }
}));

// ----------------------------------------------------------------------

PlanCard.propTypes = {
  cardIndex: PropTypes.number,
  plan: PropTypes.shape({
    license: PropTypes.any,
    commons: PropTypes.arrayOf(PropTypes.string),
    icons: PropTypes.arrayOf(PropTypes.string),
    options: PropTypes.arrayOf(PropTypes.string)
  })
};

function PlanCard({ plan, cardIndex }) {
  const theme = useTheme();
  const {t} = useTranslation();
  const { license, price, commons, options, icon } = plan;

  const isLight = theme.palette.mode === 'light';

  return (
    <Card
      sx={{
        p: 5,
        boxShadow: (theme) =>
          `0px 48px 80px ${alpha(isLight ? theme.palette.grey[500] : theme.palette.common.black, 0.12)}`,
        ...(cardIndex === 1 && {
          boxShadow: (theme) =>
            `0px 48px 80px ${alpha(isLight ? theme.palette.grey[500] : theme.palette.common.black, 0.48)}`
        })
      }}
    >
      <Stack spacing={5}>
        <div>
          <Typography variant="overline" sx={{ mb: 2, color: 'text.disabled', display: 'block' }}>
            {t(license)}
          </Typography>
          {icon()}
          <Typography variant="h4">{t(price)}</Typography>
        </div>

        <Stack spacing={2.5}>
          {commons.map((option) => (
            <Stack key={option} spacing={1.5} direction="row" alignItems="center">
              <Box component={Icon} icon={checkmarkFill} sx={{ color: 'primary.main', width: 20, height: 20 }} />
              <Typography variant="body2">{t(option)}</Typography>
            </Stack>
          ))}

          <Divider sx={{ borderStyle: 'dashed' }} />

          {options.map((option, optionIndex) =>
            (
              <Stack
                spacing={1.5}
                direction="row"
                alignItems="center"
                sx={{
                   color: 'text.disabled'
                }}
                key={option}
              >
                <Box
                  component={Icon}
                  icon={checkmarkFill}
                  sx={{
                    width: 20,
                    height: 20,
                    color: 'text.disabled'
                  }}
                />
                <Typography variant="body2">{t(option)}</Typography>
              </Stack>
            )
          )}
        </Stack>

        <Stack direction="row" justifyContent="flex-end">
          <Link
            color="text.secondary"
            underline="always"
            target="_blank"
            href="#"
            sx={{
              typography: 'body2',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Learn more <Icon icon={chevronRightFill} width={20} height={20} />
          </Link>
        </Stack>

        <Button
          size="large"
          fullWidth
          variant={cardIndex === 1 ? 'contained' : 'outlined'}
          href={PATH_AUTH.register}
        >
          {t('actions.getStarted')}
        </Button>
      </Stack>
    </Card>
  );
}

export default function LandingPricingPlans() {
  const {t} = useTranslation();
  return (
    <RootStyle>
      <Container maxWidth="lg">
        <Box sx={{ mb: 10, textAlign: 'center' }}>
          <MotionInView variants={varFadeInUp}>
            <Typography component="p" variant="overline" sx={{ mb: 2, color: 'text.secondary' }}>
              {t('pricing.heading')}
            </Typography>
          </MotionInView>
          <MotionInView variants={varFadeInDown}>
            <Typography variant="h2" sx={{ mb: 3 }}>
              {t('pricing.title')}
            </Typography>
          </MotionInView>
          <MotionInView variants={varFadeInDown}>
            <Typography
              sx={{
                color: (theme) => (theme.palette.mode === 'light' ? 'text.secondary' : 'text.primary')
              }}
            >
              {t('pricing.subtitle')}
            </Typography>
          </MotionInView>
        </Box>

        <Grid container spacing={5}>
          {PLANS.map((plan, index) => (
            <Grid key={plan.license} item xs={12} md={4}>
              <MotionInView variants={index === 1 ? varFadeInDown : varFadeInUp}>
                <PlanCard plan={plan} cardIndex={index} />
              </MotionInView>
            </Grid>
          ))}
        </Grid>

        <MotionInView variants={varFadeIn}>
          <Box sx={{ p: 5, mt: 10, textAlign: 'center' }}>
            <MotionInView variants={varFadeInDown}>
              <Typography variant="h3">{t('pricing.contact.title')}</Typography>
            </MotionInView>

            <MotionInView variants={varFadeInDown}>
              <Typography sx={{ mt: 3, mb: 5, color: 'text.secondary' }}>
                {t('pricing.contact.subtitle')}
              </Typography>
            </MotionInView>

            <MotionInView variants={varFadeInUp}>
              <Button
                size="large"
                variant="contained"
                href="mailto:support@tchopify.com?subject=[Feedback] from Customer"
              >
                {t('actions.contactUs')}
              </Button>
            </MotionInView>
          </Box>
        </MotionInView>
      </Container>
    </RootStyle>
  );
}
