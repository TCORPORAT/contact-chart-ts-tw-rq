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
  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: ['countryList'],
    queryFn: () =>
      axios
        .get('https://disease.sh/v3/covid-19/countries')
        .then((res) => res.data),
  });

  if (isLoading) return 'Loading...';

  if (error) return 'An error has occurred: ' + error.message;

  const countryLists = data.map((item: any) => {
    return {
      name: item.country,
      latlong: [item.countryInfo.lat, item.countryInfo.long],
      cases: item.active,
      deaths: item.deaths,
      recovered: item.recovered,
    };
  });

  // console.log(latLongList);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Chart" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12">
          <ChartOne />
        </div>

        <MapContainer
          center={[0, 0]}
          zoom={0}
          scrollWheelZoom={true}
          style={{ minHeight: '500px', minWidth: '1200px' }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {countryLists.map((pos: string | number | Array, index: number) => {
            return (
              <Marker position={pos.latlong} key={index}>
                <Popup>{`
              Country : ${pos.name} \n
              Total Cases : ${pos.cases}\n
               Total Recovered : ${pos.recovered}\n
               Deaths: ${pos.deaths}   
              `}</Popup>
              </Marker>
            );
          })}
          ;
        </MapContainer>
      </div>
    </DefaultLayout>
  );
};

export default Chart;
