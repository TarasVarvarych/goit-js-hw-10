import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const DEBOUNCE_DELAY = 300;
const inputRef = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));
function onInputChange(e) {
  const countryName = e.target.value.trim();
  if (countryName === '') {
    clearMarkup();
  }
  fetchCountries(countryName)
    .then(country => addMarkup(country))
    .catch(error => {
      if (countryName !== '') {
        Notify.failure('Oops, there is no country with that name');
      }
    });
}

function addMarkup(country) {
  if (country.length > 1 && country.length < 10) {
    countryList.innerHTML = country
      .map(
        data =>
          `<li><img class="flag" src="${data.flags.svg}" width=20 alt="flag">${data.name}</li>`
      )
      .join('');
    countryInfo.innerHTML = '';
  } else if (country.length === 1) {
    countryInfo.innerHTML = country
      .map(
        data =>
          `<div class="fat-name"><img class="flag" src="${
            data.flags.svg
          }" width=30 alt="flag">${
            data.name
          }</div><ul><li><span class="fat">Capital:</span> ${
            data.capital
          }</li><li><span class="fat">Population:</span> ${
            data.population
          }</li><li><span class="fat">Languages:</span> ${data.languages.map(
            lang => ' ' + lang.name
          )}</li></ul>`
      )
      .join('');
    countryList.innerHTML = '';
  } else if (country.length > 9) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    clearMarkup();
  }
}

function clearMarkup() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
