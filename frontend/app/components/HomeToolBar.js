'use client'
import Link from 'next/link';
import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation'
import {AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PeerContext from '@/app/components/PeerContext';

const pages = ['Home', 'Torrents', 'Seeds', 'Search'];
const settings = ['Dashboard', 'Login'];

const stringToColor = (string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

const stringAvatar = (name) => {
  const names = name.split(' ');
  const initial = names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}` : `${names[0][0]}${names[0][1]}`;
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: initial,
  };
}

export default function HomeToolBar() {
  const { userId } = useContext(PeerContext);
  const [account, setAccount] = useState(userId);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const router = useRouter();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (pages=null) => () => {
    if (pages) router.push(`/${pages}`);
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (settings=null) => () => {
    if (settings) router.push(`/${settings}`);
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{backgroundColor: "#94A684"}}>
      <Container maxWidth="xl" sx={{backgroundColor: "#94A684"}}>
        <Toolbar disableGutters sx={{backgroundColor: "#94A684"}}>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu()}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu(page)}>
                  <Typography textAlign="center"><Link href={`/${page}`}>{page}</Link></Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
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
            wTorrent
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu(page)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                <Link href={`/${page}`}>{page}</Link>
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {account && (
                  <Avatar {...stringAvatar(account)} />
                )}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu()}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu(setting)}>
                  <Typography textAlign="center">
                    <Link href={`/${setting}`}>{setting}</Link>
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
