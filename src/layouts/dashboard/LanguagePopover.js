import { useRef, useState } from 'react';
// material
import { alpha } from '@material-ui/core/styles';
import { Box, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core';
// components
import MenuPopover from '../../components/MenuPopover';
import { MIconButton } from '../../components/@material-extend';
// hooks
import useLocales from '../../hooks/useLocales';

// ----------------------------------------------------------------------

export default function LanguagePopover() {
  const anchorRef = useRef(null);
  const { allLang, currentLang, onChangeLang } = useLocales();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeLang = (value)=>{
    onChangeLang(value)
    handleClose()
  }

  return (
    <>
      <MIconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity)
          })
        }}
      >
        <img src={currentLang.icon} alt={currentLang.label} />
      </MIconButton>

      <MenuPopover open={open} onClose={handleClose} anchorEl={anchorRef.current}>
        <Box sx={{ py: 1 }}>
          {allLang.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === currentLang.value}
              onClick={()=>handleChangeLang(option.value)}
              sx={{ py: 1, px: 2.5 }}
            >
              <ListItemIcon>
                <Box component="img" alt={option.label} src={option.icon} />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ variant: 'body2' }}>{option.label}</ListItemText>
            </MenuItem>
          ))}
        </Box>
      </MenuPopover>
    </>
  );
}
