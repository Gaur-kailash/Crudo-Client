// SideMenu.js
import React, { useEffect, useState } from 'react';
import {useNavigate } from 'react-router-dom';

function SideMenu() {
  const navigate = useNavigate();
  const [data,setData] = useState([]);
  const fetchData = async ()=>{
    try{
      let result = await fetch("http://localhost:5000/collections");
      result = await result.json();
      console.log(result,"result in json")
      setData(result);
    }catch(err){
      console.log("error while fetching data for sideMenu ",err);
    }

  }
  useEffect(()=>{
    fetchData();
  },[])
  return (
    <div className="accordion mt-3" id="sidebarAccordion">
      {data.map((item,index)=>{
        return (<div className="accordion-item content-bg" id={index}>
        <h2 className="accordion-header " id={index}>
          <button className="accordion-button primary-bg collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${index}`} aria-expanded="true" aria-controls={`collapse-${index}`}>
            {item.name}
          </button>
        </h2>
        <div id={`collapse-${index}`} className="accordion-collapse collapse " aria-labelledby={index} data-bs-parent="#sidebarAccordion">
          <div className="accordion-body" style={{backgroundColor:"#f0fdff"}}>
            <ul className="list-group ">
              {item.children.map((childItem,index)=>{
                return (
                  <button className='text-decoration-none rounded mt-1 secondary-btn border-0 p-1' id={index} onClick={()=>{
                    navigate(`/${childItem.collectionName}`,{state:childItem.schema})
                  }}> {childItem.collectionName} </button>)
              })}
            </ul>
          </div>
        </div>
      </div>)
      })}
    </div>
  );
}

export default SideMenu;
