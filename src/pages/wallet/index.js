// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import { styled } from '@mui/material/styles'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box'
import {TRX_ICON, CBT_ICON} from 'src/@core/components/wallet/crypto-icons'
import BigNumber from 'bignumber.js'
import {amountShow} from 'src/@core/utils/amount'


import { useEffect, useState } from "react"

import { ethers } from 'ethers';
import { useWeb3React } from "@web3-react/core"
import {CBTContractAddress, CBNFTContractAddress} from 'src/@core/components/wallet/address'

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


const Wallet = () => {

    const [TRXAmount, setTRXAmount] = useState(0)
    const [CBTAmount, setCBTAmount] = useState(0)
    const [CBNFTItems, setCBNFTItems] = useState([])

    const CBTContractAddress = 'TCAe2rdd1PBNfiFL5qJcSKk9GSYYfSmeoh'

    async function fetchERC20Amount() {
        var obj = setInterval(async ()=>{
            if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
                clearInterval(obj)

                window.tronWeb.trx.getBalance(window.tronWeb.defaultAddress.base58).then(result => {
                    setTRXAmount(result / 1000000)
                })
        
                const {
                    abi
                } = await window.tronWeb.trx.getContract(CBTContractAddress);
                const contract = window.tronWeb.contract(abi.entrys, CBTContractAddress);
                const balance = await contract.methods.balanceOf(window.tronWeb.defaultAddress.base58).call();
                const balanceStr = balance.toString(10)
                setCBTAmount(balanceStr.substr(0, balanceStr.length - 18))
            }
          }, 10)

       

    }
    
    useEffect(() => {
        fetchERC20Amount()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Grid container spacing={6}>
            <Grid item xs={12} sx={{ paddingBottom: 4 }}>
                <Typography variant='h5'>My Assets</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Card>
                    <CardHeader title='TRC-20 Tokens' titleTypographyProps={{ variant: 'h6' }} />
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 500 }} aria-label='customized table'>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Assets</StyledTableCell>
                                    <StyledTableCell align='right'>Balance</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <StyledTableRow key='TRX'>
                                    <StyledTableCell component='th' scope='row'>
                                        <Chip variant="outlined" icon={<TRX_ICON />} label="TRX" />
                                    </StyledTableCell>
                                    <StyledTableCell align='right'>{TRXAmount}</StyledTableCell>
                                </StyledTableRow>
                                <StyledTableRow key='CBT'>
                                    <StyledTableCell component='th' scope='row'>
                                        <Chip variant="outlined" icon={<CBT_ICON />} label="CBT" />
                                    </StyledTableCell>
                                    <StyledTableCell align='right'>{CBTAmount}</StyledTableCell>
                                </StyledTableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
                <Card>
                    <CardContent>
                        <Typography variant='caption'>You can buy TRX on <Link target='_blank' href='https://www.binance.com'>Binance</Link></Typography>
                    </CardContent>
                </Card>
                
            </Grid>
            <Grid item xs={12} sm={6}>
                <Card>
                    <CardHeader title='TRC-721 Tokens' titleTypographyProps={{ variant: 'h6' }} />
                    <CardContent>
                        { CBNFTItems.length > 0 ?
                        <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
                        {CBNFTItems.map((item, index) => (
                            <ImageListItem key={item + '-' + index}>
                            <img
                                src={`${item}?w=164&h=164&fit=crop&auto=format`}
                                srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                alt={item}
                                loading="lazy"
                            />
                            </ImageListItem>
                        ))}
                        </ImageList>
                        :
                        <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <Typography  variant="overline" display="block" gutterBottom>
                                You don't have claimed any CryptoBlessing NFT yet!
                            </Typography>
                        </Box>
                        }

                    </CardContent>
                    
                </Card>
            </Grid>
        </Grid>
    )
}

export default Wallet
