import { useQuery } from '@tanstack/react-query';
import Breadcrumb from '../components/Breadcrumb.tsx';
import ChartFour from '../components/ChartFour';
import ChartOne from '../components/ChartOne.tsx';
import ChartThree from '../components/ChartThree.tsx';
import ChartTwo from '../components/ChartTwo.tsx';
import DefaultLayout from '../layout/DefaultLayout';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';

const Chart = () => {
  // const position = [51.505, -0.09];
  const position = [0, 0];

  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: ['countryList'],
    queryFn: () =>
      axios
        .get('https://disease.sh/v3/covid-19/countries')
        .then((res) => res.data),
  });

  if (isLoading) return 'Loading...';

  if (error) return 'An error has occurred: ' + error.message;


  let latLongList:Array<Array<any>> = [];
  const countryLists = data.map((item: any) => {
    latLongList.push([item.countryInfo.lat, item.countryInfo.long]);
    return {
      name: item.country,
      latlong : [item.countryInfo.lat, item.countryInfo.long],
      cases: item.active,
      deaths: item.deaths,
      recovered: item.recovered
    };
});


 console.log(latLongList);


  return (
    <DefaultLayout>
      <Breadcrumb pageName="Chart" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12">
          <ChartOne />
          {/* <ChartFour /> */}
        </div>

        <MapContainer
          center={0,0}
          zoom={0}
          scrollWheelZoom={true}
          style={{ minHeight: '500px', minWidth: '1200px' }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
   {countryLists.map((item: any) => {
          <Marker position={[latLongList]}>
            <Popup>
              Country :{item.name}
              {/* Active Cases : {item.cases}
              Recovered :{item.recovered}
              Deaths : {item.deaths} */}
            </Popup>
          </Marker>
        })}
        </MapContainer>
        {/* 
        <ChartTwo />
        <ChartThree /> */}
      </div>
    </DefaultLayout>
  );
};

export default Chart;
