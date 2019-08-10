import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';
import { simpleAction } from '../../redux/actions/simpleAction';
// import DatabaseEditor from './components/DatabaseEditor';
import recipes from '../../json/Recipe';
import items from '../../json/Items';
import machineclass from '../../json/MachineClass';
import schemas from '../../generated';
// import testGraphQL from "../../graphql";
// import DatabaseEditor from "./components/DatabaseEditor";

const styles = theme => {
  return {
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      minHeight: theme.overrides.GraphAppBar.height
    },
    container: {
      gridArea: 'body',
      display: 'grid',
      gridTemplateAreas: `"fullHeight"`,
      gridTemplateRows: '1fr',
      gridTemplateColumns: '1fr'
    }
  };
};

// const CLIENT_ID = "735fd98a5386c1ab6210";
// const REDIRECT_URI = "http://localhost:3000/lab";

function replaceSpecial(item) {
  return item
    .replace(/\./g, '')
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
    this.processJSON();
    // testGraphQL();
  }

  generateResources() {
    const DefaultJSON = {
      isAltRecipe: false,
      machineClass: 'miner',
      name: 'nuclear_fuel_rod',
      outputItemId: 'nuclear_fuel_rod',
      outputItemQuantity: '1',
      input: []
    };

    //30, 60, 120
    const normalResources = [
      'bauxite',
      'caterium_ore',
      'coal',
      'copper_ore',
      'crude_oil',
      'iron_ore',
      'limestone',
      'raw_quartz',
      'sam_ore',
      'sulfur',
      'uranium'
    ];
    const list = [];
    const purities = ['impure', 'normal', 'pure'];
    normalResources.forEach(resource => {
      purities.forEach(purity => {
        const doc = JSON.parse(JSON.stringify(DefaultJSON));

        doc.time = '1';

        if (resource === 'crude_oil') {
          doc.machineClass = 'oil_pump';
          doc.time = '0.5';
        }

        doc.name = purity + '_' + resource + '_node';
        doc.id = purity + '_' + resource + '_node';
        doc.outputItemId = resource;

        list.push(doc);
      });
    });
    return list;
  }

  processJSON() {
    // don't add it since it's already added
    // recipes.push(...this.generateResources());
    // console.error(JSON.stringify(recipes, null, 2));

    const itemsJSON = items
      .map(item => item.id)
      .map(item => replaceSpecial(item))
      .sort();
    const mcJSON = machineclass.map(item => item.identifier).sort();
    const raJSON = recipes
      .map(item => item.alternateName)
      .filter(item => item)
      .map(item => replaceSpecial(item));
    const rnJSON = recipes
      .filter(item => !item.alternateName)
      .map(item => item.name)
      .map(item => replaceSpecial(item));

    if (raJSON.length !== new Set(raJSON).size) {
      console.error('AAAAASSSS');
    }

    if (rnJSON.length !== new Set(rnJSON).size) {
      console.error('AAAAAB');
      console.error(rnJSON.sort(), new Set(rnJSON).size);
    }

    // let intersection = new Set(
    //   [...new Set(raJSON)].filter(x => new Set(rnJSON).has(x)));
    // console.log(intersection);

    const ItemEnumMap = {};
    const RecipeEnumMap = {};
    const MachineClassUnlockMap = {};

    let counter = 0;
    itemsJSON.forEach(item => {
      ItemEnumMap[item] = counter++;
    });
    console.error(machineclass, 'AAAAA');
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

    //nested OUTPUT
    // console.error(JSON.stringify(RecipeEnumMap));

    const protobuf = require('protobufjs/light');

    const root = protobuf.Root.fromJSON(schemas['0.1.0']);

    // console.error(root);

    function saveAs(blob, fileName) {
      const url = window.URL.createObjectURL(blob);

      const anchorElem = document.createElement('a');
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

    const ItemData = root.lookupType('ItemData');

    const itemsList = items.map(item => {
      const processedName = replaceSpecial(item.id);
      const num = ItemEnumMap[processedName];
      const data = {
        id: num,
        name: item.id,
        icon: null,
        hidden: false
      };
      return ItemData.fromObject(data);
    });

    const ItemList = root.lookupType('ItemList');
    const encoding = ItemList.encode(
      ItemList.fromObject({ data: itemsList })
    ).finish();
    const ItemListBlob = new Blob([encoding], {
      type: 'application/octet-stream'
    });
    new Response(ItemListBlob)
      .arrayBuffer()
      .then(buffer => new Uint8Array(buffer))
      .then(buffer => {
        ItemList.decode(buffer);
        console.error(ItemList.decode(buffer));
        saveAs(ItemListBlob, 'ItemList.s2');
      });

    const MachineClassData = root.lookupType('MachineClassData');

    function processUpgradeLevels(level, solo = false) {
      if (solo) {
        return 0;
      } else {
        switch (level.upgradeTier) {
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

    function processTime(level, machineNum) {
      let baseSpeed = 0.5;
      switch (machineNum) {
        case 'miner':
          //5, 12, 30
          switch (level.upgradeTier) {
            case 'mk1':
              return baseSpeed;
            case 'mk2':
              return baseSpeed * 2;
            case 'mk3':
              return baseSpeed * 4;
            default:
              return baseSpeed;
          }
        case 'smelter':
          //4, 8
          switch (level.upgradeTier) {
            case 'mk1':
              return 1;
            case 'mk2':
              return 1.5;
            default:
              return 1;
          }
        case 'foundry':
          //16, 38
          switch (level.upgradeTier) {
            case 'mk1':
              return 1;
            case 'mk2':
              return 1.25;
            default:
              return 1;
          }
        case 'constructor':
          //4, 8
          switch (level.upgradeTier) {
            case 'mk1':
              return 1;
            case 'mk2':
              return 1.5;
            default:
              return 1;
          }
        case 'assembler':
          //15
          switch (level.upgradeTier) {
            case 'mk1':
              return 1;
            case 'mk2':
              return 1.5;
            default:
              return 1;
          }
        case 'manufacturer':
          //55
          switch (level.upgradeTier) {
            case 'mk1':
              return 1;
            case 'mk2':
              return 1.5;
            default:
              return 1;
          }
        case 'oil_pump':
          //40
          switch (level.upgradeTier) {
            case 'mk1':
              return 0.5;
            case 'mk2':
              return 1.5;
            default:
              return 1;
          }
        case 'oil_refinery':
          //50
          switch (level.upgradeTier) {
            case 'mk1':
              return 1;
            case 'mk2':
              return 1.5;
            default:
              return 1;
          }
        case 'hadron_collider':
          //750
          switch (level.upgradeTier) {
            case 'mk1':
              return 1;
            case 'mk2':
              return 1.5;
            default:
              return 1;
          }
        case 'quantum_encoder':
          //40
          switch (level.upgradeTier) {
            case 'mk1':
              return 1;
            case 'mk2':
              return 1.5;
            default:
              return 1;
          }
        default:
          return null;
      }
    }

    function processPower(level, machineNum) {
      switch (machineNum) {
        case 'miner':
          //5, 12, 30
          switch (level.upgradeTier) {
            case 'mk1':
              return 15;
            case 'mk2':
              return 12;
            case 'mk3':
              return 30;
            default:
              return 15;
          }
        case 'smelter':
          //4, 8
          switch (level.upgradeTier) {
            case 'mk1':
              return 4;
            case 'mk2':
              return 8;
            default:
              return 4;
          }
        case 'foundry':
          //16, 38
          switch (level.upgradeTier) {
            case 'mk1':
              return 16;
            case 'mk2':
              return 38;
            default:
              return 16;
          }
        case 'constructor':
          //4, 8
          switch (level.upgradeTier) {
            case 'mk1':
              return 4;
            case 'mk2':
              return 8;
            default:
              return 4;
          }
        case 'assembler':
          //15
          switch (level.upgradeTier) {
            case 'mk1':
              return 15;
            case 'mk2':
              return 15;
            default:
              return 15;
          }
        case 'manufacturer':
          //55
          switch (level.upgradeTier) {
            case 'mk1':
              return 55;
            case 'mk2':
              return 55;
            default:
              return 55;
          }
        case 'oil_pump':
          //40
          switch (level.upgradeTier) {
            case 'mk1':
              return 40;
            case 'mk2':
              return 40;
            default:
              return 40;
          }
        case 'oil_refinery':
          //50
          switch (level.upgradeTier) {
            case 'mk1':
              return 50;
            case 'mk2':
              return 50;
            default:
              return 50;
          }
        case 'hadron_collider':
          //750
          switch (level.upgradeTier) {
            case 'mk1':
              return 750;
            case 'mk2':
              return 750;
            default:
              return 750;
          }
        case 'quantum_encoder':
          //40
          switch (level.upgradeTier) {
            case 'mk1':
              return 40;
            case 'mk2':
              return 40;
            default:
              return 40;
          }
        default:
          return null;
      }
    }

    const machineClassList = [];

    machineclass.forEach(item => {
      const machineNum = MachineClassUnlockMap[item.identifier];
      const one = item.upgradeLevels.length === 1;
      item.upgradeLevels.forEach((level, index) => {
        const data = {
          id: machineNum,
          name: item.identifier,
          tier: processUpgradeLevels(level, one),
          speed: processTime(level, item.identifier),
          icon: null,
          inputs: parseInt(item.inputs),
          outputs: parseInt(item.outputs),
          power: processPower(level, item.identifier),
          hidden: false,
          localOrdering: index
        };
        machineClassList.push(MachineClassData.fromObject(data));
      });
    });

    const MachineClassList = root.lookupType('MachineClassList');
    const MCEncoding = MachineClassList.encode(
      MachineClassList.fromObject({ data: machineClassList })
    ).finish();
    const MachineClassBlob = new Blob([MCEncoding], {
      type: 'application/octet-stream'
    });
    new Response(MachineClassBlob)
      .arrayBuffer()
      .then(buffer => new Uint8Array(buffer))
      .then(buffer => {
        MachineClassList.decode(buffer);
        saveAs(MachineClassBlob, 'MachineClassList.s2');
      });

    function processResourcePacket(packet) {
      const processedName = replaceSpecial(packet.itemId);
      return {
        item: ItemEnumMap[processedName],
        itemQuantity: parseInt(packet.itemQty)
      };
    }

    const recipeList = recipes.map(item => {
      if (item.alternateName) {
        const id = RecipeEnumMap[replaceSpecial(item.alternateName)];
        const machineNum = MachineClassUnlockMap[item.machineClass];
        return {
          id,
          name: item.alternateName,
          machineClass: machineNum,
          time: parseFloat(item.time),
          input: item.input.map(item => processResourcePacket(item)),
          output: [
            processResourcePacket({
              itemId: item.outputItemId,
              itemQty: item.outputItemQuantity
            })
          ],
          hidden: false,
          alt: true
        };
      } else {
        const id = RecipeEnumMap[replaceSpecial(item.name)];
        const machineNum = MachineClassUnlockMap[item.machineClass];
        return {
          id,
          name: item.name,
          machineClass: machineNum,
          time: parseFloat(item.time),
          input: item.input.map(item => processResourcePacket(item)),
          output: [
            processResourcePacket({
              itemId: item.outputItemId,
              itemQty: item.outputItemQuantity
            })
          ],
          hidden: false
        };
      }
    });

    function humanize(str) {
      const frags = str.split('_');
      for (let i = 0; i < frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
      }
      return frags.join(' ');
    }

    const z = {};
    recipeList
      .map(item => item.name)
      .forEach(item => {
        z[item] = humanize(item);
      });

    console.error(JSON.stringify(z, null, 2), 'AAAAAAAA');

    //   var frags = str.split('_');
    //   for (let i=0; i<frags.length; i++) {
    //     frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    //   }
    //   return frags.join(' ');
    // }

    const RecipeList = root.lookupType('RecipeList');
    const RCEncoding = RecipeList.encode(
      RecipeList.fromObject({ data: recipeList })
    ).finish();
    const RDBlob = new Blob([RCEncoding], { type: 'application/octet-stream' });
    new Response(RDBlob)
      .arrayBuffer()
      .then(buffer => new Uint8Array(buffer))
      .then(buffer => {
        console.error(RecipeList.decode(buffer));
        saveAs(RDBlob, 'RecipeList.s2');
      });
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
