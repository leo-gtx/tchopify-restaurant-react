import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import chevronUpFill from '@iconify/icons-eva/chevron-up-fill';
import chevronDownFill from '@iconify/icons-eva/chevron-down-fill';
// material
import { Menu, Button, MenuItem, Typography } from '@material-ui/core';

// ----------------------------------------------------------------------


ShopProductSort.propTypes = {
  options: PropTypes.array.isRequired,
  onSelectOption: PropTypes.func,
  currentOption: PropTypes.string
};

export default function ShopProductSort({options, onSelectOption, currentOption}) {
  const [open, setOpen] = useState(null);
  const [sortBy, setSortBy] = useState(currentOption);
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleSortBy = (value) => {
    handleClose();
    setSortBy(value);
    onSelectOption(value);
  };

  return (
    <>
      <Button
        color="inherit"
        disableRipple
        onClick={handleOpen}
        endIcon={<Icon icon={open ? chevronUpFill : chevronDownFill} />}
      >
        Sort By:&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {sortBy}
        </Typography>
      </Button>
      <Menu
        keepMounted
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.id}
            selected={option.name === sortBy}
            onClick={() => handleSortBy(option.name)}
            sx={{ typography: 'body2' }}
          >
            {option.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
