import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBackward,
  faForward,
  faStepBackward,
  faStepForward,
} from '@fortawesome/free-solid-svg-icons';
import { PropTypes } from '@material-ui/core';

const CustomOutlinedInput = ({
  color,
  disableElevation,
  disableRipple,
  disableFocusRipple,
  ...otherProps
}: Record<any, any>) => <OutlinedInput {...otherProps} />;
const StyledInput = withStyles(() => ({
  input: {
    borderRadius: 0,
    textAlign: 'center',
    paddingLeft: 0,
    paddingRight: 0,
    width: 80,
    height: '0em',
  },
  root: {
    padding: 0,
  },
}))(CustomOutlinedInput);

type QualitySelectorProps = {
  amount: string;
  setAmountFunctionFastBackward: any;
  setAmountFunctionBackward: any;
  setAmountFunctionForward: any;
  setAmountFunctionFastForward: any;
  readonlyInput?: boolean;
  buttonGroupClass?: string;
  fastBackwardClass?: string;
  backwardClass?: string;
  forwardClass?: string;
  fastForwardClass?: string;
  styledInputClass?: string;
  fastBackwardIcon?: any;
  backwardIcon?: any;
  forwardIcon?: any;
  fastForwardIcon?: any;
  fullWidth?: boolean;
  styledRootClass?: string;
  buttonColor?: {
    fastBackwardColor?: PropTypes.Color;
    backwardColor?: PropTypes.Color;
    forwardColor?: PropTypes.Color;
    fastForwardColor?: PropTypes.Color;
  };
};

function QuantitySelector(props: QualitySelectorProps) {
  const {
    amount,
    setAmountFunctionFastBackward,
    setAmountFunctionBackward,
    setAmountFunctionForward,
    setAmountFunctionFastForward,
    readonlyInput,
    buttonGroupClass,
    fastBackwardClass,
    backwardClass,
    forwardClass,
    fastForwardClass,
    fastBackwardIcon = faStepBackward,
    backwardIcon = faBackward,
    forwardIcon = faForward,
    fastForwardIcon = faStepForward,
    styledInputClass,
    styledRootClass,
    fullWidth = false,
    buttonColor = {},
  } = props;

  const {
    fastBackwardColor = undefined,
    backwardColor,
    forwardColor,
    fastForwardColor,
  } = buttonColor;

  return (
    <ButtonGroup
      fullWidth={fullWidth}
      className={buttonGroupClass}
      size="small"
      aria-label="small outlined button group"
    >
      <Button
        color={fastBackwardColor}
        className={fastBackwardClass}
        onClick={setAmountFunctionFastBackward}
      >
        <FontAwesomeIcon icon={fastBackwardIcon} />
      </Button>
      <Button
        color={backwardColor}
        className={backwardClass}
        onClick={setAmountFunctionBackward}
      >
        <FontAwesomeIcon icon={backwardIcon} />
      </Button>
      <StyledInput
        classes={{
          input: styledInputClass,
          root: styledRootClass,
        }}
        readOnly={readonlyInput}
        value={`${amount}`}
      />
      <Button
        color={forwardColor}
        className={forwardClass}
        onClick={setAmountFunctionForward}
      >
        <FontAwesomeIcon icon={forwardIcon} />
      </Button>
      <Button
        color={fastForwardColor}
        className={fastForwardClass}
        onClick={setAmountFunctionFastForward}
      >
        <FontAwesomeIcon icon={fastForwardIcon} />
      </Button>
    </ButtonGroup>
  );
}

export default QuantitySelector;
