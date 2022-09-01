import PropTypes from 'prop-types';
import { Container, Alert, AlertTitle } from '@material-ui/core';
import { useSelector } from 'react-redux';
// ----------------------------------------------------------------------

RoleBasedGuard.propTypes = {
  accessibleRoles: PropTypes.array, // Example ['admin', 'leader']
  children: PropTypes.node
};

const useCurrentRole = () => {
  // Logic here to get current user role
  const authedUser = useSelector(state=>state.authedUser);
  const {role} = authedUser;
  return role;
};

const useCurrentStatus = () => {
  const authedUser = useSelector(state=>state.authedUser);
  return authedUser.enable;
}

export default function RoleBasedGuard({ accessibleRoles, children }) {
  const currentRole = useCurrentRole();
  const isEnable = useCurrentStatus();

  if (!accessibleRoles.includes(currentRole)) {
    
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>Permission Denied</AlertTitle>
          You do not have permission to access this page
        </Alert>
      </Container>
    );
  }

  if(currentRole === 'ROLE_OWNER' && !isEnable){
    return(
      <Container>
      <Alert severity="warning">
        <AlertTitle>Your Account is Disable</AlertTitle>
        The Tchopify support will contact you else, please contact the support at +237 698 618 200 / +237 676 411 506 / support@tchopify.com to activate your account.
      </Alert>
    </Container>
    )
  }

  return <>{children}</>;
}