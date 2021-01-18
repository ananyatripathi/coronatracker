
import { FormControl, Menu, MenuItem, Select, Card, CardContent } from '@material-ui/core';
import { useEffect, useState } from 'react';
import './App.css';
import InfoBox from './InfoBox';
import Table from './Table'
import Map from './Map'
import { prettyPrintStat, sortData } from './util';
import LineGraph from './LineGraph';
import 'leaflet/dist/leaflet.css'


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] =useState([])
  const [tableData, setTableData] =useState([])
  const [mapCenter, setMapCenter] =useState
  ({ lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] =useState([])

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data)
    });
  }, []);

  useEffect(() => {
    const getCOuntriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.country,
          value: country.iso2,
        }));

        const sortedData = sortData(data)
        setMapCountries(data)
        setTableData(sortedData)
        setCountries(countries)

      });
      
    };
      
      getCOuntriesData();
  }, []);


  const onCountryChange = async (event) => {
    
    const countryCode=event.target.value
    

    const url = countryCode === 'worldwide' 
    ? 'https://disease.sh/v3/covid-19/all' 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setCountry(countryCode)
      setCountryInfo(data)
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    });
  }; 


  return (
    <div className="app">
      <div className="app_left">
      <div className="app_header">
        <h1>CORONA VIRUS TRACKER</h1>
        
        <FormControl className="last">
        
          <Select variant="outlined" color="secondary" onChange={onCountryChange} value={country}>
            <MenuItem value="worldwide" className="worldwide">Worldwide</MenuItem>  
            {countries.map((country) => (
            <MenuItem value={country.name}>{country.name}</MenuItem>
            ))}
          </Select>
          
        </FormControl>
        

      </div>
      <div className="app_stats">
        <InfoBox title="Covid-19 Cases" total={prettyPrintStat(countryInfo.cases)} cases={prettyPrintStat(countryInfo.todayCases)}></InfoBox>

        <InfoBox title="Covid-19 Recovered" total={prettyPrintStat(countryInfo.recovered)} cases={prettyPrintStat(countryInfo.todayRecovered)}></InfoBox>

        <InfoBox title="Covid-19 Deaths" total={prettyPrintStat(countryInfo.deaths)} cases={prettyPrintStat(countryInfo.todayDeaths)}></InfoBox>
      </div>
      
      <Map
      countries={mapCountries}
      center={mapCenter}
      zoom={mapZoom}
      />
      </div>

      <Card className="app_right">
        <CardContent className="right">
          <h3 className="sidebarhead">Live Cases by Country</h3>
          <Table countries={tableData}></Table>
          
          
        </CardContent>
        <h3 className="sidebarhead2">World Wide Cases</h3>
        <LineGraph></LineGraph>
        </Card>

      
      </div>
  );
}

export default App;
