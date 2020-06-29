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
import { useStoreState } from 'pullstate';
import { graphWizardStore } from 'v3/apps/GraphV3/stores/graphAppStore';

const CustomOutlinedInput = ({
  color,
  disableElevation,
  disableRipple,
  disableFocusRipple,
  ...otherProps
}) => <OutlinedInput {...otherProps} />;
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

function QualitySelector(props) {
  const { stateId } = props;

  const storeData = useStoreState(
    graphWizardStore,
    (s) => {
      return s.products[stateId];
    },
    [stateId]
  );

  const { amount } = storeData;

  const setAmountFunction = (additionalAmount) => {
    return function () {
      graphWizardStore.update((state) => {
        state.products[stateId].amount = amount + additionalAmount;
      });
    };
  };

  return (
    <React.Fragment>
      <ButtonGroup size="small" aria-label="small outlined button group">
        <Button onClick={setAmountFunction(-10)}>
          <FontAwesomeIcon icon={faStepBackward} />
        </Button>
        <Button onClick={setAmountFunction(-1)}>
          <FontAwesomeIcon icon={faBackward} />
        </Button>
        <StyledInput value={`${amount}`} />
        <Button onClick={setAmountFunction(1)}>
          <FontAwesomeIcon icon={faForward} />
        </Button>
        <Button onClick={setAmountFunction(10)}>
          <FontAwesomeIcon icon={faStepForward} />
        </Button>
      </ButtonGroup>
    </React.Fragment>
  );
}

export default QualitySelector;
