import React, { useEffect, useState } from 'react';
import { Switch, TextField } from '@material-ui/core';
import call_api from '../services/request';
import SensorChart from './SensorChart';
import { HiLightBulb } from 'react-icons/hi';
import { WiHumidity } from 'react-icons/wi';
import {GiExitDoor} from 'react-icons/gi'
import { FaTemperatureHigh } from 'react-icons/fa';
import { AiOutlineWarning } from 'react-icons/ai';
import { makeStyles, Backdrop, CircularProgress } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { useSelector } from 'react-redux';


const TIME_INTERVAL = 1000 * 10;

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
      },
      selectEmpty: {
        marginTop: theme.spacing(2),
      },
}));

function DHT11SensorBox({ data }) {
    return (
        <div className="p-2 border rounded shadow">
            <h6><WiHumidity color='#2196f3' /> Độ ẩm</h6>
            <h6 className="pl-3 text-primary">{data ? data.h.toFixed(2) : ''} %</h6>
            <h6><FaTemperatureHigh color='#e53935' /> Nhiệt độ</h6>
            <h6 className="pl-3 text-danger">{data ? data.t.toFixed(2) : ''} °C</h6>
        </div>
    );
}

function GasSensorBox({ data }) {
    return (
        <div className="p-2 border rounded shadow">
            <h6><WiHumidity color='#2196f3' />Nồng độ khi ga</h6>
            <h6 className="pl-3 text-primary">{data ? data.value.toFixed(2) : ''} %</h6>
            <MQ5SensorBox />
        </div>
    );
}

function LedSensorBox({ data }) {
    const classes = useStyles();
    const [code, setCode] = useState(data[0]?.houseSensorId)
    const [checked, setChecked] = useState(data[0]?.status)

    function generate() {
        return data.map(s => <MenuItem key={s.houseSensorId} value={s.houseSensorId}>{s.houseSensorId}</MenuItem>)
      }

      const handleCodeChange = (event) => {
          let id = event.target.value;
        setCode(id);
        setChecked(findLed(id));
      };

    const findLed = (id) => {
        for(let i = 0; i < data.length; i++){
            if(data[i].houseSensorId === id) return data[i].status
        }
        return false;
    }
    return (
        <div className="mt-4 p-3 border rounded shadow d-flex">
            <HiLightBulb color={checked ? '#ffc400' : 'gray'} size='2em' />
            <h6 className='ml-5 mt-2'>Đèn Led</h6>
            {/* <Switch className="ml-auto" onChange={handle} checked={checked} /> */}
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label" style={{ fonrSize: '20px' }}>Id</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={code}
                onChange={handleCodeChange}
              >
                {generate()}
              </Select>
            </FormControl>
        </div>
    );
}

function DoorSensorBox({ data }) {
    const classes = useStyles();
    const [code, setCode] = useState(data[0]?.houseSensorId)
    const [checked, setChecked] = useState(data[0]?.status)

    function generate() {
        return data.map(s => <MenuItem key={s.houseSensorId} value={s.houseSensorId}>{s.houseSensorId}</MenuItem>)
      }

      const handleCodeChange = (event) => {
          let id = event.target.value;
        setCode(id);
        setChecked(findDoor(id));
      };

    const findDoor = (id) => {
        for(let i = 0; i < data.length; i++){
            if(data[i].houseSensorId === id) return data[i].status
        }
        return false;
    }
    return (
        <div className="mt-4 p-3 border rounded shadow d-flex">
            <GiExitDoor color={checked ? '#ffc400' : 'gray'} size='2em' />
            <h6 className='ml-5 mt-2'>Cửa</h6>
            {/* <Switch className="ml-auto" onChange={handle} checked={checked} /> */}
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label" style={{ fonrSize: '20px' }}>Id</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={code}
                onChange={handleCodeChange}
              >
                {generate()}
              </Select>
            </FormControl>
        </div>
    );
}

