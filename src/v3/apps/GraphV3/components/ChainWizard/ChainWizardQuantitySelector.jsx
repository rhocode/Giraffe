import { useStoreState } from "pullstate";
import React from "react";
import QuantitySelector from "v3/apps/GraphV3/components/QuantitySelector/QuantitySelector";
import { graphWizardStore } from "v3/apps/GraphV3/stores/graphAppStore";

// const useStyles = makeStyles(() =>
//   createStyles({
//     styledInput: {
//       width: 200
//     },
//   })
// );

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

  // const classes = useStyles();

  const setAmountFunction = (additionalAmount) => {
    return function () {
      graphWizardStore.update((state) => {
        if (amount + additionalAmount < 0) {
          state.products[stateId].amount = 0;
        } else {
          state.products[stateId].amount = amount + additionalAmount;
        }
      });
    };
  };

  return (
    <QuantitySelector
      setAmountFunctionFastBackward={setAmountFunction(-10)}
      setAmountFunctionBackward={setAmountFunction(-1)}
      setAmountFunctionForward={setAmountFunction(1)}
      setAmountFunctionFastForward={setAmountFunction(10)}
      amount={amount}
      // styledInputClass={classes.styledInput}
    />
  );
}

export default QualitySelector;
