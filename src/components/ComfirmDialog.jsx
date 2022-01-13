import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
// import PersonIcon from '@material-ui/icons/Person';
// import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
    dialog : {
        // width: '50%',
        // height: '50%',
        margin: 'auto',
        padding: '30px'
    }
}));


ComfirmDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
};

export default function ComfirmDialog(props) {
    const classes = useStyles();

    const { value, onClose, open, onConfirm } = props;

    const handleClose = () => {
        onClose();
    };

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Dialog 
            onClose={handleClose} aria-labelledby="simple-dialog-title" 
            open={open} 
            className={classes.dialog}
        >

            <DialogTitle 
                id="simple-dialog-title" 
                style={{margin: 'auto'}}
            >
                <h4>{value}</h4>
            </DialogTitle>


            <Button variant="contained" style={{margin:'3%'}} color="secondary" onClick={handleConfirm}>
                Đồng ý
            </Button>
            <Button variant="contained" style={{margin:'3%'}} onClick={handleClose}>Hủy</Button>
        </Dialog>
    );
}