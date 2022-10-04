// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputAdornment from '@mui/material/InputAdornment'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import CardActions from '@mui/material/CardActions'
import Divider from '@mui/material/Divider'
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import IosShareIcon from '@mui/icons-material/IosShare';

import { green } from '@mui/material/colors';

// ** Icons Imports
import {TRON_ICON} from 'src/@core/components/wallet/crypto-icons'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { ethers } from 'ethers';
import {simpleShow, cryptoBlessingAdreess} from 'src/@core/components/wallet/address'
import {encode} from 'src/@core/utils/cypher'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

// Styled Grid component
const StyledGrid = styled(Grid)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  [theme.breakpoints.up('md')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

const BlessingCard2 = (props) => {

  const [open, setOpen] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [claimQuantity, setClaimQuantity] = useState(0);
  const [blessingCaption, setBlessingCaption] = useState('');
  const [claimType, setClaimType] = useState(-1);
  const handleOpen = () => setOpen(true);

  const [alertMsg, setAlertMsg] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);

  const [totalPay, setTotalPay] = useState(0);
  const [sending, setSending] = useState(false);
  const [approving, setApproving] = useState(false);
  const [sendSuccessOpen, setSendSuccessOpen] = useState(false);
  const [blessingKeypairAddress, setBlessingKeypairAddress] = useState('');

  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false)
    setBlessingCaption('')
    setTokenAmount(0)
    setClaimQuantity(0)
    setClaimType(-1)
    setSending(false)
    setApproving(false)
  }

  const handleTokenAmountChange = (event) => {
    setTokenAmount(event.target.value);
    handleBlessingCaption(event.target.value, claimQuantity, claimType)
  }

  const handleClaimQuantityChange = (event) => {
    setClaimQuantity(event.target.value);
    handleBlessingCaption(tokenAmount, event.target.value, claimType)
  }

  const handleClaimTypeChange = (event) => {
    let localClaimType = -1
    switch (event.target.value) {
      case 'AVERAGE':
        localClaimType = 0
        break;
      case 'RANDOM':
        localClaimType = 1
        break;
    }
    setClaimType(localClaimType)
    handleBlessingCaption(tokenAmount, claimQuantity, localClaimType)
  }

  const handleBlessingCaption = (tokenAmount, claimQuantity, claimType) => {
    let payCaption = '', claimCaption = '';
    if (tokenAmount > 0 && claimQuantity > 0) {
      let totalPay = (claimQuantity * props.blessing.trx_price) + parseFloat(tokenAmount)
      setTotalPay(totalPay)
      payCaption = `You will pay ${totalPay.toFixed(2)} TRX. `
    } else {
      payCaption = ''
    }
    if (payCaption !== '') {
      if (claimType > -1) {
        if (claimType === 0) {
          claimCaption = `Your friends will claim ${(tokenAmount / claimQuantity).toFixed(2)}(tax in) TRX and one more NFT. `
        } else if (claimType === 1) {
          claimCaption = `Your friends will claim a random amount and one more NFT.`
        }
      } else {
        claimCaption = ''
      }
    }
    setBlessingCaption(payCaption + claimCaption)
  }

  const checkFormValidate = () => {
    if (tokenAmount <= 0 || parseFloat(totalPay) > parseFloat(props.TRXAmount)) {
      setAlertMsg('You have insufficient TRX balance.')
      setAlertOpen(true);

      return false
    }
    if (claimQuantity <= 0 || claimQuantity > 13) {
      setAlertMsg('You only have up to 13 friends to collect your TRX')
      setAlertOpen(true);

      return false
    }
    if (claimType === -1) {
      setAlertMsg('Pls choose the way your friend will claim your TRX')
      setAlertOpen(true);

      return false
    }

    return true
  }

  async function storeKeys(blessingKeypair, claimKeys) {
    fetch('/api/blessing-sended', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: props.blessing.image,
        blessing: {
          blessing_id: blessingKeypair.address,
          private_key: blessingKeypair.privateKey
        },
        claimKeys: claimKeys
      }),
    }).then(res => {
      console.log(res)
    } ).catch(err => {
      console.log(err)

    })
  }

  async function submitSendBlessing() {
    if (!checkFormValidate()) {
      return
    }
    setSending(true)
    
    // start to send blessing
    try {
      const cbContract = await  window.tronWeb.contract().at(cryptoBlessingAdreess());
      const blessingKeypair = ethers.Wallet.createRandom();
      let pubkeys = []
      let claimKeys = []


      // claim keys gen
      for (let i = 0; i < claimQuantity; i++) {
        const claimKeyPair = ethers.Wallet.createRandom();
        pubkeys.push(claimKeyPair.address)
        claimKeys.push({
          pubkey: claimKeyPair.address,
          private_key: claimKeyPair.privateKey
        })
      }

      await storeKeys(blessingKeypair, claimKeys)


      const result = await cbContract.sendBlessing(props.blessing.image, blessingKeypair.address, 
        window.tronWeb.toSun(tokenAmount), 
        claimQuantity,
        claimType,
        pubkeys
      ).send({
        callValue: window.tronWeb.toSun(totalPay),
        shouldPollResponse: true
      });

      console.log(result)
      setSending(false)
      setBlessingKeypairAddress(blessingKeypair.address)
      localStorage.setItem('my_blessing_claim_key_' + blessingKeypair.address, blessingKeypair.privateKey)
      setOpen(false)
      setSendSuccessOpen(true)
      setLoading(true)
    } catch (e) {
      console.log(e)
      setAlertMsg('Something went wrong. Please contact admin in telegram.')
      setAlertOpen(true);
      setSending(false)
    }
    
  }

  const copyClaimLink = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    provider.getSigner().getAddress().then(async (address) => {
      const privateKey = localStorage.getItem('my_blessing_claim_key_' + blessingKeypairAddress)
      navigator.clipboard.writeText(`[CryptoBlessing] ${props.blessing.title} | ${props.blessing.description}. Claim your TRX & blessing NFT here: https://cryptoblessing.app/claim?sender=${encode(address)}&blessing=${encode(blessingKeypairAddress)}&key=${encode(privateKey)}`)
    })
  }

  const handleSendSuccessClose = () => {
    setSendSuccessOpen(false)
  }



  const handleAlertClose = () => {
    setAlertMsg('')
    setAlertOpen(false)
  }

  return (
    <Card>
      <CardMedia sx={{ height: '13rem' }} image={props.blessing.cdn_path + props.blessing.image} />
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant='caption'>{props.blessing.title}</Typography>
          <Chip size="small" variant="outlined" color="error" label={props.blessing.trx_price} />
        </Box>
      </CardContent>
      {props.account ?
        <Button size="small" onClick={handleOpen} variant='contained' sx={{ py: 2.5, width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
          Send Blessing
        </Button>
      :
        <Button size="small" disabled variant='contained' sx={{ py: 2.5, width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
          Connect Wallet
        </Button>
      }

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Card>
            <CardHeader title='Send Blessing' 
            action={
              <IconButton target='_blank' href={'/send?blessing=' + encode(props.blessing.image)} aria-label="Send This Blessing">
                <IosShareIcon />
              </IconButton>
            }
            titleTypographyProps={{ variant: 'h6' }} />
            <Grid container spacing={6}>
              <StyledGrid item md={5} xs={12}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img width={137} alt='CryptoBlessing' src={props.blessing.cdn_path + props.blessing.image} />
                </CardContent>
              </StyledGrid>
              <Grid
                item
                xs={12}
                md={7}
                sx={{
                  paddingTop: ['0 !important', '0 !important', '1rem !important'],
                  paddingLeft: ['1rem !important', '1rem !important', '0 !important']
                }}
              >
                <CardContent>
                  <Typography variant='h6' sx={{ marginBottom: 2 }}>
                  {props.blessing.title}
                  </Typography>
                  <Typography variant='body2' sx={{ marginBottom: 3.5 }}>
                  {props.blessing.description}
                  </Typography>
                  <Typography sx={{ fontWeight: 500, marginBottom: 3 }}>
                    Designer:{' '}
                    <Box component='span' sx={{ fontWeight: 'bold' }}>
                      {simpleShow(props.blessing.tron_owner)}
                    </Box>
                  </Typography>
                </CardContent>
                <CardActions className='card-action-dense'>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Button startIcon={<AttachMoneyIcon />} variant='outlined' color='error'>{props.blessing.trx_price} TRX</Button>
                  </Box>
                </CardActions>
              </Grid>
            </Grid>
          </Card>
          <Card>
            <CardContent>
              <form onSubmit={e => e.preventDefault()}>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <TextField
                      onChange={handleTokenAmountChange}
                      fullWidth
                      label={'How much TRX do you want to send?(wallet: ' + parseFloat(props.TRXAmount).toFixed(2) + ' TRX)'}
                      placeholder='10'
                      type='number'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <TRON_ICON />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      onChange={handleClaimQuantityChange}
                      fullWidth
                      label={'How many friends are expected to claim?'}
                      placeholder='2'
                      type='number'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <AccountCircleIcon />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl>
                      <FormLabel id="demo-row-radio-buttons-group-label">The way they claim your TRX?</FormLabel>
                      <RadioGroup
                        onChange={handleClaimTypeChange}
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                      >
                        <FormControlLabel value="AVERAGE" control={<Radio />} label="AVERAGE"/>
                        <FormControlLabel value="RANDOM" control={<Radio />} label="RANDOM" />
                      </RadioGroup>
                    </FormControl>
                    
                  </Grid>
                </Grid>
              </form>
              <Typography variant="caption" display="block" gutterBottom color='error'>
                {blessingCaption}
              </Typography>
            </CardContent>
            <Divider sx={{ margin: 0 }} />
            <CardActions
            sx={{
              gap: 5,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
            >
              <Button onClick={handleClose} size='large' color='secondary' variant='outlined'>
                Cancel
              </Button>
              <Box sx={{ m: 1, position: 'relative' }}>
                <Button onClick={submitSendBlessing} disabled={sending} size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
                  {sending ? 'Waiting for send transaction...' : 'Send Blessing'}
                </Button>
                {sending && (
                  <CircularProgress
                    color="secondary"
                    size={24}
                    sx={{
                      color: green[500],
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px',
                    }}
                  />
                )}
              </Box>
              
            </CardActions>
          </Card>
        </Box>
      </Modal>

      <Modal
        open={sendSuccessOpen}
        onClose={handleSendSuccessClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Card>
            <CardMedia sx={{ height: '14.5625rem' }} image='/images/blessings/congrats.webp' />
            <CardContent>
              <Typography variant='h6' sx={{ marginBottom: 2 }}>
                Congratulations!
              </Typography>
              <Typography variant='body2'>
                You have already sended this blessing successfully. Pls copy the claim link and share it with your friends.
              </Typography>
              <Typography variant='caption' color='error'>
                FYI, only use this claim link can claim your blessing!
              </Typography>
            </CardContent>
            <CardActions
              sx={{
                gap: 5,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              >
              <Button onClick={handleSendSuccessClose} size='large' color='secondary' variant='outlined'>
                Cancel
              </Button>
              <Button onClick={copyClaimLink} size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
                Copy Claim Link
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Modal>

      <Snackbar 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={alertOpen} 
        onClose={handleAlertClose}
        autoHideDuration={4000}>
        <Alert onClose={handleAlertClose} severity="error" sx={{ width: '100%', bgcolor: 'white' }}>
          {alertMsg}
          <Link target='_blank' href="https://t.me/crypto_blessing_eng" underline="always">Find admin in telegram</Link>
        </Alert>
      </Snackbar>
    </Card>
  )
}

export default BlessingCard2
