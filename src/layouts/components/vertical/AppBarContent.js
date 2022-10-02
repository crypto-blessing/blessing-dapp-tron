// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import Twitter from 'mdi-material-ui/Twitter'
import Telegram from '@mui/icons-material/Telegram';
import Menu2 from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


import {injected} from 'src/@core/components/wallet/connector'
import {simpleShow, chainName} from 'src/@core/components/wallet/address'
import { useWeb3React } from "@web3-react/core"

import { useEffect, useState } from "react"

// ** Icons Imports
import Menu from 'mdi-material-ui/Menu'
import Magnify from 'mdi-material-ui/Magnify'

import LogoutIcon from '@mui/icons-material/Logout';

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';



const AppBarContent = props => {

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNEARClose = () => {
    setAnchorEl(null);
    window.open("https://near.cryptoblessing.app/","_blank");
  }

  const handleSolanaClose = () => {
    setAnchorEl(null);
    window.open("https://solana.cryptoblessing.app/","_blank");
  }

  const { active, account, library, connector, activate, deactivate, chainId } = useWeb3React()

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('')
  const [alertMessage, setAlertMessage] = useState('')

  async function connect() {
    try {
      injected.isAuthorized().then((isAuthorized) => {
        if (isAuthorized) {
          activate(injected, undefined, true).catch((e) => {
            setOpen(true);
          });
        } else {
          console.log("not authorized")
        }
      });
      localStorage.setItem('isWalletConnected', true)
    } catch (ex) {
      console.log(ex)
    }
  }

  async function disconnect() {
    try {
      await deactivate()
      localStorage.setItem('isWalletConnected', false)
    } catch (ex) {
      console.log(ex)
    }
  }

  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props

  // ** Hook
  const hiddenSm = useMediaQuery(theme => theme.breakpoints.down('sm'))
  

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem('isWalletConnected') === 'true') {
        try {
          await activate(injected)
          localStorage.setItem('isWalletConnected', true)
        } catch (ex) {
          console.log(ex)
        }
      } else {
        console.log("not connected")
      }
    }
    connectWalletOnPageLoad()
  }, [activate, account, props])

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  }

  useEffect(() => {
    
    const loadBeforeOp = async () => {
      switch (chainId) {
        case 56:
          setAlertTitle('System maintenance in progress')
          setAlertMessage('CryptoBlessing is being upgraded and maintained, please be patient for a more secure contract and a better experience.')
          break;
        case 97:
          setAlertTitle('BSC Testnet')
          setAlertMessage('You are now on BSC Testnet.')
          break;
        case 1337:
          setAlertTitle('Localnet')
          setAlertMessage('You are now on Localnet.')
          break;
        default:
          setAlertTitle('Don\'t support this network')
          setAlertMessage('Please switch your network to BSC Mainnet(chainID: 56).')
      }
      if (chainId != 56 && // ** BSC Mainnet maintenance
        chainId != 97 && chainId != 1337 && chainId != undefined) {
          setAlertOpen(true)
      }
      fetch('/api/security/block')
          .then((res) => res.json())
          .then((data) => {
            if (data.block) {
              setAlertTitle("Security Detected")
              setAlertMessage("Service is not available in your area, please leave.💗💗💗")
              setAlertOpen(true)
            }
          })
      
    }

    loadBeforeOp()
  }, [chainId])

  return (

    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden ? (
          <IconButton
            color='inherit'
            onClick={toggleNavVisibility}
            sx={{ ml: -2.75, ...(hiddenSm ? {} : { mr: 3.5 }) }}
          >
            <Menu />
          </IconButton>
        ) : null}
        {/* <TextField
          size='small'
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Magnify fontSize='small' />
              </InputAdornment>
            )
          }}
        /> */}
        <div>
          <Button
            id="basic-button"
            onClick={handleClick}
            aria-controls={menuOpen ? 'demo-customized-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? 'true' : undefined}
            variant="contained"
            disableElevation
            endIcon={<KeyboardArrowDownIcon />}
          >
            Other Chains
          </Button>
          <Menu2
            id="basic-menu"
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={handleNEARClose}>NEAR Chain</MenuItem>
            <MenuItem onClick={handleSolanaClose}>Solana Chain</MenuItem>
          </Menu2>
        </div>
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>

        {active ? 
        <ButtonGroup variant="contained" aria-label="outlined primary button group">
          <Button variant="outlined">{chainName(chainId)}</Button>
          <Button>{simpleShow(account)}</Button>
          <IconButton onClick={disconnect} color="primary" aria-label="add to shopping cart">
            <LogoutIcon />
          </IconButton>
        </ButtonGroup>  
        : 
        <Button onClick={connect} size='large' variant='outlined'>
          Connect Wallet
        </Button>
        }
        <Box sx={{ ml: 2 }} />
        <ModeToggler settings={settings} saveSettings={saveSettings} />
      </Box>
      <Snackbar 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open} 
        onClose={handleClose}
        autoHideDuration={4000}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%', bgcolor: 'white' }}>
          Only support BSC network!
        </Alert>
      </Snackbar>

      {/** System maintenance in progress */}

      <Dialog
        open={alertOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {alertTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          {alertMessage}
          </DialogContentText>
          <Divider />
          <DialogContentText id="alert-dialog-description" align='right'>
            Follow us on: 
            <Link target='_blank' href='https://twitter.com/cryptoblessing4'>
              <IconButton>
                <Twitter sx={{ color: '#1da1f2' }} />
              </IconButton>
            </Link>
            <Link target='_blank' href='https://t.me/crypto_blessing_eng'>
              <IconButton>
                <Telegram sx={{ color: '#1da1f2' }} />
              </IconButton>
            </Link>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      {/** System maintenance in progress */}
    </Box>
  )
}

export default AppBarContent
