import axiosWithAuth from '../components/axiosAuth';
import axios from 'axios';
import { dbUrl } from './index';
//replace dbUrl in index.js to change backend server for testing

export const GET_LANGUAGES_START = 'GET_TALENT_LANGUAGES';
export const GET_LANGUAGES_SUCESS = 'GET_LANGUAGES_SUCCESS';
export const GET_LANGUAGES_FAILURE = 'GET_LANGUAGES_FAILURE';

export const ADD_TALENT_LANGUAGE_START = 'ADD_TALENT_LANGUAGE_START';
export const ADD_TALENT_LANGUAGE_SUCCESS = 'ADD_TALENT_LANGUAGE_SUCCESS';
export const ADD_TALENT_LANGUAGE_FAIL = 'ADD_TALENT_LANGUAGE_FAIL';

export const addTalentLanguage = newTalentLanguage => dispatch => {
  dispatch({ type: ADD_TALENT_LANGUAGE_START });
  return axiosWithAuth()
    .post(`${dbUrl}/api/talents/talentLanguage`, newTalentLanguage)
    .then(res => dispatch({ type: ADD_TALENT_LANGUAGE_SUCCESS }))
    .catch(err => {
      console.log(err);
      return dispatch({ type: ADD_TALENT_LANGUAGE_FAIL });
    });
};

export const getLanguages = () => dispatch => {
  dispatch({ type: GET_LANGUAGES_START });
  return axiosWithAuth()
    .get(`${dbUrl}/api/talents/languages`)
    .then(res => {
      dispatch({
        type: GET_LANGUAGES_SUCESS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_LANGUAGES_SUCESS,
        payload: err
      });
    });
};
