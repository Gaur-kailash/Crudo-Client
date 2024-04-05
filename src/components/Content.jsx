// Content.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MultipleSelect from './MultipleSelect';

function Content() {
  let { pathname, state } = useLocation();
  let initformData = {};
  state?.map((item,i)=>{
    initformData[item.fieldName] = item.fieldType==="Array"?[]:"";
  })
  pathname = pathname.slice(1)
  const [data, setData] = useState([]);
  const [createFlag, setCreateFlag] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchData();
    setFormData(initformData);
    console.log(state,"states");
  }, [pathname]);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/entities?collectionName=${pathname}`);
      const jsonData = await response.json();
      console.log("Api data", jsonData);
      setData(jsonData.result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const FormGenerator = (field, index) => {
    let labelAndInput;
    if (!(field.inputType === "radio")) {
      labelAndInput = (
        <div>
          <label htmlFor={field.fieldName} className="form-label">{field.fieldName}</label>
          <input
            type={field.inputType}
            className="form-control"
            value={formData[field.fieldName]}
            onChange={(e) => { setFormData({ ...formData, [field.fieldName]: e.target.value }) }}
            id={index}
            aria-describedby={field.fieldName + "Help"} />
        </div>
      );
    } else {
      let radioInputs = field.options.map((radioOption, i) => (
        <div key={i} className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name={field.fieldName}
            id={i}
            value={radioOption}
            onChange={(e) => { setFormData({ ...formData, [field.fieldName]: e.target.value }) }}
            checked = {radioOption === formData[field.fieldName]}
          />
          <label className="form-check-label" htmlFor={i}>
            {radioOption}
          </label>
        </div>
      ));
      labelAndInput = (
        <div>
          <label>{field.fieldName}</label><br />
          {radioInputs}
        </div>
      );
    }
    return labelAndInput;
  };
  const handleEdit = (item) => {
    setFormData(item);
    console.log(item, "handle Edit data")
  };

  const handleDelete = async (id) => {
    console.log("id in delete", id)
    const response = await fetch(`http://localhost:5000/entities/${id}?collectionName=${pathname}`, { method: 'DELETE', 'Content-Type': "application/json" });
    const jsonData = await response.json();
    console.log(jsonData,"delete json")
    if (jsonData) {
      fetchData();
    }
    console.log("DELETE", jsonData)
    console.log('Deleting item with id:', id);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("formData", formData)
    if (createFlag) {
      try {
        const result = await fetch(`http://localhost:5000/entities?collectionName=${pathname}`, {
          method: 'POST',
          headers: {
            'Content-Type': "application/json"
          },
          body: JSON.stringify(formData)
        })
        const jsonData = await result.json();
        console.log(result, "submit res")
        console.log(jsonData, "json data in res")
        if (!jsonData.error) {
          fetchData();
        }
      }
      catch (err) {
        console.log("error", err);
      }
    } else {
      try {
        const {_id,...newFormData} = formData;
        console.log(newFormData,"form wihtout id")
        const result = await fetch(`http://localhost:5000/entities/${formData['_id']}?collectionName=${pathname}`, {
          method: 'PUT',
          headers: {
            'Content-Type': "application/json"
          },
          body: JSON.stringify(newFormData)
        })
        const jsonData = await result.json();
        console.log(result, "res")
        if (!jsonData.error) {
          fetchData();
        }
      }
      catch (err) {
        console.log(err, "error")
      }
    }
    state.map((item,i)=>{
      initformData[item.fieldName] = ""
    })
    setFormData(initformData)
  };
  
  return (
    <div className="content p-2">
      <h2>{pathname}</h2>
      <p>This is the content for {pathname} page.</p>
      <button className="btn primary-btn" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { setCreateFlag(true)
      state?.map((item,i)=>{
        initformData[item.fieldName] = item.fieldType==="Array"?[]:"";
      });
      setFormData(initformData)}}>Create {pathname}</button>

      <table className="table my-2 rounded" >
        <thead>
          <tr className='secondary-bg'>
            {data && data.length !== 0 && Object.keys(data[0]).map((item, i) => {
              if (!((item === "_id") || (item === "__v") || (item === "createdAt") || (item === "updatedAt"))) {
                return (<th id={i}>{item}</th>)
              }
            })}
            <th>operations</th>
          </tr>
        </thead>
        <tbody>
          {data && data.map((item, index) => {
            return (
              <tr style={{backgroundColor:"#fdedd9"}}>
                {Object.keys(item).map((key, i) => {
                  if (!((key === "_id") || (key === "__v") || (key === "createdAt") || (key === "updatedAt"))) {
                    if(Array.isArray(item[key])){
                      let data = ""
                      item[key].map((item,i)=>{
                        data += item + ","
                      })
                      data = data.slice(0,(data.length-1))
                      return (<td>{data}</td>)
                    }
                    else{
                    return (<td>{item[key]}</td>)}
                  }
                })}
                <td><button className="btn btn-sm primary-btn" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { setCreateFlag(false)
                handleEdit(item) }}>Update</button><button className='btn btn-sm m-1 btn-danger' onClick={() => { handleDelete(item["_id"]) }}>Delete</button></td>
              </tr>)
          })}
        </tbody>
      </table>

      <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header default-bg ">
              <h5 className="modal-title" id="exampleModalLabel">{createFlag ? "Create" : "Update"} {pathname}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body content-bg">
              <form>
                {state?.map((field, index) => {
                  return (
                    <div class="mb-3" id={index}>
                       {field.inputType === "select" && <>
                       <label htmlFor={field.fieldName} className="form-label">{field.fieldName}</label>
                    <MultipleSelect field={field} formData={formData} setFormData={setFormData}/></>
                  }
                  {field.inputType !== "select" && FormGenerator(field,index)
                  }
                    </div>
                  )
                })}
              </form>
            </div>
            <div className="modal-footer default-bg">
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
              <button type="button" onClick={handleSubmit} className="btn btn-success" data-bs-dismiss="modal">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Content;
