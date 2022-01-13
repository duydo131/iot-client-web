import React from 'react';
import Nav from '../../components/Nav';
import HomeHeader from '../../components/HomeHeader';
import AddHouseMain from '../../components/AddHouseMain';

function AddHouse() {
    return (
        <div className="row full-height">
            <div className="col-2 p-0 full-height">
                <Nav />
            </div>
            <div className="col-10 p-0">
                <HomeHeader />
                <AddHouseMain />
            </div>
        </div>
    );
}

export default AddHouse;