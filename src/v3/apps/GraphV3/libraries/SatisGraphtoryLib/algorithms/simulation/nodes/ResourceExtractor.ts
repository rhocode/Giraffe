import { getBuildingDefinition } from 'v3/data/loaders/buildings';
import { getRecipeDefinition } from 'v3/data/loaders/recipes';
import SimulatableConnection from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/SimulatableConnection';
import { getItemDefinition } from 'v3/data/loaders/items';
import { EResourceForm } from 'v3/types/enums';

export default class ResourceExtractor extends SimulatableConnection {
  constructor(recipeSlug: any, buildingSlug: any, clockSpeed = 100) {
    super();
    const recipe = getRecipeDefinition(recipeSlug);

    const building = getBuildingDefinition(buildingSlug);

    const cycleTime =
      building.extractCycleTime * 1000 * recipe.manufacturingDuration;
    const itemsPerCycle = building.itemsPerCycle;

    const outputGrouped = recipe.products.map((item: any) => {
      return {
        slug: item.slug,
        amount: item.amount * itemsPerCycle,
      };
    });

    if (outputGrouped.length > 1) {
      throw new Error('Unhandled multiple outputs');
    }

    for (const item of outputGrouped) {
      const { slug, amount } = item;
      const resourceForm = getItemDefinition(slug).form;
      if (resourceForm === EResourceForm.RF_SOLID) {
        for (let i = 0; i < amount; i++) {
          this.outputPacket.push({
            slug,
            amount: 1,
          });
        }
      } else if (resourceForm === EResourceForm.RF_LIQUID) {
        this.outputPacket.push({
          slug,
          amount: amount,
        });
      }
    }

    this.cycleTime = cycleTime / (clockSpeed / 100);
    this.outputSlot.push([]);
  }

  blocked = false;

  unblockCallback = (null as unknown) as any;

  handleEvent(evt: any, time: number, eventData: any) {
    switch (evt) {
      case 'DEPOSIT_OUTPUT':
        if (!this.blocked) {
          this.depositFunction(time);
        } else {
          this.unblockCallback = (time: number) => {
            this.depositFunction(time);
          };
        }
        break;
      case 'UNBLOCK':
        if (this.outputSlot[0].length === 0) {
          this.blocked = false;
          if (this.unblockCallback) {
            this.unblockCallback(time);
            this.unblockCallback = null;
          }
        }
        break;
      default:
        throw new Error('Unhandled event ' + evt);
    }
  }

  private depositFunction(time: number) {
    this.outputSlot[0].push(...this.outputPacket);

    this.outputs.forEach((output) => {
      this.simulationManager?.addTimerEvent({
        // TODO: should this not have a +1?
        time: time,
        event: {
          target: output.id,
          eventName: 'PULL',
          eventData: this.id,
        },
      });
    });
    this.simulationManager?.addTimerEvent({
      time: time + this.cycleTime,
      event: {
        target: this.id,
        eventName: 'DEPOSIT_OUTPUT',
        eventData: this.outputPacket,
      },
    });
    this.blocked = true;
  }

  runPreSimulationActions(): void {
    if (true) {
      // TODO: if this is powered
      this.simulationManager?.addTimerEvent({
        time: this.cycleTime,
        event: {
          target: this.id,
          eventName: 'DEPOSIT_OUTPUT',
          eventData: this.outputPacket,
        },
      });
    }
  }
}
