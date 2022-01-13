import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import { TextField, Grid, Snackbar, Slide, Button, InputLabel, MenuItem, FormControl } from '@material-ui/core';
import call_api from '../services/request';

import { AiFillDelete } from 'react-icons/ai';
import { GrAdd, GrSubtractCircle, GrAddCircle } from 'react-icons/gr';

import ComfirmDialog from './ComfirmDialog'


const useStyles = makeStyles((theme) => ({
  root: {
    height: "40%",
    paddingTop: '5%',
  },
  div: {
    paddingTop: '2%',
    margin: 'auto',
    width: '40%',
    // height: '80%',
  },
  main: {
    width: '100%',
    height: '80%',

    backgroundColor: theme.palette.background.paper,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
  button: {
    margin: theme.spacing(2),
    width: '90%'
  },
  icon: {
    marginTop: '10%',
    marginRight: '5%',
    marginLeft: '5%',
    cursor: 'pointer',
  },
}));

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function AddHouse() {
  const classes = useStyles();
  let emptyDevice = {
    id: 0,
    name: "",
    quantity: 1
  }
  let constDevices = [
    {
      id: 0,
      name: "",
    },
    {
      id: 1,
      name: "Device 1",
    },
    {
      id: 2,
      name: "Device 2",
    },
    {
      id: 3,
      name: "Device 3",
    },
    {
      id: 4,
      name: "Device 4",
    },
  ]

  const [errorMessage, setErrorMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [messageNotification, setMessageNotification] = useState('')

  const [devices, setDevices] = useState(constDevices)
  const [deviceNows, setDeviceNows] = useState([]);
  const [name, setName] = useState('');

  function handleClose() {
    setOpen(false);
  };

  function handleCloseDialog() {
    setOpenDialog(false);
  };

  function handleChange(event, idx){
    const id = event.target.value;

    if(idx === 0){
      const indexOfLastItem = deviceNows.length - 1;
      if (indexOfLastItem < 0) return;
      const lastItem = deviceNows[indexOfLastItem];
  
      const index = getIndexById(id);
      if (index < 0) return;
      lastItem.id = devices[index].id;
      lastItem.name = devices[index].name;
  
      devices.splice(index, 1);
      const newDevices = [...devices];
      setDevices(newDevices);
  
      deviceNows.pop();
      const newDeviceNows = [...deviceNows];
      newDeviceNows.push(lastItem);
  
      setDeviceNows(newDeviceNows);
    }else{
      const indexNow = getIndexByIdOfCurrentDevices(idx);
      const indexAfter = getIndexById(id);

      if(indexNow < 0 || indexAfter < 0) return;

      const itemNow = deviceNows[indexNow]
      const itemAfter = devices[indexAfter]

      const newDeviceNows = [...deviceNows];
      const newItemNow = {
        id: itemAfter.id,
        name: itemAfter.name,
        quantity: itemNow.quantity,
      }
      newDeviceNows.splice(indexNow, 1, newItemNow)
      console.log("devices now: ", newDeviceNows)
      setDeviceNows(newDeviceNows)

      const newDevices = [...devices];
      const newItemAfter = {
        id: itemNow.id,
        name: itemNow.name,
      }
      newDevices.splice(indexAfter, 1, newItemAfter)
      newDevices.sort((d1, d2) => d1.id - d2.id)     
      console.log("devices: ", newDevices)

      setDevices(newDevices)
    }
  };

  function generateChooseDevices() {
    return deviceNows.map((device) =>
      <MenuItem
        key={device.id}
        value={device.id}
        disabled
      >
        {device.name}
      </MenuItem>
    );
  }

  function generateNotChooseDevices() {
    return devices.map((device) =>
      <MenuItem
        key={device.id}
        value={device.id}
      >
        {device.name}
      </MenuItem>
    )
  }

  function getIndexById(id) {
    for (let i = 0; i < devices.length; i++) {
      if (id === devices[i].id) return i;
    }
    return -1;
  }

  function getIndexByIdOfCurrentDevices(id) {
    for (let i = 0; i < deviceNows.length; i++) {
      if (id === deviceNows[i].id) return i;
    }
    return -1;
  }

  function onClickHandler() {
    if (deviceNows.length === 4) {
      setErrorMessage("Bạn đã chọn hết các thiết bị")
      setOpen(true)
      return
    }

    const lengthDeviceNows = deviceNows.length;
    if (lengthDeviceNows > 0) {
      const lastItem = deviceNows[lengthDeviceNows - 1]
      if (lastItem.id === 0) {
        setErrorMessage("Bạn chưa chọn loại thiết bị")
        setOpen(true)
        return
      }
    }

    const newDeviceNows = [...deviceNows]
    newDeviceNows.push(emptyDevice)
    setDeviceNows(newDeviceNows)
    console.log(deviceNows)
  }

  function iconOnClickHandler(id) {
    const index = getIndexByIdOfCurrentDevices(id);
    if (index < 0) return;

    const resetDevice = {
      id: deviceNows[index].id,
      name: deviceNows[index].name,
    }

    const newDeviceNows = [...deviceNows];
    newDeviceNows.splice(index, 1);
    setDeviceNows(newDeviceNows);

    const newDevices = [...devices];
    newDevices.push(resetDevice);
    newDevices.sort((d1, d2) => d1.id - d2.id)
    setDevices(newDevices);
  }

  function addHomeHandler() {
    if (deviceNows.length === 0) {
      setErrorMessage("Bạn chưa chọn thiết bị trong nhà!")
      setOpen(true)
      return
    }

    if(deviceNows.length === 1 && deviceNows[0].id === 0) {
      setErrorMessage("Bạn chưa chọn thiết bị trong nhà!")
      setOpen(true)
      return
    }

    setOpenDialog(true)
    setMessageNotification("Bạn đồng ý thêm nhà!!!!!")
  }

  async function handleOnConfirm() {
    if (deviceNows[deviceNows.length - 1].id === 0) {
      deviceNows.splice(-1, 1)
    }
    console.log(deviceNows)
    console.log(name)
    const res = await call_api({
      method: 'POST',
      url: '/houses',
      data: {
        name,
        sensors : deviceNows,
      }
    });
    const houses = res.data.data;
    window.location = "/house"

  }

  function quantityDeviceHandler(id, quantity) {
    const index = getIndexByIdOfCurrentDevices(id)
    if (index < 0) return;
    const quantityOfDevice = deviceNows[index].quantity

    if (quantityOfDevice + quantity > 0) {
      const newDeviceNows = [...deviceNows]
      newDeviceNows[index].quantity = quantityOfDevice + quantity
      setDeviceNows(newDeviceNows)
    }
  }

  function generate() {
    return deviceNows.map((device) =>
      <ListItem key={device.id}>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Thiết bị</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={device.id}
            onChange={(event) => handleChange(event, device.id)}
          >
            {generateChooseDevices()}
            {generateNotChooseDevices()}
          </Select>
        </FormControl>
        <form noValidate autoComplete="off">

          <TextField
            id="standard-basic"
            label="Số lượng"
            value={device.quantity}
            style={{ width: '60%' }}
            disabled
          />
          <GrAddCircle
            className={classes.icon}
            size={20}
            onClick={() => quantityDeviceHandler(device.id, 1)}
          />
          <GrSubtractCircle
            className={classes.icon}
            size={20}
            onClick={() => quantityDeviceHandler(device.id, -1)}
          />
        </form>
        <ListItemSecondaryAction onClick={() => iconOnClickHandler(device.id)}>
          <IconButton edge="end" aria-label="delete">
            <AiFillDelete />
          </IconButton>
        </ListItemSecondaryAction>

      </ListItem>
    )
  }

  const handlerName = (e) => {
    setName(e.target.value)
  }


  return (

    <div className="bg-house full-width" style={{ height: '88%' }}>
      <ComfirmDialog />
      <div className={classes.div}>
        <div class={classes.main}>
          <div className="list-sub-header pt-3 pb-3">
            <h4 className="text-center">Thêm nhà</h4>
          </div>
          <div className="ml-5">
            <span><h5 className="mt-4">Tên nhà</h5></span>
          <TextField
            id="standard-basic"
            label="Tên nhà"
            value={name}
            style={{ width: '60%', marginLeft: '5%' }}
            onChange={handlerName}
          />
          </div>
          
          <Grid item>
            <div className={classes.demo}>
              <List style={{ width: '100%' }}>
                {generate()}
              </List>
              <Button
                variant="contained"
                color="default"
                className={classes.button}
                // endIcon={<GrAdd />}
                onClick={onClickHandler}
              >
                Thêm thiết bị
              </Button>
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={addHomeHandler}
              >
                Thêm nhà
              </Button>
            </div>
          </Grid>
        </div>
      </div>
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
      <ComfirmDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleOnConfirm}
        value={messageNotification} />
    </div>

  );
}
