import { Alert, Button, CircularProgress, Grid } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import DatePickerValue from '../components/Date';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { LoadContext } from '../context/Load';

const IpcaMensalPage = () => {
  const [data, setData] = useState<null | Dayjs>(dayjs());
  const [alert, setAlert] = useState<undefined | React.ReactNode>();
  const { isLoading, setLoading } = useContext(LoadContext);

  const onClickColetarDados = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setLoading(true);
    let severity: 'success' | 'warning' | 'error' = 'success';
    try {
      const res = await axios.get('http://localhost:8000/ipca', {
        params: {
          date: data?.format('YYYY-MM-DD'),
        },
      });
      console.log(res);
      let message = res.data.message;
      const statusCode = res.status;

      if (statusCode !== 200) {
        severity = 'warning';
        // message = 'Nenhum dado disponível'
      }
      setAlert(<Alert severity={severity}>{message}</Alert>);
    } catch (error) {
      severity = 'error';
      if (axios.isAxiosError(error)) {
        // Now TypeScript knows `error` is an AxiosError
        console.log(error.message); // Example of accessing AxiosError specific properties
        setAlert(
          <Alert severity={severity}>Ocorreu um erro: {error.message}</Alert>,
        );
      } else {
        // Error is not from Axios
        console.log('An unexpected error occurred');
        setAlert(<Alert severity={severity}>Ocorreu um erro inesperado</Alert>);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (alert) {
      setTimeout(() => {
        setAlert(undefined);
      }, 5000);
    }
  }, [alert]);
  return (
    <Grid container justifyContent={'center'} gap={5} alignSelf={'center'}>
      {isLoading && (
        <Grid item xs={12} alignSelf={'center'}>
          <CircularProgress />
        </Grid>
      )}
      {alert && (
        <Grid item xs={12} justifyContent={'center'}>
          {alert}
        </Grid>
      )}
      <DatePickerValue label="Data do Ipca" value={data} setValue={setData} />
      <Grid item xs={12} justifyContent={'center'} textAlign={'center'}>
        <Button variant="contained" onClick={onClickColetarDados}>
          Coletar Ipca
        </Button>
      </Grid>
    </Grid>
  );
};

export default IpcaMensalPage;
