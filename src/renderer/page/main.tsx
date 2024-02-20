import React, { useState } from 'react';
import { Box, Grid, Stack } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FocusPage from './focus';
import MetaSelicPage from './metaSelic';
import IpcaMensalPage from './ipca';

enum Indicadores {
  Focus = "relatorio-focus",
  SelicMeta = "meta-selic",
  IpcaMensal = "ipca-mensal"
}

const MainPage = () => {
  const [indicador, setIndicador] = useState<Indicadores>(Indicadores.Focus);

  const handleSelectorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIndicador(event.target.value as Indicadores);
  };

  return (
    <Stack gap={5}>
      <Grid item xs>
        <FormControl>
          <FormLabel id="demo-row-radio-buttons-group-label">
            Dados
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            defaultValue={indicador}
            defaultChecked={true}
            onChange={handleSelectorChange}
          >
            <FormControlLabel
              value={Indicadores.Focus}
              control={<Radio />}
              label="Relatório Focus"
            />
            <FormControlLabel
              value={Indicadores.SelicMeta}
              control={<Radio />}
              label="Meta Selic"
            />
            <FormControlLabel
              value={Indicadores.IpcaMensal}
              control={<Radio />}
              label="Ipca Mensal"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Stack justifyContent={'center'}>
        {indicador === Indicadores.Focus && <FocusPage />}
        {indicador === Indicadores.SelicMeta && <MetaSelicPage />}
        {indicador === Indicadores.IpcaMensal && <IpcaMensalPage />}
      </Stack>
    </Stack>
  );
};

export default MainPage;
