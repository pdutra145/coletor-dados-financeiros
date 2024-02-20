import {
  Alert,
  AlertProps,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from '@mui/material';

import React, { useContext, useEffect, useState } from 'react';
import Date from '../components/Date';
import axios, { AxiosError } from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { LoadContext } from '../context/Load';

enum IndicadoresEconomicos {
  IPCA = 'IPCA',
  Selic = 'Selic',
}

const FocusPage = () => {
  const [indicadores, setIndicadores] = useState<IndicadoresEconomicos>(
    IndicadoresEconomicos.Selic,
  );
  const [dataRelatorio, setData] = useState<null | Dayjs>(dayjs());
  const [alert, setAlert] = useState<undefined | React.ReactNode>();
  const { isLoading, setLoading } = useContext(LoadContext);

  const handleIndicadorChange = (
    event: SelectChangeEvent<IndicadoresEconomicos>,
  ) => {
    setIndicadores(event.target.value as IndicadoresEconomicos);
  };

  const onClickColetarDados = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setLoading(true);
    console.log(dataRelatorio?.toISOString());
    let severity: 'success' | 'warning'| 'error' = 'success';
    try {
      const res = await axios.get('http://localhost:8000/relatorio-focus', {
        params: {
          indicador: indicadores.toString(),
          date: dataRelatorio?.format('YYYY-MM-DD'),
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
      severity = 'error'
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
  console.log('rendering');

  return (
    <Grid
      container
      textAlign={'center'}
      justifyContent={'space-between'}
      alignItems={'center'}
      gap={5}
      xs={8}
      alignSelf={'center'}
    >
      {isLoading && (
        <Grid item xs={12}>
          <CircularProgress />
        </Grid>
      )}
      {alert && (
        <Grid item xs={12} justifyContent={'center'}>
          {alert}
        </Grid>
      )}
      <Date
        label="Data do Relatório"
        value={dataRelatorio}
        setValue={setData}
      />
      <Grid item xs={3}>
        <FormControl fullWidth>
          <InputLabel>Indicador Econômico</InputLabel>
          <Select
            value={indicadores}
            label="Indicador Econômico"
            onChange={handleIndicadorChange}
          >
            <MenuItem value={IndicadoresEconomicos.IPCA}>Ipca</MenuItem>
            <MenuItem value={IndicadoresEconomicos.Selic}>Selic</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} textAlign={'center'}>
        <Grid
          component={Button}
          variant="contained"
          xs={5}
          textAlign={'center'}
          onClick={onClickColetarDados}
        >
          Coletar Dados
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FocusPage;
