import React from 'react'
import SideMenu from '../components/SideMenu';
import Content from '../components/Content';
import Navbar from '../components/Navbar';

function Home() {
    return (
      <div>
        <Navbar/>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3 bg">
              <SideMenu />
            </div>
            <div className="col-md-9 bg">
              <Content />
            </div>
          </div>
        </div>
      </div>
    );
  }

export default Home