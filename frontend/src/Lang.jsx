import React, {useEffect, useState} from 'react';
import axiosInstance from 'axios';
import './Lang.css';

function Lang() {

  const [response, setResponse] = useState([]);
  const [formData, setFormData] = useState({ prompt: '', });
  const [isLoading, setIsLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  // path
  const path = window.BACKEND_URL + '/api/lang/';
  const pathname = window.location.pathname.endsWith('/') ? window.location.pathname.slice(0, -1) : window.location.pathname;

  const postPrompt = (e) => {
    setIsLoading(true);  // spinner on
    e.preventDefault();
    axiosInstance.post(path, {
      prompt: formData.prompt,
    })
    .then((res) => {
      // console.log(res);
      setFormData({ prompt: '', });
      setResponse((response) => [...response, res.data]); 
    })
    .catch((error) => {
      console.log(error);
    });
  };

  const deleteItem = (id) => {
    axiosInstance.delete(path)
    .then((res) => {
      // get answer
      axiosInstance.get(path)
      .then((res) => {
          setResponse(res.data);
      })  
      .catch((error) => {
          console.log(error);
      });  
    })
    .catch((error) => {
      console.log(error);
    });
  };

  // useEffect for getting data
  useEffect(() => {
    // get answer
    console.log(path); // test
    axiosInstance.get(path)
    .then((res) => {
      setResponse(res.data);
    })  
    .catch((error) => {
      console.log(error);
    });
  }, [path]);

  // useEffect for spinner
  useEffect(() => {
    setIsLoading(false);  // spinner off when goes to the bottom of the response list
  }, [response]);

  useEffect(() => {
    // Trigger the fade-in effect when the component mounts
    setFadeIn(true);
  }, []);

   // handle input
  const handleInput = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="App">
     <h1>Corrector</h1>
     <h1> * </h1>
      <div className="response">
        {window.location.port === '5173' ? (
          <>
            <div className="prompt">This is an english language corrector.</div>
            <div className='correction'>Your English is correct.</div>
            <div className='translation'>Ez egy angol nyelvhelyesség-javító.</div>
          </>
        ) : null}
        {response.map((item) => (
          <div key={item.id} className={`item ${fadeIn ? 'fade-in' : ''}`}> 
            <div className="prompt">{item.prompt}</div>
            <div className='correction'>{item.correction}</div>
            <div className='translation'>{item.translation}</div>
          </div>
        ))}
        {isLoading && <div className="loading">Loading...</div>}
      </div>

      <form onSubmit={postPrompt}>
        <h1> * </h1>
        <textarea
          type="text"
          name="prompt"
          value={formData.prompt}
          onChange={handleInput}
          placeholder="Enter your text"
          required
          />
        <button type="submit">Submit</button>
      </form>
      <button className="delete" onClick={deleteItem}>Delete</button>
    </div>
  );
}

export default Lang;