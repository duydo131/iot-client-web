import React from 'react';
import Nav from '../../components/Nav';
import HomeHeader from '../../components/HomeHeader';
import HouseMain from '../../components/HouseMain';

function Home() {
    return (
        <div className="row full-height">
            <div className="col-2 p-0 full-height">
                <Nav />
            </div>
            <div className="col-10 p-0">
                <HomeHeader />
                <HouseMain />
            </div>
        </div>
    );
}

export default Home;