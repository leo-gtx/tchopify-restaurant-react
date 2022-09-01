// material
import { styled } from '@material-ui/core/styles';
//
import { useTranslation } from 'react-i18next';
// components
import Page from '../components/Page';
import {
  LandingHero,
  LandingMinimal,
  LandingDarkMode,
  LandingAdvertisement,
  LandingCleanInterfaces,
  LandingHugePackElements,
  LandingPos,
  LandingThemeColor
} from '../components/_external-pages/landing';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)({
  height: '100%'
});

const ContentStyle = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.default
}));

// ----------------------------------------------------------------------

export default function LandingPage() {
  const {t} = useTranslation();
  return (
    <RootStyle title={t('landing.title')} id="move_top">
      <LandingHero />
      <ContentStyle>
        <LandingMinimal />
        {/* <LandingPos/> */}
        <LandingHugePackElements />
        <LandingDarkMode />
        <LandingCleanInterfaces />
        <LandingAdvertisement />
      </ContentStyle>
    </RootStyle>
  );
}
