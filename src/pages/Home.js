import React from "react";

import Stats from "../components/Stats";
import IndiaStateMap from "../components/IndiaStateMap";
import GenderChart from "../components/charts/GenderChart";
import IndianTimeSeriesWrapper from "../components/charts/timeSeriesCharts/IndianTimeSeriesWrapper";
import { HelmetDefault } from "../components/SEO";
import LastUpdatedIndicator from "../components/LastUpdatedIndicator";
import RaceChart from "../components/raceChart/RaceChart";
import StatewiseTable from "../components/StateWise/StatewiseTable";
import { useTranslation } from "react-i18next";

const Home = props => {
  const {t} = useTranslation();
return <>
        <HelmetDefault title={"Home"}></HelmetDefault>
        <div className="container">
          <LastUpdatedIndicator
            lastUpdated={props.total.lastUpdated}
          ></LastUpdatedIndicator>
          <Stats
            dayChange={props.dayChange}
            total={props.total}
            tested={props.tested}
          ></Stats>
          <div className="row">
            <div className="col-12">
              <RaceChart isMobile={props.isMobile}></RaceChart>
            </div>
          </div>
          <div className="row">
            <h1>{t('COVID-19 Cases India - State-wise')}</h1>
            <div className="col-6">
              {props.isLoading ? null : <IndiaStateMap
                dayChange={props.dayChange}
                total={props.total}
                statewise={props.statewise}
                isMobile={props.isMobile}
              ></IndiaStateMap>}
            </div>
            <div className="col-6">
              <StatewiseTable
                statewise={props.statewise}
                isMobile={props.isMobile}
                statewiseTestingData = {props.statewiseTestingData}
              ></StatewiseTable>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <IndianTimeSeriesWrapper
                isMobile={props.isMobile}
              ></IndianTimeSeriesWrapper>
            </div>
            {/* <div className="col-6">
              <AgeGroup ageGroup={props.ageGroup}></AgeGroup>
            </div> */}
            <div className="col-6">
              <GenderChart gender={props.gender}></GenderChart>
            </div>
            {/* <div className="col-6">
            <NationalityChart
              nationality={props.nationality}
            ></NationalityChart>
          </div> */}
          </div>
        </div>
      </>
};

export default Home;
