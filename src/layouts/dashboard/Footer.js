import { Link as ScrollLink } from 'react-scroll';

// material
import { styled } from '@material-ui/core/styles';
import { Link, Divider, Container, Typography, Box } from '@material-ui/core';
//
import Logo from '../../components/Logo';

// ----------------------------------------------------------------------


const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.background.default
}));

// ----------------------------------------------------------------------

export default function Footer() {
  return (
    <RootStyle>
      <Divider />
      <Box
          sx={{
            py: 5,
            textAlign: 'center',
            position: 'relative',
            bgcolor: 'background.default'
          }}
        >
          <Container maxWidth="lg">
            <ScrollLink to="move_top" spy smooth>
              <Logo sx={{ mb: 1, mx: 'auto', cursor: 'pointer' }} />
            </ScrollLink>

            <Typography variant="caption" component="p">
              © All rights reserved <br/>
              <Link href='https://tchopify.com'>tchopify.com</Link>
            </Typography>
          </Container>
        </Box>
    </RootStyle>
  );
}
