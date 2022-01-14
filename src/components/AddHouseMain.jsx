import React, { useState, useEffect } from 'react';
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
import {useHistory} from 'react-router-dom'
import ComfirmDialog from './ComfirmDialog'
import { actEnableToast } from './../action/index'
import { useDispatch } from 'react-redux';


const useStyles = makeStyles((theme) => ({
  root: {
    height: "40%",
    paddingTop: '5%',
  },
  div: {
    paddingTop: '2%',
    margin: 'auto',
    width: '40%',
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
    margin: theme.spacing(1),
    marginLeft : '5%',
    width: '90%',
  },
  icon: {
    marginTop: '10%',
    marginRight: '5%',
    marginLeft: '5%',
    cursor: 'pointer',
  },
}));

export default function AddHouse() {
  let history = useHistory()
  const dispatch = useDispatch();
  const toast = (message) => dispatch(actEnableToast(message));

  const classes = useStyles();
  let emptyDevice = {
    id: 0,
    name: "",
    quantity: 1,
    isMulti: true,
  }
  // const constDevices = [
  //   {
  //     id: 0,
  //     name: "",
  //     isMulti: true,
  //   },
  //   {
  //     id: 1,
  //     name: "Device 1",
  //     isMulti: true,
  //   },
  //   {
  //     id: 2,
  //     name: "Device 2",
  //     isMulti: true,
  //   },
  //   {
  //     id: 3,
  //     name: "Device 3",
  //     isMulti: false,
  //   },
  //   {
  //     id: 4,
  //     name: "Device 4",
  //     isMulti: false,
  //   },
  // ]

  const [constDevices, setConstDevices] = useState([])
  const [openDialog, setOpenDialog] = useState(false);
  const [messageNotification, setMessageNotification] = useState('')
  const [devices, setDevices] = useState([])
  const [deviceNows, setDeviceNows] = useState([]);
  const [name, setName] = useState('');

  function handleCloseDialog() {
    setOpenDialog(false);
  };

  useEffect(() => {
    async function getAllSensors() {
      try{
        const res = await call_api({
          method: 'GET',
          url: '/sensor',
        });
        if(res.status === 200){
          setConstDevices(res.data)
          setDevices(res.data)
        }
      }catch(err){
        if(err?.response == null){
          toast("Error Server")
          return
        }
        toast(err?.response?.data?.title)
      }
  
    }
    getAllSensors()
  }, [])

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
      lastItem.isMulti = devices[index].isMulti;
  
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
      const isMulti = isMultiById(id)
      const newItemNow = {
        id: itemAfter.id,
        name: itemAfter.name,
        quantity: isMulti ? itemNow.quantity: 1,
        isMulti: isMulti,
      }
      newDeviceNows.splice(indexNow, 1, newItemNow)
      setDeviceNows(newDeviceNows)

      const newDevices = [...devices];
      const newItemAfter = {
        id: itemNow.id,
        name: itemNow.name,
        isMulti: itemNow.isMulti
      }
      newDevices.splice(indexAfter, 1, newItemAfter)
      newDevices.sort((d1, d2) => d1.id - d2.id)     
      console.log("devices: ", newDevices)

      setDevices(newDevices)
    }
  };

  function isMultiById(id){
    for(let i = 0; i < constDevices.length; i++){
      if(constDevices[i].id === id) return constDevices[i].isMulti
    }
    return false
  }

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
      toast("Bạn đã chọn hết các thiết bị")
      return
    }

    const lengthDeviceNows = deviceNows.length;
    if (lengthDeviceNows > 0) {
      const lastItem = deviceNows[lengthDeviceNows - 1]
      if (lastItem.id === 0) {
        toast("Bạn chưa chọn loại thiết bị")
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

    if(id === 0){
      const newDeviceNows = [...deviceNows];
      newDeviceNows.splice(index, 1);
      setDeviceNows(newDeviceNows);
      return
    }

    const resetDevice = {
      id: deviceNows[index].id,
      name: deviceNows[index].name,
      isMulti: deviceNows[index].isMulti,
    }

    const newDeviceNows = [...deviceNows];
    newDeviceNows.splice(index, 1);
    setDeviceNows(newDeviceNows);

    const newDevices = [...devices];
    newDevices.push(resetDevice);
    newDevices.sort((d1, d2) => d1.id - d2.id)
    setDevices(newDevices);

    console.log("devices: ", newDevices)
    console.log("deviceNows",newDeviceNows)
  }

  function addHomeHandler() {
    if (deviceNows.length === 0) {
      toast("Bạn chưa chọn thiết bị trong nhà!")
      return
    }

    if(deviceNows.length === 1 && deviceNows[0].id === 0) {
      toast("Bạn chưa chọn thiết bị trong nhà!")
      return
    }

    setOpenDialog(true)
    setMessageNotification("Bạn đồng ý thêm nhà!!!!!")
  }

  async function handleOnConfirm() {
    if (deviceNows[deviceNows.length - 1].id === 0) {
      deviceNows.splice(-1, 1)
    }
    try{
      const res = await call_api({
        method: 'POST',
        url: '/houses',
        data: {
          name,
          'sensors' : deviceNows,
        }
      });
      if(res.status === 200){
        toast("Bạn đã thêm nhà thành công")
        history.push("/")
      }
    }catch(err){
      if(err?.response == null){
        toast("Error Server")
        return
      }
      toast(err?.response?.data?.title)
    }

  }

  function quantityDeviceHandler(id, quantity) {
    const index = getIndexByIdOfCurrentDevices(id)
    if (index < 0) return;

    console.log("devices: ", devices)
    console.log("deviceNows",deviceNows)
    if(!(deviceNows[index].isMulti)) {
      toast("Chỉ được chọn 1 thiết bị này trong nhà")
      return
    }
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
          <div className="list-sub-header pt-2 pb-1">
            <h4 className="text-center">Thêm nhà</h4>
          </div>
          <div className="ml-3">
            <span style={{display: 'inline-block'}}><h5 className="mt-4">Tên nhà</h5></span>
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
      <ComfirmDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleOnConfirm}
        value={messageNotification} />
    </div>

  );
}
