import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import QuantitySelector from "v3/apps/GraphV3/components/QuantitySelector/QuantitySelector";
import MouseState from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/enums/MouseState";
import { PixiJSCanvasContext } from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/react/PixiJSCanvas/PixiJsCanvasContext";
import { pixiJsStore } from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore";
import { LocaleContext } from "v3/components/LocaleProvider";
import {
  getBuildableConnectionClasses,
  getBuildableConnections,
  getBuildingIcon,
  getUpgradesForConnectionClass,
} from "v3/data/loaders/buildings";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      bottom: "2em",
      left: "2em",
      position: "absolute",
      width: 340,
      minHeight: 100,
      zIndex: theme.zIndex.drawer + 1,
      pointerEvents: "auto",
      flexDirection: "column",
      flexGrow: 1,
    },
    title: {
      fontSize: 14,
    },
    type: {
      paddingBottom: 10,
      marginBottom: 10,
    },
    buttons: {
      paddingTop: 10,
      marginTop: 10,
    },
    buttonText: {
      width: 700,
    },
    markSelectorInput: {
      width: 100,
    },
    inputRoot: {
      minWidth: 100,
    },
    selectorImage: {
      height: 17,
      width: 17,
      paddingRight: 5,
      paddingLeft: 5,
    },
    selectorText: {},
    horizontalAlign: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
  };
});

function EdgeSelectorPanel() {
  const classes = useStyles();

  const connectionClasses = getBuildableConnectionClasses();

  const { translate } = React.useContext(LocaleContext);

  const [selectedEdgeType, setSelectedEdgeType] = React.useState(
    connectionClasses[0]
  );

  const [selectedEdgeTier, setSelectedEdgeTierFunc] = React.useState("");
  const [showTierSelector, setShowTierSelector] = React.useState(false);

  const { pixiCanvasStateId, mouseState } = React.useContext(
    PixiJSCanvasContext
  );

  const setSelectedEdgeTier = React.useCallback(
    (newVal) => {
      setSelectedEdgeTierFunc(newVal);
      pixiJsStore.update((s) => {
        s[pixiCanvasStateId].selectedEdge = newVal;
      });
    },
    [pixiCanvasStateId]
  );

  const tierSelector = React.useCallback(
    (direction) => {
      const possibleUpgrades = getUpgradesForConnectionClass(selectedEdgeType);
      const currentIndex = possibleUpgrades.indexOf(selectedEdgeTier);
      const totalIndexes = possibleUpgrades.length;
      switch (direction) {
        case -100:
          if (currentIndex === 0) return;
          setSelectedEdgeTier(possibleUpgrades[0]);
          break;
        case -1:
          if (currentIndex === 0) return;
          setSelectedEdgeTier(possibleUpgrades[currentIndex - 1]);
          break;
        case 1:
          if (currentIndex === totalIndexes - 1) return;
          setSelectedEdgeTier(possibleUpgrades[currentIndex + 1]);
          break;
        case 100:
          if (currentIndex === totalIndexes - 1) return;
          setSelectedEdgeTier(possibleUpgrades[totalIndexes - 1]);
          break;
        default:
          throw new Error("Unsupported direction " + direction);
      }
    },
    [selectedEdgeTier, selectedEdgeType, setSelectedEdgeTier]
  );

  React.useEffect(() => {
    const possibleUpgrades = getUpgradesForConnectionClass(selectedEdgeType);
    if (possibleUpgrades) {
      setSelectedEdgeTier(possibleUpgrades[0]);
      setShowTierSelector(true);
    } else {
      setSelectedEdgeTier(selectedEdgeType);
      setShowTierSelector(false);
    }
  }, [selectedEdgeType, setSelectedEdgeTier]);

  if (mouseState !== MouseState.LINK) {
    return null;
  }

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          Connection Selector Settings
        </Typography>
        <div className={classes.type}>
          <FormControl className={classes.formControl} fullWidth>
            <InputLabel id="type-select-label">Type</InputLabel>
            <Select
              labelId="type-select-label"
              id="type-select"
              value={selectedEdgeType}
              onChange={(evt) => {
                const newValue = evt.target.value;
                setSelectedEdgeType(newValue);
              }}
            >
              {connectionClasses.map((className) => {
                const image = getBuildableConnections().connectionClassImageMap.get(
                  className
                );

                return (
                  <MenuItem key={className} value={className}>
                    <div className={classes.horizontalAlign}>
                      <img
                        className={classes.selectorImage}
                        alt={className}
                        src={getBuildingIcon(image, 256)}
                      />
                      <div className={classes.selectorText}>
                        {translate(className)}
                      </div>
                    </div>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        {/*<div className={classes.buttons}>*/}
        {/*<ButtonGroup fullWidth>*/}
        {/*  <Button color="secondary" className={classes.iconButton}>*/}
        {/*    <FastRewindIcon />*/}
        {/*  </Button>*/}
        {/*  <Button color="secondary" className={classes.iconButton}>*/}
        {/*    <RemoveIcon />*/}
        {/*  </Button>*/}
        {/*  <Button*/}
        {/*    disableRipple*/}
        {/*    disableFocusRipple*/}
        {/*    disableTouchRipple*/}
        {/*    className={classes.buttonText}*/}
        {/*  >*/}
        {/*    Mark 1*/}
        {/*  </Button>*/}
        {/*  <Button color="primary" className={classes.iconButton}>*/}
        {/*    <AddIcon />*/}
        {/*  </Button>*/}
        {/*  <Button color="primary" className={classes.iconButton}>*/}
        {/*    <FastForwardIcon />*/}
        {/*  </Button>*/}
        {/*</ButtonGroup>*/}
        {/*</div>*/}
        {showTierSelector ? (
          <div className={classes.buttons}>
            <QuantitySelector
              fullWidth
              readonlyInput
              setAmountFunctionFastBackward={() => {
                tierSelector(-100);
              }}
              setAmountFunctionBackward={() => {
                tierSelector(-1);
              }}
              setAmountFunctionForward={() => {
                tierSelector(1);
              }}
              setAmountFunctionFastForward={() => {
                tierSelector(100);
              }}
              amount={translate("tier-selector-" + selectedEdgeTier)}
              buttonColor={{
                fastBackwardColor: "secondary",
                backwardColor: "secondary",
                forwardColor: "primary",
                fastForwardColor: "primary",
              }}
              styledInputClass={classes.markSelectorInput}
              styledRootClass={classes.inputRoot}
              // styledInputClass={classes.styledInput}
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default EdgeSelectorPanel;
