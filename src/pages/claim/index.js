// ** React Imports
import { useEffect, useState } from "react"

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import { styled } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import {TRON_ICON, CBT_ICON} from 'src/@core/components/wallet/crypto-icons'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import CardMedia from '@mui/material/CardMedia'
import CircularProgress from '@mui/material/CircularProgress';
import Badge from '@mui/material/Badge';

import { green } from '@mui/material/colors';

import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import {decode, toEthSignedMessageHash} from 'src/@core/utils/cypher'

import { ethers, utils } from 'ethers'
import {transClaimListFromWalletClaims } from 'src/@core/utils/blessing'
import {getProviderUrl, simpleShow, cryptoBlessingAdreess} from 'src/@core/components/wallet/address'
import {toLocaleDateFromBigInt} from 'src/@core/utils/date'


import {encode} from 'src/@core/utils/cypher'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '40rem' }
}))

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.black,
    backgroundColor: '#ede3ff'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
'&:nth-of-type(odd)': {
  backgroundColor: theme.palette.action.hover
},

// hide last border
'&:last-of-type td, &:last-of-type th': {
  border: 0
}
}))

const ClaimPage = () => {
  const [sender, setSender] = useState('')
  const [blessingID, setBlessingID] = useState('')
  const [blessingIndex, setBlessingIndex] = useState(0)
  const [claimKey, setClaimKey] = useState('')
  const router = useRouter()

  // ** Hook
  useEffect (() => {
    const {sender, blessing, key, blessing_index} = router.query
    console.log('sender', decode(sender))
    console.log('blessing', decode(blessing))
    console.log('key', decode(key))
    setSender(decode(sender))
    setBlessingID(decode(blessing))
    setBlessingIndex(blessing_index)
    if (key) {
      setClaimKey(decode(key))
    }
    if (localStorage.getItem('my_claimed_' + decode(blessing)) === '1' || localStorage.getItem('my_blessing_claim_key_' + decode(blessing)) != undefined) {
      setAlreadyClaimed(true)
    }
    if (blessing) {
      fetch(`/api/items/fetchOneItem?blessing_id=${decode(blessing)}`)
        .then((res) => res.json())
        .then((data) => {
          setBlessingInDB(data)
        })
    }
      
  }, [router.query])
  
  const [account, setAccount] = useState(null)

  const [blessingInDB, setBlessingInDB] = useState({})
  const [blessingSended, setBlessingSended] = useState({})
  const [claimList, setClaimList] = useState([])
  const [claimedAmount, setClaimedAmount] = useState(0)
  const [luckyClaimer, setLuckyClaimer] = useState({})

  const [alertMsg, setAlertMsg] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);

  const [claiming, setClaiming] = useState(false);
  const [claimSuccessOpen, setClaimSuccessOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [revoking, setRevoking] = useState(false)

  const [alreadyClaimed, setAlreadyClaimed] = useState(false)

  const handleClaimSuccessClose = () => {
    setClaimSuccessOpen(false)
  }

  const handleAlertOpen = (msg) => {
    setAlertMsg(msg)
    setAlertOpen(true)
  }

  const handleAlertClose = () => {
    setAlertMsg('')
    setAlertOpen(false)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function featchAllInfoOfBlessing() {
    if (sender != '') {
      const cbContract = await  window.tronWeb.contract().at(cryptoBlessingAdreess());

      try {
        const blessingSended = await cbContract.senderBlessingMapping(sender, blessingIndex).call();
        console.log(blessingSended)
        setBlessingSended(blessingSended)

        let blessingClaimStatusMapping = [];
        for (let i = 0; i < blessingSended.claimQuantity; i++){
            try {
                const claimStatus = await cbContract.blessingClaimStatusMapping(blessingID, i).call();
                if (!claimStatus.used) {
                  blessingClaimStatusMapping.push(claimStatus)
                }
            } catch(e) {
                break
            }
            
        }

        console.log('blessingClaimStatusMapping', blessingClaimStatusMapping)


        const claimResp = transClaimListFromWalletClaims(blessingClaimStatusMapping)

        setClaimList(claimResp.claims)
        setClaimedAmount(claimResp.claimedAmount)
        setLuckyClaimer(claimResp.luckyClaimer)
        setLoading(false);
      } catch (err) {
        console.log("Error: ", err)

        // window.location.replace("/pages/404")
      }
    }
  }

  const revokeBlessing = async () => {
    setRevoking(true)

    const cbContract = await  window.tronWeb.contract().at(cryptoBlessingAdreess());

    try {
      const result = await cbContract.revokeBlessing(
        blessingSended.blessingID
      ).send({
        shouldPollResponse: true
      });

      console.log(result)

      setRevoking(false)
    } catch (e) {
      console.log(e)
      setRevoking(false)
    }

  }

  const copyClaimLink = () => {
    const privateKey = localStorage.getItem('my_blessing_claim_key_' + blessingSended.blessingID)

    navigator.clipboard.writeText(`[CryptoBlessing] ${blessingInDB.title} | ${blessingInDB.description}. Claim your TRX & blessing NFT here: https://tron.cryptoblessing.app/claim?sender=${encode(sender)}&blessing=${encode(blessingSended.blessingID)}&key=${encode(privateKey)}&blessing_index=${blessingIndex}`)
    handleAlertOpen('Claim Link Copied!')
  }

  const claimBlessing = async () => {
    setClaiming(true)

    // start to claim blessing
    const cbContract = await  window.tronWeb.contract().at(cryptoBlessingAdreess());
    
    try {
      // fetch unused private key
      let blessingPubkeyStatusMapping = [];
      for (let i = 0; i < blessingSended.claimQuantity; i++){
          try {
              const claimStatus = await cbContract.blessingPubkeyStatusMapping(blessingID, i).call();
              if (!claimStatus.used) {
                blessingPubkeyStatusMapping.push(claimStatus)
              }
          } catch(e) {
              break
          }
          
      }
      console.log('blessingPubkeyStatusMapping', blessingPubkeyStatusMapping)
      
      const unusedPublickeyRes = await fetch(`/api/blessing-sended/public_key?blessing_id=${blessingSended.blessingID}&private_key=${claimKey}&unusedPrivateKey=${blessingPubkeyStatusMapping[Math.floor(Math.random() * blessingPubkeyStatusMapping.length)].priKey}`)
      const unusedPublicKeyJson = await unusedPublickeyRes.json()
      console.log('unusedPublicKeyJson', unusedPublicKeyJson)


      const result = await cbContract.claimBlessing(
        sender, 
        blessingSended.blessingID, 
        unusedPublicKeyJson.data.pubkey
      ).send({
        feeLimit:10_000_000_000,
        callValue:0,
      });

      console.log(result)

      await featchAllInfoOfBlessing()
      setClaiming(false)
      localStorage.setItem('my_claimed_' + blessingSended.blessingID, 1)
      setClaimSuccessOpen(true)
      setAlreadyClaimed(true)
      setLoading(true);
    } catch (e) {
      console.log(e)
      setAlertMsg('Something went wrong. Please contact admin in telegram.')
      setAlertMsg(e.MESSAGE)
      setAlertOpen(true);
      setClaiming(false)
    }
  }

  const toWalletHandle = () => {
    window.location.replace("/wallet")
  }

  useEffect(() => {
    featchAllInfoOfBlessing()
    setBlessingInDB({
      image: "/images/logo.png",
      description: "Crypto Blessing#Blessing is the most universal human expression of emotion, and we are NFTizing it.",
    })
    setBlessingSended({
      tokenAmount: BigInt(0.1 * 10 ** 18),
      claimQuantity: 0,
      sendTimestamp: BigInt(1656544299),
    })
    setClaimList([])

    var obj = setInterval(async ()=>{
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
          clearInterval(obj)
          setAccount(window.tronWeb.defaultAddress.base58)
      }
    }, 10)
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sender])


  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={6} md={2}>
      </Grid>
      <Grid item xs={12} sm={6} md={8}>
        <Card sx={{ zIndex: 1 }}>
          <CardContent
            sx={{
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              padding: theme => `${theme.spacing(9.75, 5, 9.25)} !important`
            }}
          >
            <Avatar
              sx={{ width: 150, height: 150, marginBottom: 2.25, color: 'common.white', backgroundColor: 'primary.main',
              '-webkit-box-shadow': '0px 0px 20px 0px rgba(146,90,248,0.75)', filter: 'drop-shadow(0px 0px 20px 0px rgba(146,90,248,0.75))', margin: '15px' }}
            >
              <img width={150} alt='CryptoBlessing' src={blessingInDB.cdn_path + blessingInDB.image} />
            </Avatar>
            <Typography variant='h6' sx={{ marginBottom: 2.75 }}>
            {blessingInDB.title}
            </Typography>
            <Typography variant='body2' sx={{ marginBottom: 6 }}>
            {blessingInDB.description}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip variant="outlined" color="error" label={claimedAmount + '/' + (blessingSended && blessingSended.tokenAmount ? window.tronWeb.fromSun(blessingSended.tokenAmount) : 0) + ' TRX'} icon={<TRON_ICON />} />
              <Chip variant="outlined" color="primary" label={claimList.length + '/' + (blessingSended && blessingSended.claimQuantity ? blessingSended?.claimQuantity?.toString() : 0) + ' Blessings'} icon={<AccountCircleIcon />} />
            </Stack>
          </CardContent>
          <Divider sx={{ my: 3 }}>sended at {blessingSended.sendTimestamp ? toLocaleDateFromBigInt(blessingSended.sendTimestamp) : '1970'}  by {sender ? simpleShow(sender) : 'CryptoBlessing'}</Divider>
          
          { !account ? 
            <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Typography  variant="button" display="block" gutterBottom color='error'>
                You need to connect your wallet first!
              </Typography>
            </Box>
            : 
            <CardContent>
            {claimList.length > 0 ?
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 500 }} aria-label='customized table'>
                  <TableHead>
                      <TableRow>
                          <StyledTableCell>Claimer</StyledTableCell>
                          <StyledTableCell>Time</StyledTableCell>
                          <StyledTableCell>Amount</StyledTableCell>
                          <StyledTableCell>CBT Reward</StyledTableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                  {claimList.map(row => (
                    <StyledTableRow key={row.claimer}>
                      <StyledTableCell component='th' scope='row'>
                        {row.claimer === luckyClaimer.claimer ?
                        <Badge badgeContent='lucky' color="primary">
                          {row.claimer}
                        </Badge>
                        :
                        <Typography variant="body2" >{row.claimer}</Typography>
                        }
                        
                      </StyledTableCell>
                      <StyledTableCell>{row.time}</StyledTableCell>
                      <StyledTableCell align='right'>
                        <Stack direction="row" spacing={1}>
                          <Chip variant="outlined" color="warning" label={parseFloat(row.amount).toFixed(2)} icon={<TRON_ICON />} />
                          <Chip
                            avatar={<Avatar alt="CryptoBlessing" src={blessingInDB.cdn_path + blessingInDB.image} />}
                            label="1"
                            variant="outlined"
                          />
                        </Stack>  
                      </StyledTableCell>
                      <StyledTableCell align='right'>
                        <Tooltip disableFocusListener disableTouchListener title="The CBT tokens will reward to the sender of this blessing.">
                          <Chip variant="outlined" color="primary" label={parseFloat(row.CBTokenAwardToSenderAmount).toFixed(2)} icon={<CBT_ICON />} />
                        </Tooltip>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                  </TableBody>
              </Table>
            </TableContainer>
            :
            <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Typography  variant="overline" display="block" gutterBottom>
                There is no one claimed yet!
              </Typography>
            </Box>
            }
            
            {
              claimList.length > 0 && claimList.length == blessingSended.claimQuantity ?
              <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Typography  variant="overline" display="block" gutterBottom>
                  All the blessings have already been claimed!
                </Typography>
              </Box>
            : ''
            }
            
          </CardContent>
          }

          <CardActions
            sx={{
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
            >
            { !account ?
            <Button disabled variant='contained' sx={{ py: 2.5, width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
              Connect Wallet First
            </Button>
            :
            ''
            }
            { account && sender === account && !blessingSended.revoked ?
              <Stack direction="row" spacing={1}>
                <Tooltip title="You can only revoke the amount you sended and need there is no one claimed it yet.">
                  <IconButton>
                    <InfoIcon />
                  </IconButton>
                </Tooltip>

                <Box sx={{ m: 1, position: 'relative' }}>
                  <Button disabled={claimList.length > 0 || revoking} onClick={revokeBlessing} size='large' color='error' variant='outlined'>
                    {revoking ? 'Waiting for revoke transaction...' : 'Revoke'}
                  </Button>
                  {revoking && (
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
                
                <Button disabled={claimList.length > 0 && claimList.length == blessingSended.claimQuantity} onClick={copyClaimLink} size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
                  Copy Claim Link
                </Button>
              </Stack>
            :
            ''
            }

            { account && sender === account && blessingSended.revoked ?
              <Stack direction="row" spacing={1}>
                <Tooltip title="You can only revoke the amount you sended and need there is no one claimed it yet.">
                  <IconButton>
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
                <Button disabled size='large' color='error' variant='outlined'>
                  Revoked
                </Button>
                
                <Button disabled onClick={copyClaimLink} size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
                  Copy Claim Link
                </Button>
              </Stack>
            :
            ''
            }



            { account && sender !== account ?
            <Stack direction="row" spacing={1}>
              <Box sx={{ m: 1, position: 'relative' }}>
                <Button disabled={claiming || claimKey == '' || alreadyClaimed} onClick={claimBlessing} size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
                  {claiming ? 'Waiting for claim transaction...' : 'Claim Blessing'}
                </Button>
                {claiming && (
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
             
            </Stack>
              :
              ''
            }
            
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
      </Grid>

      <Modal
        open={claimSuccessOpen}
        onClose={handleClaimSuccessClose}
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
                Congrats!!! You have already claimed this blessing successfully. 
              </Typography>
              <Typography variant='caption' color='error'>
                You just claimed your TRX and one more NFT, You can check out in your wallet.
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
              <Button onClick={handleClaimSuccessClose} size='large' color='secondary' variant='outlined'>
                Cancel
              </Button>
              <Button onClick={ toWalletHandle } size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
                To My Wallet
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Modal>

      <Snackbar 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={alertOpen} 
        onClose={handleAlertClose}
        autoHideDuration={3000}>
        <Alert onClose={handleAlertClose} severity="error" sx={{ width: '100%', bgcolor: 'white' }}>
          {alertMsg}
        </Alert>
      </Snackbar>
    </Grid>
  )
}


export default ClaimPage
