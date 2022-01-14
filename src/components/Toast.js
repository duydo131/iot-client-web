import { Snackbar, Slide } from '@material-ui/core';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actDisableToast } from './../action/index'

function SlideTransition(props) {
	return <Slide {...props} direction="up" />;
}

export default function Toast() {
	const dispatch = useDispatch();
	var toast = useSelector(state => state.toast)

	const [open, setOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const closeToast = () => dispatch(actDisableToast());

	const handleClose = () => {
    setOpen(false)
		closeToast()
  }

	if(toast.enableToast){
		if(!open){
			setErrorMessage(toast.message)
			setOpen(true)
		}
	}else{
		if(open) handleClose()
	}

	return (
		<Snackbar
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			TransitionComponent={SlideTransition}
			open={open}
			autoHideDuration={3000}
			onClose={handleClose}
			message={errorMessage}
		/>
	)
}