import React, { useEffect, useState } from 'react';
import { Switch, TextField } from '@material-ui/core';
import call_api from '../services/request';
import SensorChart from './SensorChart';
import { HiLightBulb } from 'react-icons/hi';
import { WiHumidity } from 'react-icons/wi';
import { FaTemperatureHigh } from 'react-icons/fa';
import { AiOutlineWarning } from 'react-icons/ai';
import { makeStyles, Backdrop, CircularProgress } from '@material-ui/core';

const TIME_INTERVAL = 1000 * 10;

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
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

function LedSensorBox({ handle, checked }) {
    return (
        <div className="mt-4 p-3 border rounded shadow d-flex">
            <HiLightBulb color={checked ? '#ffc400' : 'gray'} size='2em' />
            <h6 className='ml-5 mt-2'>Đèn Led</h6>
            <Switch className="ml-auto" onChange={handle} checked={checked} />
        </div>
    );
}

function DoorSensorBox({ handle, checked }) {
    return (
        <div className="mt-4 p-3 border rounded shadow d-flex">
            <HiLightBulb color={checked ? '#ffc400' : 'gray'} size='2em' />
            <h6 className='ml-5 mt-2'>Cửa</h6>
            <Switch className="ml-auto" onChange={handle} checked={checked} />
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
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const [dataChartHT, setDataChartHT] = useState([]);
    const [dataChartGas, setDataChartGas] = useState([]);
    const [dataLed, setDataLed] = useState({ data: { status: false } });
    const [dataDoor, setDataDoor] = useState({ data: { status: false } });
    const [dataHT, setDataHT] = useState({data: {h: 0, t:0}});
    const [dataGas, setDataGas] = useState({ data: { value: 0 } });

    async function getDataSensor() {
        const res = await call_api({
            method: 'GET',
            url: '/sensor'
        });

        console.log(res.data.data);
        //door, gas
        const [dht11, led, door, gas] = res.data.data;
        setDataLed(led);
        setDataDoor(door);
        setDataHT({data: {h: dht11[-1].humidity, t:dht11[-1].temperature}});
        setDataGas({data: { nd: gas[-1].nd }});

        const _dataChart = dht11.data.map(item => [item.time, item.humidity, item.temperature]);
        _dataChart.unshift(['time', 'humidity', 'temperature']);

        setDataChartHT(_dataChartGas);

        const _dataChartGas = dht11.data.map(item => [item.time, item.humidity, item.temperature]);
        _dataChartGas.unshift(['time', 'concentration']);

        setDataChartGas(_dataChartGas);
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
                            <LedSensorBox handle={handleChangeLedStatus} checked={dataLed?.data?.status} />
                        </div>
                        <div className="col-12 mb-4">
                            <GasSensorBox data={dataGas.data}/>
                            <DoorSensorBox handle={handleChangeDoorStatus} checked={dataDoor?.data?.status} />

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeMain;