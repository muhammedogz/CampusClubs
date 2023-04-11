import { useState } from 'react';

const test = () => {
  const [data, setData] = useState<any[] | null>(null);
  const path = import.meta.env.VITE_API_PATH;
  console.log('path', path);
  const fetchData = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_PATH}/weatherforecast`);
    const data = await res.json();
    setData(data);
  };

  return (
    <div>
      dfgdfgdf
      <button onClick={fetchData}>Fetch</button>
      <div>
        {data?.map((item) => (
          <div key={item.date}>
            <div>{item.date}</div>
            <div>{item.summary}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default test;
