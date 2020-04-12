import React, { Suspense, useState, useEffect } from "react";
import "./App.css";
import { Helmet } from "react-helmet";
import { getStateWiseData, getStats } from "./services/patients.service";
import { BrowserRouter as Router } from "react-router-dom";

import Toolbar from "./components/nav/Toolbar";
import Footer from "./components/Footer";
import WhatsappShare from "./components/whatsapp-share";
import { schemaMarkup } from "./components/SEO";
import SocialFooter from "./components/SocialFooter";
import Routes from "./Routes";

const Notification = React.lazy(() => import("./components/Notification"));

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [statewise, setStatewise] = useState({});
  const [total, setTotal] = useState({});
  const [tested, setTested] = useState({});
  const [dayChange, setDayChange] = useState({});
  const [isMobile] = useState(document.documentElement.clientWidth < 768);
  const [ageGroup, setAgeGroup] = useState({});
  const [nationality, setNationality] = useState({});
  const [gender, setGender] = useState({});
  const [hospitalizationStatus, setHospitalizationStatus] = useState({});

  useEffect(() => {
    getStateWiseData().then(({ data }) => {
      setStatewise(data.statewise);
      setTotal(data.total);
      setDayChange(data.dayChange);
      setTested(data.tested);

      getStats().then(({ data }) => {
        setAgeGroup(data.ageGroup);
        setHospitalizationStatus(data.hospitalizationStatus);
        setGender(data.gender);
        setNationality(data.nationality);
        setIsLoading(false);
      });
    });
  }, []);

  return (
    <>
      <Helmet>
        <script type="application/json">
          {JSON.stringify(schemaMarkup())}
        </script>
      </Helmet>
      <Router>
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <>
            <Toolbar />
            <Notification></Notification>
            {!isLoading && <Routes
              isLoading={isLoading}
              statewise={statewise}
              total={total}
              tested={tested}
              dayChange={dayChange}
              isMobile={isMobile}
              ageGroup={ageGroup}
              nationality={nationality}
              gender={gender}
              hospitalizationStatus={hospitalizationStatus}></Routes>}
            <SocialFooter></SocialFooter>
            <Footer></Footer>
          </>
          <WhatsappShare></WhatsappShare>
        </Suspense>
      </Router>
    </>)
}

export default App;
