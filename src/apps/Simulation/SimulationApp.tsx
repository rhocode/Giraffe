import React from 'react';
// import Belt from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/edges/Belt";
// import ResourceExtractor
//   from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/nodes/ResourceExtractor";
// import {getExtractorRecipes, getRecipesByMachineType} from "v3/data/loaders/recipes";
import { getExtractorRecipes } from 'v3/data/loaders/recipes';
// import Manufacturer from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/nodes/Manufacturer";
import SimulationManager from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/manager/SimulationManager';
// import DebugSink from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/nodes/DebugSink";
// import Merger from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/nodes/Merger";
// import Splitter from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/nodes/Splitter";
import FluidResourceExtractor from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/nodes/FluidResourceExtractor';
import Pipe from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/edges/Pipe';
import Chart from 'react-apexcharts';
// import {makeStyles} from "@material-ui/core/styles";

// const useStyles = makeStyles((theme) => ({
//   graph: {
//     color: "white"
//   }
// }));

function SimulationApp() {
  React.useEffect(() => {
    // const possibleRecipes = getRecipesByMachineType('EXTRACTOR');
    // const usedRecipe = possibleRecipes[4];
    // const building = usedRecipe.producedIn[0];

    const rec = getExtractorRecipes();
    console.log(rec);

    // const resourceExtractor = new ResourceExtractor(usedRecipe.slug, building);
    //
    // const resourceExtractor2 = new ResourceExtractor(usedRecipe.slug, building);

    const liquidResourceExtractor = new FluidResourceExtractor(
      'recipe-normal-liquid-oil',
      'building-oil-pump'
    );

    // const belt = new Belt(600);
    // const belt2 = new Belt(600);
    // const belt3 = new Belt(600);
    // const belt4 = new Belt(600);
    // const belt5 = new Belt(1200);
    //
    // const manufacturer = new Manufacturer("recipe-ingot-iron", "building-smelter-mk1");
    // const manufacturer2 = new Manufacturer("recipe-ingot-iron", "building-smelter-mk1");
    //
    // const debugSink = new DebugSink();
    // const debugSink2 = new DebugSink();
    // const debugSink3 = new DebugSink();
    // const merger = new Merger();
    // const splitter = new Splitter();

    const pipe1 = new Pipe();

    const simulationManager = new SimulationManager();

    // resourceExtractor.attachSimulationManager(simulationManager);
    // belt.attachSimulationManager(simulationManager);
    // manufacturer.attachSimulationManager(simulationManager);
    // belt2.attachSimulationManager(simulationManager);
    // resourceExtractor2.attachSimulationManager(simulationManager);
    // manufacturer2.attachSimulationManager(simulationManager);
    // belt3.attachSimulationManager(simulationManager);
    // belt4.attachSimulationManager(simulationManager);
    // belt5.attachSimulationManager(simulationManager);
    // debugSink.attachSimulationManager(simulationManager);
    // debugSink2.attachSimulationManager(simulationManager);
    // debugSink3.attachSimulationManager(simulationManager);
    // merger.attachSimulationManager(simulationManager);
    // splitter.attachSimulationManager(simulationManager);
    liquidResourceExtractor.attachSimulationManager(simulationManager);
    pipe1.attachSimulationManager(simulationManager);
    simulationManager.addLink(liquidResourceExtractor, pipe1);

    // simulationManager.addLink(resourceExtractor, belt);
    // simulationManager.addLink(belt, manufacturer);
    // simulationManager.addLink(manufacturer, belt2);
    //
    // simulationManager.addLink(resourceExtractor2, belt3);
    // simulationManager.addLink(belt3, manufacturer2);
    // simulationManager.addLink(manufacturer2, belt4);
    //
    // simulationManager.addLink(belt4, merger);
    // simulationManager.addLink(belt2, merger);
    //
    // simulationManager.addLink(merger, belt5);
    // simulationManager.addLink(belt5, debugSink);

    // simulationManager.addLink(resourceExtractor, belt);

    // // Test for splitter
    // simulationManager.addLink(resourceExtractor, belt);
    // simulationManager.addLink(belt, splitter);
    // simulationManager.addLink(splitter, belt2);
    // simulationManager.addLink(splitter, belt3);
    // simulationManager.addLink(splitter, belt4);
    // simulationManager.addLink(belt2, debugSink);
    // simulationManager.addLink(belt3, debugSink2);
    // simulationManager.addLink(belt4, debugSink3);

    simulationManager.prepare();
    //
    // simulationManager?.addTimerEvent({
    //   time: 8000,
    //   event: {
    //     target: belt.id,
    //     eventName: 'UNBLOCK'
    //   }
    // })

    for (let x = 0; x < 1000; x++) {
      simulationManager.tick();
    }

    // for (let dt = 0; dt < toMs(2) + 200 ; dt+= 50) {
    //   resourceExtractor.simulate(50, dt)
    //   // belt.simulate(50, dt)
    //   // manufacturer.simulate(50, dt);
    // }
    //
    // //
    // for (let dt = toMs(2) + 200; dt < toMs(8) ; dt+= 50) {
    //   resourceExtractor.simulate(50, dt)
    //   belt.simulate(50, dt);
    //   manufacturer.simulate(50, dt);
    // }
  });

  const [chart] = React.useState({
    series: [
      {
        name: 'Bob',
        data: [
          {
            x: 'Design',
            y: [
              new Date('2019-03-05').getTime(),
              new Date('2019-03-08').getTime(),
            ],
          },
          {
            x: 'Code',
            y: [
              new Date('2019-03-02').getTime(),
              new Date('2019-03-05').getTime(),
            ],
          },
          {
            x: 'Code',
            y: [
              new Date('2019-03-05').getTime(),
              new Date('2019-03-07').getTime(),
            ],
          },
          {
            x: 'Test',
            y: [
              new Date('2019-03-03').getTime(),
              new Date('2019-03-09').getTime(),
            ],
          },
          {
            x: 'Test',
            y: [
              new Date('2019-03-08').getTime(),
              new Date('2019-03-11').getTime(),
            ],
          },
          {
            x: 'Validation',
            y: [
              new Date('2019-03-11').getTime(),
              new Date('2019-03-16').getTime(),
            ],
          },
          {
            x: 'Design',
            y: [
              new Date('2019-03-01').getTime(),
              new Date('2019-03-03').getTime(),
            ],
          },
        ],
      },
      {
        name: 'Joe',
        data: [
          {
            x: 'Design',
            y: [
              new Date('2019-03-02').getTime(),
              new Date('2019-03-05').getTime(),
            ],
          },
          {
            x: 'Test',
            y: [
              new Date('2019-03-06').getTime(),
              new Date('2019-03-16').getTime(),
            ],
          },
          {
            x: 'Code',
            y: [
              new Date('2019-03-03').getTime(),
              new Date('2019-03-07').getTime(),
            ],
          },
          {
            x: 'Deployment',
            y: [
              new Date('2019-03-20').getTime(),
              new Date('2019-03-22').getTime(),
            ],
          },
          {
            x: 'Design',
            y: [
              new Date('2019-03-10').getTime(),
              new Date('2019-03-16').getTime(),
            ],
          },
        ],
      },
      {
        name: 'Dan',
        data: [
          {
            x: 'Code',
            y: [
              new Date('2019-03-10').getTime(),
              new Date('2019-03-17').getTime(),
            ],
          },
          {
            x: 'Validation',
            y: [
              new Date('2019-03-05').getTime(),
              new Date('2019-03-09').getTime(),
            ],
          },
        ],
      },
    ],
    options: {
      chart: {
        height: 450,
        type: 'rangeBar',
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '80%',
        },
      },
      xaxis: {
        type: 'datetime',
        labels: {
          style: {
            colors: ['#FFFFFF'],
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: ['#FFFFFF'],
          },
        },
      },
      stroke: {
        width: 1,
      },
      fill: {
        type: 'solid',
        opacity: 0.6,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        labels: {
          colors: ['#FFFFFF'],
        },
      },
    },
  });

  // const styles = useStyles();

  return (
    <div>
      <Chart
        options={chart.options}
        series={chart.series}
        type="rangeBar"
        width={1000}
        height={500}
      />
      ;
    </div>
  );
}

export default SimulationApp;
