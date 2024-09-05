import { useEffect } from 'react';
import {Topbar} from "./components/Topbar";
import Item from "./models/Item";
import React, {useState} from 'react';
import {Main} from "./components/Main";
import Box from "@mui/material/Box";

export function App() {
  const [data, setData] = useState<Item[]>([]);
  const fetchData = async () => {
      try {
          const response = await fetch('http://localhost:8010/api/v1/tree');
          const result = await response.json();
          result.data.sort(function(a: any, b: any) {
              return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
          });
          setData(result.data);

      } catch (error) {
          console.error('Error fetching data:', error);
      }
  };

  useEffect(() => {
      fetchData();
  }, []);

  return (
      <Box sx={{height: '100vh', width: '100vw', overflow: 'hidden'}}>
          <Topbar />
          <Main fileArray={data} />
      </Box>

  );
}
