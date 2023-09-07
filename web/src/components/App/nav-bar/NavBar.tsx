import React, { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  Menu,
  IconButton,
  MenuItem,
  Tooltip,
  Button,
  Avatar,
} from '@mui/material';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import MenuIcon from '@mui/icons-material/Menu';

import { PageRoutes } from '../../../routes/routes';

const settings = ['Profile', 'Account', 'Logout'];

interface MenuState {
  anchorElNav: HTMLElement | null;
  anchorElUser: HTMLElement | null;
}

interface MenuActions {
  handleOpenNavMenu: (event: MouseEvent<HTMLElement>) => void;
  handleOpenUserMenu: (event: MouseEvent<HTMLElement>) => void;
  handleCloseNavMenu: () => void;
  handleCloseUserMenu: () => void;
  handlePageClick: (page: string) => void;
}

export const useHook = (): [MenuState, MenuActions] => {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handlePageClick = (path: string) => {
    navigate(path);
    handleCloseNavMenu();
  };

  const state: MenuState = { anchorElNav, anchorElUser };
  const actions: MenuActions = {
    handleOpenNavMenu,
    handleOpenUserMenu,
    handleCloseNavMenu,
    handleCloseUserMenu,
    handlePageClick,
  };

  return [state, actions];
};

const NavBar: React.FC = () => {
  const [state, actions] = useHook();

  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          {/* 大螢幕設定，在900px以下消失，900px以上出現 */}
          <DeviceHubIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant='h6'
            noWrap
            component='a'
            href='/'
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Social Pluse Hub
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={actions.handleOpenNavMenu}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={state.anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(state.anchorElNav)}
              onClose={actions.handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {PageRoutes.map((page) => (
                <MenuItem key={page.name} onClick={() => actions.handlePageClick(page.path)}>
                  <Typography textAlign='center'>{page.displayName}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* 小螢幕設定顯示 在 0px以上出現，在900px以上消失 */}
          <DeviceHubIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant='h5'
            noWrap
            component='a'
            href='/'
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Social Pluse Hub
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {PageRoutes.map((page) => (
              <Button
                key={page.name}
                onClick={() => actions.handlePageClick(page.path)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.displayName}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title='Open settings'>
              <IconButton onClick={actions.handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt='Remy Sharp' src='/static/images/avatar/2.jpg' />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id='menu-appbar'
              anchorEl={state.anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(state.anchorElUser)}
              onClose={actions.handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={actions.handleCloseUserMenu}>
                  <Typography textAlign='center'>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
