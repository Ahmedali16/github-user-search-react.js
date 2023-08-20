import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './ValidationForm.css'

import backgroundImage from './bg2.jpg';

const ValidationForm = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const initialValues = {
    userName: '',
  };

  const ValidationRules = Yup.object({
    userName: Yup.string().required("Required!").matches(/^[^\s]*$/, 'Spaces are not allowed').min(2, "Too short!").max(20, "Too long!"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: ValidationRules,
    onSubmit: (values, action) => {
      showInfo(values.userName);
      action.resetForm();
    },
  });

  const showInfo = async (name) => {
    try {
      const response = await fetch(`https://api.github.com/users/${name}`);
      if (response.ok) {
        const userJson = await response.json();
        setUser(userJson);
        setError(null);
      } else {
        setUser(null);
        setError('User not found');
      }
    } catch (err) {
      setUser(null);
      setError('An error occurred');
    }
  };

  const handleClear = () => {
    formik.resetForm();
    setUser(null);
  };

  return (
    <div
      className='App'
      style={{
        backgroundImage: `url(${backgroundImage})`,
        minHeight: '100vh',
        backgroundSize: 'cover',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
      <div className='fade p-3 bg-white' style={{ borderRadius: '20px', boxShadow: '2px 2px 2px 1px rgba(0, 0, 0, 0.2)' }}>
        <h1>GitHub User Info</h1>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            name='userName'
            label='Enter User Name'
            className='mt-3'
            variant='outlined'
            value={formik.values.userName}
            onChange={formik.handleChange}
            helperText={formik.touched.userName && <span className='text-danger'>{formik.errors.userName}</span>}
          />
          <br />
          <Button
            type='submit'
            className='m-3'
            variant='contained'
            color='primary'
          >
            Search
          </Button>
          <Button
            className='m-2'
            variant='contained'
            color='primary'
            onClick={handleClear}
          >
            Clear
          </Button>
          <div className=' text-center'>
            {user && (
              <div className='fade text-black'>
                <img
                  style={{ width: '200px', height: '200px', borderRadius: '90px', border: '2px solid grey' }}
                  src={user.avatar_url}
                  alt='User Avatar'
                />
                <p><span style={{ fontWeight: 'bold' }}> Login-id: </span>  <span className='text-success'> {user.id} </span></p>
                <p className="fadeIn"><span style={{ fontWeight: 'bold' }}> Name: </span> {user.login}</p>
                <p className="fadeIn"><span style={{ fontWeight: 'bold' }}> Followers:</span> {user.followers}</p>
                <p className="fadeIn"><span style={{ fontWeight: 'bold' }}>Following: </span> {user.following} </p>
                <p className="fadeIn"><span style={{ fontWeight: 'bold' }}>Public Repositories: </span>  <span className='text-danger'> {user.public_repos} </span> </p>
              </div>
            )}
            {error && <p className='text-danger font-weight-bold'>{error}</p>}
          </div>

        </form>
      </div>
    </div>
  );
};

export default ValidationForm;



