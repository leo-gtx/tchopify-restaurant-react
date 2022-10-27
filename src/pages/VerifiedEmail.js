import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
// material
import { styled } from '@material-ui/core/styles';
import { Box, Typography, Container, Link } from '@material-ui/core';
// components
import { MotionContainer, varBounceIn } from '../components/animate';
import Page from '../components/Page';
import { SentIcon } from '../assets';
// Actions
import { handleSendVerificationEmail, logout } from '../redux/actions/authedUser';



// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));

// ----------------------------------------------------------------------

export default function EmailVerified() {
  const {t} = useTranslation();
  const [isSend, setSend] = useState(false)
  const dispatch = useDispatch();
  const handleClick = (e)=>{
    e.preventDefault()
    handleSendVerificationEmail(()=>setSend(true))
  }
  const handleLogout = ()=> dispatch(logout());
  return (
    <RootStyle title="Verified Email | Tchopify">
      <Container>
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <motion.div variants={varBounceIn}>
              <Typography variant="h3" paragraph>
                {t('verifiedEmail.title')}
              </Typography>
            </motion.div>
            <Typography sx={{ color: 'text.secondary' }}>
            {t('verifiedEmail.subtitle')}
            </Typography>

            <motion.div variants={varBounceIn}>
              <SentIcon sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
            </motion.div>
              <Box style={{flexDirection: 'column'}}>
                <Typography variant="body2" align="center">
                {t('verifiedEmail.noEmail')} &nbsp;
                  <Link variant="subtitle2" underline="none" style={{cursor: 'pointer'}}  onClick={!isSend && handleClick}>
                    {isSend? t('actions.mailSent'):t('actions.resendEmail')}
                  </Link>
                </Typography>
              </Box>
              <Box style={{flexDirection: 'column'}}>
                <Typography variant="body2" align="center" color="initial">
                  <Link variant="subtitle2" underline="none" style={{cursor: 'pointer'}}  onClick={handleLogout}>
                    {t('actions.login')}
                  </Link>
                </Typography>
              </Box>
          </Box>
        </MotionContainer>
      </Container>
    </RootStyle>
  );
}