function MQ5SensorBox({ data }) {

    const status = data?.value > data?.danger ? "danger" : (data?.value > data?.warning ? "warning" : "safe");
    const style = status === "safe" ? "success" : status;

    return (
        <div className={"full-width mt-2 p-2 border rounded shadow border-" + style}>
            <h6 className="text-center text-uppercase">gas emissions</h6>
            <h6 className="text-center">{data?.value?.toFixed(2)}</h6>
            <h6 className={"text-center text-uppercase text-" + style}>
                {status !== 'safe' ? <AiOutlineWarning /> : ''}
                {status}
                {status !== 'safe' ? <AiOutlineWarning /> : ''}
            </h6>
        </div>
    );
}

function HomeMain() {
    var newHouse = useSelector(state => state.house)
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const [dataChartHT, setDataChartHT] = useState([]);
    const [dataChartGas, setDataChartGas] = useState([]);
    const [dataLed, setDataLed] = useState([{
        houseSensorId: 1,
        status: true
    }]);
    const [dataDoor, setDataDoor] = useState([{
        houseSensorId: 1,
        status: true
    }]);
    const [dataHT, setDataHT] = useState({data: {h: 0, t:0}});
    const [dataGas, setDataGas] = useState({ data: { value: 0 } });

    async function getDataSensor() {
        const res = await call_api({
            method: 'POST',
            url: `/sensor-data-house/sensor/${newHouse.id}`
        });

        const {THERMOMETER, LED, DOOR, GAS_CONCENTRATION, HUMIDITY} = res.data;
        // const LEDS = [
        //     {
        //         houseSensorId: 1,
        //         status: true
        //     },
        //     {
        //         houseSensorId: 2,
        //         status: false
        //     },
        // ]
        // const DOORS = [
        //     {
        //         houseSensorId: 1,
        //         status: true
        //     },
        //     {
        //         houseSensorId: 2,
        //         status: false
        //     },
        // ]
        // setDataLed(LEDS);
        // setDataDoor(DOORS);
        setDataHT({data: {h: HUMIDITY[-1].hum, t:THERMOMETER[-1].temp}});
        // setDataHT({data: {h: 1, t:2}});

        // setDataGas({data: { nd: GAS_CONCENTRATION[-1].gasConcentration }});

        // const _dataChart = [[1,3,4,5],[2, 4,4,6],[3, 5,3,3],[4, 6,2,2],[5, 7,1,8]]
        _dataChart.unshift(['lastModifiedDate', 'humidity', 'temperature', 'gas']);
        const _dataChart = [['time','humidity', 'temperature', 'concentration']]
        const min = Math.min(HUMIDITY.length, THERMOMETER.length, GAS_CONCENTRATION.length)
        for(let i = 0; i < min; i++){
            _dataChart.push([HUMIDITY[i].time, HUMIDITY[i].hum, THERMOMETER[i].temp, GAS_CONCENTRATION[i].gasConcentration])
        }

        setDataChartHT(_dataChart);
    }

    function handleChangeLedStatus() {
        const dataUpdate = {
            name: dataLed.name,
            data: {
                status: !dataLed.data.status
            }
        };
        setDataLed(dataUpdate);
    };

    function handleChangeDoorStatus() {
        const dataUpdate = {
            name: dataDoor.name,
            data: {
                status: !dataDoor.data.status
            }
        };
        setDataDoor(dataUpdate);
    };

    useEffect(async () => {
        setOpen(true);
        await getDataSensor();
        setOpen(false);

        setInterval(async () => {
            await getDataSensor();
        }, TIME_INTERVAL);
    }, []);

    return (
        <div className="container mt-2">
            <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className="row">
                <div className="col-lg-8">
                    <SensorChart data={dataChartHT} />
                </div>
                <div className="col-lg-4">
                    <div className="row">
                        <div className="col-md-12 mb-4">
                            <DHT11SensorBox data={dataHT.data} />
                            <LedSensorBox data={dataLed} />
                        </div>
                        <div className="col-12 mb-4">
                            <GasSensorBox data={dataGas.data}/>
                            <DoorSensorBox data={dataDoor} />

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeMain;