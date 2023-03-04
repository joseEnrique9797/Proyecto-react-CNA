import React from 'react';
import {
  Routes,
  Route,
} from "react-router-dom";

import Home from './home';
// import Aboutus from './aboutus';

const Webpages = () => {
    return(
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </div>
    );
};

export default Webpages;

