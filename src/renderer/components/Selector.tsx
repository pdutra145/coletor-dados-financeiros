import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

function Selector() {
  return (
    <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">Indicador</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel value="relatorio-focus" control={<Radio />} label="Relatório Focus" />
        <FormControlLabel value="meta-selic" control={<Radio />} label="Meta Selic" />

      </RadioGroup>
    </FormControl>
  );
}

export default Selector