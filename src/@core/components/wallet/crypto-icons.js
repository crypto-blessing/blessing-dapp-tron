import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    imageIcon: {
        display: 'flex',
        height: 'inherit',
        width: 'inherit',
        padding: '4px',
    },
    iconRoot: {
        textAlign: 'center'
    }
});

export const TRX_ICON = () => {
    const classes = useStyles();
    
    return (

        <Icon classes={{root: classes.iconRoot}}>
            <img className={classes.imageIcon} src="https://cryptologos.cc/logos/tron-trx-logo.svg?v=023" alt='TRX'/>
        </Icon>

    );
}

export const CBT_ICON = () => {
    const classes = useStyles();
    
    return (

        <Icon classes={{root: classes.iconRoot}}>
            <img className={classes.imageIcon} src="/images/logos/logo.png" alt='CBT'/>
        </Icon>

    );
}