import { getRecipeDefinition } from 'v3/data/loaders/recipes';
import { getBuildingDefinition } from 'v3/data/loaders/buildings';
import SimulatableConnection from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/algorithms/simulation/SimulatableConnection';

export default class Manufacturer extends SimulatableConnection {
  private recipeIngredientMap = new Map<string, number>();
  private recipeRemainingMap = new Map<string, number>();

  constructor(recipeSlug: any, buildingSlug: any, clockSpeed = 100) {
    super();
    const recipe = getRecipeDefinition(recipeSlug);

    const building = getBuildingDefinition(buildingSlug);

    const cycleTime =
      1000 * recipe.manufacturingDuration * building.manufacturingSpeed;

    const outputGrouped = recipe.products.map((item: any) => {
      return {
        slug: item.slug,
        amount: item.amount,
      };
    });

    if (outputGrouped.length > 1) {
      throw new Error('Unhandled multiple outputs');
    }

    for (const item of outputGrouped) {
      const { slug, amount } = item;

      for (let i = 0; i < amount; i++) {
        this.outputPacket.push({
          slug,
          amount: 1,
        });
      }
    }

    this.cycleTime = cycleTime / (clockSpeed / 100);
    recipe.ingredients.forEach(
      ({ slug, amount }: { slug: string; amount: number }) => {
        this.recipeIngredientMap.set(slug, amount);
        this.recipeRemainingMap.set(slug, amount);
      }
    );

    // TODO: replace this with the correct number of slots
    this.outputSlot.push([]);
  }

  inputBlocked = false;
  inputBlockedCallbacks = ([] as unknown) as any[];

  processing = false;
  depositCallbacks = ([] as unknown) as any[];

  outputBlocked = false;
  outputBlockedCallbacks = ([] as unknown) as any[];

  handleEvent(evt: any, time: number, eventData: any) {
    console.log('Handling Manufacturer event');
    switch (evt) {
      case 'UNBLOCK':
        if (this.outputSlot[0].length === 0 && this.outputBlocked) {
          this.outputBlocked = false;
          for (const func of this.outputBlockedCallbacks) {
            func(time);
          }
          this.outputBlockedCallbacks = [];
        }
        break;
      case 'DEPOSIT_OUTPUT':
        const depositFunction = (time: number) => {
          this.outputSlot[0].push(...this.outputPacket);
          this.outputBlocked = true;
          this.processing = false;

          for (const func of this.depositCallbacks) {
            func(time);
          }
          this.depositCallbacks = [];

          this.outputs.forEach((output) => {
            this.simulationManager?.addTimerEvent({
              time: time,
              event: {
                target: output.id,
                eventName: 'PULL',
              },
            });
          });
        };
        if (this.outputBlocked) {
          this.outputBlockedCallbacks.push(depositFunction);
        } else {
          depositFunction(time);
        }
        break;
      case 'START_CYCLE':
        const inputBlockedCallbacksCopy = [...this.inputBlockedCallbacks];
        this.inputBlockedCallbacks = [];
        this.processing = true;
        this.inputBlocked = false;

        this.simulationManager?.addTimerEvent({
          time: time + this.cycleTime,
          event: {
            target: this.id,
            eventName: 'DEPOSIT_OUTPUT',
          },
        });

        // This is done so that if any of these callback functions are blocked we can still
        // let them mutate inputBlockedCallbacks.
        for (const func of inputBlockedCallbacksCopy) {
          func(time);
        }
        break;
      case 'PULL':
        const pullFunction = (time: number, eventData: any) => {
          const referencedInput = this.inputs.find(
            (item) => item.id === eventData
          );
          if (!referencedInput)
            throw new Error('Referenced input does not exist');

          const referencedOutputSlot = referencedInput.getOutputSlot(this.id);

          if (referencedOutputSlot.length === 0) {
            throw new Error('Called pull with no output items');
          }

          const { slug } = referencedOutputSlot[0]!;

          const remaining = this.recipeRemainingMap.get(slug);

          if (remaining === undefined) {
            throw new Error('no recipe using ' + slug);
          }

          if (remaining - 1 < 0) {
            throw new Error('Somehow negative');
          }

          if (remaining === 0) {
            // add this pullFunction to queue
            this.inputBlockedCallbacks.push((time: number) => {
              pullFunction(time, eventData);
            });
          } else {
            referencedOutputSlot.shift();

            this.simulationManager?.addTimerEvent({
              time: time,
              event: {
                target: referencedInput.id,
                eventName: 'UNBLOCK',
              },
            });

            this.recipeRemainingMap.set(slug, remaining - 1);

            let recipeCompleted = true;
            this.recipeRemainingMap.forEach((value) => {
              if (value > 0) {
                recipeCompleted = false;
              }
            });

            if (recipeCompleted) {
              this.resetRecipeRemainingMap();
              this.inputBlocked = true;

              const startCycleFunction = (time: number) => {
                this.simulationManager?.addTimerEvent({
                  time: time,
                  event: {
                    target: this.id,
                    eventName: 'START_CYCLE',
                  },
                });
              };
              if (this.processing) {
                this.depositCallbacks.push((time: number) => {
                  startCycleFunction(time);
                });
              } else {
                startCycleFunction(time);
              }
            }
          }
        };
        if (!this.inputBlocked) {
          pullFunction(time, eventData);
        } else {
          this.inputBlockedCallbacks.push((time: number) => {
            pullFunction(time, eventData);
          });
        }
        break;
      default:
        throw new Error('Unhandled event ' + evt + ' at ' + time);
    }
  }

  private resetRecipeRemainingMap() {
    for (const [slug, value] of this.recipeIngredientMap.entries()) {
      this.recipeRemainingMap.set(slug, value);
    }
  }
}
