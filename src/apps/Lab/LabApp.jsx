import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';
import { simpleAction } from '../../redux/actions/simpleAction';
import DatabaseEditor from './components/DatabaseEditor';
import recipes from '../../json/Recipe';
import items from '../../json/Items';
import machineclass from '../../json/MachineClass';
import schemas from '../../generated';
import testGraphQL from "../../graphql";

const styles = theme => {
  return {
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      minHeight: theme.overrides.GraphAppBar.height
    },
    container: {
      gridArea: 'body',
      display: "grid",
      gridTemplateAreas:
        `"fullHeight"`,
      gridTemplateRows: "1fr",
      gridTemplateColumns: "1fr",
    }
  };
};

// const CLIENT_ID = "735fd98a5386c1ab6210";
// const REDIRECT_URI = "http://localhost:3000/lab";

function replaceSpecial(item) {
  return item.replace(/\./g, '')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .replace(/-/g, '')
    .replace(/:/g, '');
}

class LabApp extends Component {
  state = {
    status: 'Logged out'
  };

  componentDidMount() {
    // this.processJSON();
    testGraphQL();
  }

  processJSON() {
    const itemsJSON = items.map(item => item.id).map(item => replaceSpecial(item)).sort();
    const mcJSON = machineclass.map(item => item.identifier).sort();
    const raJSON = recipes.map(item => item.alternateName).filter(item => item).map(item => replaceSpecial(item))
    const rnJSON = recipes.filter(item => !item.alternateName).map(item => item.name).map(item => replaceSpecial(item))

    if (raJSON.length !== new Set(raJSON).size) {
      console.error("AAAAASSSS");
    }

    if (rnJSON.length !== new Set(rnJSON).size) {
      console.error("AAAAA");
      console.error(rnJSON.sort())
    }

    let intersection = new Set(
      [...new Set(raJSON)].filter(x => new Set(rnJSON).has(x)));
    // console.log(intersection);


    const ItemEnumMap = {};
    const RecipeEnumMap = {};
    const MachineClassUnlockMap = {};

    let counter = 0;
    itemsJSON.forEach(item => {
      ItemEnumMap[item] = counter++;
    });

    counter = 0;
    mcJSON.forEach(mc => {
      MachineClassUnlockMap[mc] = counter++;
    });

    counter = 0;
    raJSON.forEach(r => {
      RecipeEnumMap[r] = counter++;
    });

    rnJSON.forEach(r => {
      RecipeEnumMap[r] = counter++;
    });

    const protobuf = require("protobufjs/light");

    const root = protobuf.Root.fromJSON(schemas["0.1.0"]);
    console.error(root);

    function saveAs(blob, fileName) {
      const url = window.URL.createObjectURL(blob);

      const anchorElem = document.createElement("a");
      // anchorElem.style = "display: none";
      anchorElem.href = url;
      anchorElem.download = fileName;

      document.body.appendChild(anchorElem);
      anchorElem.click();
      document.body.removeChild(anchorElem);

      // On Edge, revokeObjectURL should be called only after
      // a.click() has completed, atleast on EdgeHTML 15.15048
      setTimeout(function() {
        window.URL.revokeObjectURL(url);
      }, 1000);
    }


    // const ItemData = root.lookupType("ItemData");
    //
    // const itemsList = items.map(item => {
    //   const processedName = replaceSpecial(item.id);
    //   const num = ItemEnumMap[processedName];
    //   const data = {
    //     id: num,
    //     name: item.id,
    //     icon: null,
    //     hidden: false
    //   };
    //   return ItemData.fromObject(data);
    // });
    //
    // const ItemList = root.lookupType("ItemList");
    // const encoding = ItemList.encode(ItemList.fromObject({data: itemsList})).finish();
    // const ItemListBlob = new Blob([encoding], {type: "application/octet-stream"});
    // new Response(ItemListBlob).arrayBuffer().then(buffer => new Uint8Array(buffer)).then((buffer) => {
    //   ItemList.decode(buffer);
    //   saveAs(ItemListBlob, "ItemList.s2");
    // });
    //
    //
    //
    //

    const MachineClassData = root.lookupType("MachineClassData");

    function processUpgradeLevels(level, solo=false) {
      if (solo) {
        return 17;
      } else {
        switch(level.upgradeTier) {
          case 'mk1':
            return 0;
          case 'mk2':
            return 1;
          case 'mk3':
            return 2;
          case 'mk4':
            return 3;
          case 'mk5':
            return 4;
          default:
            return -1;
        }
      }
    }

    const machineClassList = [];

    machineclass.forEach(item => {
      const machineNum = MachineClassUnlockMap[item.identifier];
      const one =  item.upgradeLevels.length === 1;
      item.upgradeLevels.forEach((level, index) => {
        const data = {
          id: machineNum,
          name: item.identifier,
          tier: processUpgradeLevels(level, one),
          icon: null,
          inputs: parseInt(item.inputs),
          outputs: parseInt(item.outputs),
          power: 300,
          hidden: false,
          localOrdering: index
        };
        machineClassList.push(MachineClassData.fromObject(data));
      })
    });

    const MachineClassList = root.lookupType("MachineClassList");
    const MCEncoding = MachineClassList.encode(MachineClassList.fromObject({data: machineClassList})).finish();
    const MachineClassBlob = new Blob([MCEncoding], {type: "application/octet-stream"});
    new Response(MachineClassBlob).arrayBuffer().then(buffer => new Uint8Array(buffer)).then((buffer) => {
      MachineClassList.decode(buffer);
      saveAs(MachineClassBlob, "MachineClassList.s2");
    });














    // const RecipeData = root.lookupType("RecipeData");
    //
    // function processResourcePacket(packet) {
    //   const processedName = replaceSpecial(packet.itemId);
    //   return {item: ItemEnumMap[processedName], itemQuantity: parseInt(packet.itemQty)}
    // }
    // const recipeList = recipes.map(item => {
    //   console.error(item);
    //
    //   if (item.alternateName) {
    //     const id = RecipeEnumMap[replaceSpecial(item.alternateName)];
    //     const machineNum = MachineClassUnlockMap[item.machineClass];
    //     return  {
    //       id,
    //       name: item.alternateName,
    //       machineClass: machineNum,
    //       input: item.input.map(item => processResourcePacket(item)),
    //       output: [processResourcePacket({itemId: item.outputItemId, itemQty: item.outputItemQuantity})],
    //       hidden: false,
    //       alt: true
    //     };
    //   } else {
    //     const id = RecipeEnumMap[replaceSpecial(item.name)];
    //     const machineNum = MachineClassUnlockMap[item.machineClass];
    //     return  {
    //       id,
    //       name: item.name,
    //       machineClass: machineNum,
    //       input: item.input.map(item => processResourcePacket(item)),
    //       output: [processResourcePacket({itemId: item.outputItemId, itemQty: item.outputItemQuantity})],
    //       hidden: false
    //     };
    //   }
    // });
    //
    // console.error(recipeList);
    // const RecipeList = root.lookupType("RecipeList");
    // const RCEncoding = RecipeList.encode(RecipeList.fromObject({data: recipeList})).finish();
    // const RDBlob = new Blob([RCEncoding], {type: "application/octet-stream"});
    // new Response(RDBlob).arrayBuffer().then(buffer => new Uint8Array(buffer)).then((buffer) => {
    //   RecipeList.decode(buffer);
    //   saveAs(RDBlob, "RecipeList.s2");
    // })
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        {/*<Button variant="contained" color="primary" href={`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user&redirect_uri=${REDIRECT_URI}`}>*/}
        {/*  Log in button: this state is: {this.state.status};*/}
        {/*</Button>*/}
        {/*<DatabaseEditor />*/}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  simpleAction: () => dispatch(simpleAction())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(LabApp));
