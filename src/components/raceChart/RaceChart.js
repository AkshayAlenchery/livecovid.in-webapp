import React, { useEffect, useState } from 'react';
import { getStatesRaceChart } from '../../services/charts.service';
import { ResponsiveBar } from '@nivo/bar';
import { format } from 'date-fns'
import useInterval from '../../hooks/useInterval';
import RaceChartControls from './RaceChartControls';
import { useTranslation } from 'react-i18next';
import { sendEventToGA } from '../../services/analytics.service';

const BarComponent = props => {
  return (
    <g transform={`translate(${props.x},${props.y})`}>
      <rect
        x={-3}
        y={7}
        width={props.width}
        height={props.height}
        fill="rgba(0, 0, 0, .07)"
      />
      <rect width={props.width} height={props.height} fill={props.color} />
      <rect
        x={props.width - 5}
        width={5}
        height={props.height}
        fill={props.borderColor}
        fillOpacity={0.2}
      />
      <text
        x={props.width - 16}
        y={props.height / 2 - 8}
        textAnchor="end"
        dominantBaseline="central"
        fill="black"
        style={{
          fontWeight: 900,
          fontSize: 15,
        }}
      >
        {props.data.indexValue}
      </text>
      <text
        x={props.width - 16}
        y={props.height / 2 + 10}
        textAnchor="end"
        dominantBaseline="central"
        fill={props.borderColor}
        style={{
          fontWeight: 400,
          fontSize: 13,
        }}
      >
        {props.data.value}
      </text>
    </g>
  )
}

const DataManager = () => {
  let index = 0;
  let dataStore = {};
  let state = [];
  let totalElements = 0;
  return {
    initialise: (intialIndex, data) => {
      index = intialIndex;
      dataStore = data;
      state = data[index];
      totalElements = data.length;
    },
    restart: (intialIndex) => {
      index = intialIndex;
      state = dataStore[index];
    },
    increment: () => {
      if (index + 1 < totalElements) {
        index++;
        state = dataStore[index];
      }
    },
    decrement: () =>{
      if(index > 0){
        index--;
        state = dataStore[index];
      }
    },
    getData: () => {
      return {
        index,
        state
      }
    }
  }
}

const dataManager = DataManager();
// Analytics variables.
const category = "User";
const action = "Clicked Race Controls"

const RaceChart = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [raceTimeInterval, setRaceTimeInterval] = useState(2000);
  const [barData, setBarData] = useState({ data: dataManager.getData().state.data, date: dataManager.getData().state.date });
  const { t } = useTranslation();

  useEffect(() => {
    getStatesRaceChart().then(response => {
      if (response.status === 200) {
        dataManager.initialise(0, response.data.raceChart);
        setBarData({ data: [...dataManager.getData().state.data], date: dataManager.getData().state.date });
        setIsLoading(false);
      } else {
        console.log("Error in API");
      }
      setIsLoading(false);
    });
  }, []);

  useInterval(() => {
    dataManager.increment();
    setBarData({ data: [...dataManager.getData().state.data], date: dataManager.getData().state.date });
  }, isPaused || isLoading ? null : raceTimeInterval)

  return isLoading ? <div>{t('Loading')}</div> : <div className="card race-chart" >
    <h2>{t('State-wise Cases with Time')}</h2>
    <div>
      <h3 className="racechart-date">{format(new Date(barData.date), "d MMMM yyyy")}</h3>
      <p className="racechart-speed">{t('Speed')}: {(2000 / raceTimeInterval).toPrecision(3)}x</p>
    </div>
    <div className="race-chart" style={{ height: '500px' }}>
      <ResponsiveBar
        layout="horizontal"
        margin={{ top: 26, right: props.isMobile ? 10 : 20, bottom: 26, left: props.isMobile ? 10 : 20 }}
        data={barData.data}
        indexBy="id"
        keys={['value']}
        colors={{ scheme: 'orange_red' }}
        colorBy="indexValue"
        borderColor={{ from: 'color', modifiers: [['darker', 2.6]] }}
        enableGridX
        enableGridY={false}
        axisTop={{
          format: '~s',
        }}
        axisBottom={{
          format: '~s',
        }}
        axisLeft={null}
        padding={0.3}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.4]] }}
        isInteractive={false}
        barComponent={BarComponent}
        motionStiffness={250}
        motionDamping={50}
      />
    </div>
    <RaceChartControls
      isPaused={isPaused}
      onPause={() => { setIsPaused(!isPaused); sendEventToGA(category, action, 'pause/play'); }}
      onFaster={() => { setRaceTimeInterval(raceTimeInterval - (raceTimeInterval * .25)); sendEventToGA(category, action, 'faster') }}
      onSlower={() => { setRaceTimeInterval(raceTimeInterval + (raceTimeInterval * .25)); sendEventToGA(category, action, 'slower') }}
      onRestart={() => { dataManager.restart(0); setIsPaused(false); sendEventToGA(category, action, 'restart') }}
      onStepForward={() => { setIsPaused(true); dataManager.increment(); setBarData({ data: [...dataManager.getData().state.data], date: dataManager.getData().state.date }); sendEventToGA(category, action, 'forward') }}
      onStepBackward={() => { setIsPaused(true); dataManager.decrement(); setBarData({ data: [...dataManager.getData().state.data], date: dataManager.getData().state.date }); sendEventToGA(category, action, 'backward') }}
    ></RaceChartControls>
  </div>
}


export default RaceChart;