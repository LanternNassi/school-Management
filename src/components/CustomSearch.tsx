import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import { ReactNode, useState } from "react";

interface Props {
    placeholder : string;
    icon_1 : ReactNode;
    icon_2 : ReactNode;
    value : string;
    onChange : (e : React.HTMLInputTypeAttribute)=> void;
}

const CustomSearch : React.FC<Props> = ({ placeholder, icon_1, icon_2, value, onChange}) => {
  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        value={value}
        onBlur = {(event) => console.log(event.currentTarget)}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        inputProps={{ 'aria-label': 'search google maps' }}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        {icon_1}
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions">
        {icon_2}
      </IconButton>
    </Paper>
  );
}

export default CustomSearch

CustomSearch.propTypes = {
  placeholder: PropTypes.string.isRequired,
  icon_1: PropTypes.node.isRequired,
  icon_2: PropTypes.node.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};