import React from 'react';
import { Chart } from 'react-google-charts';

function SensorChart({data}) {

    return (
        <Chart
            width={'100%'}
            height={'400px'}
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={data}
            options={{
                title: 'Temperature / Humidity / Gas Chart',
                hAxis: {
                    title: 'Time',
                },
                vAxis: {
                    title: '% / C / G',
                },
                series: {
                    0: { curveType: 'function' },
                    1: { curveType: 'function' },
                },
            }}
        />
    );
}

export default SensorChart;