/*
 * Copyright 2020 Ficsit.info Authors & Employees
 * Modifications copyright 2020 Alexander Fu
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  Solver,
  Variable,
  Expression,
  Constraint,
  Operator,
  Strength
} from 'kiwi.js';

export interface SolverOptions {
  optimizeResiduals?: boolean;
  includeAlternateRecipes?: boolean;
}

export interface SolverConfiguration extends SolverOptions {
  targets: ItemRate[];
  constraints: SolverConstraint[];
}

enum SolverConstraintSubjectKind {
  Resource = 'r'
}

enum SolverConstraintType {
  Limit = 'cap',
  Minimize = 'min'
}

export interface SolverConstraint {
  subject: {
    kind: SolverConstraintSubjectKind;
    name: string;
  };
  type: SolverConstraintType;
  value: number;
}

export interface SolverResult {
  inputs: ItemRate[];
  outputs: ItemRate[];
  recipes: { slug: string; multiple: number }[];
  residuals: ItemRate[];
}

export interface ItemRate {
  slug: string;
  perMinute: number;
}

function _addResources(context: SolverContext) {
  for (const { name: slug } of context.resources) {
    const variable = context.variable(VariableKind.Resource, slug);
    context.addTo(ExpressionKind.Item, slug, variable);
  }
}

function _addRecipes(context: SolverContext) {
  for (const {
    manufacturingDuration: duration,
    name: slug,
    ingredients,
    product: products,
    producedIn
  } of context.recipes) {
    const runsPerMin = 60 / duration;

    const variable = context.variable(VariableKind.Recipe, slug);
    context.addConstraint(variable, Operator.Ge, 0, Strength.required);

    // When we're trying to optimize away residuals, we bias towards recipes
    // that have a target product, by minimizing recipes that don't.
    if (context.config.optimizeResiduals) {
      const hasTargetProduct = products.some(({ resource: item }: any) =>
        context.targets.has(item)
      );

      context.solver.addEditVariable(
        variable,
        hasTargetProduct ? Strength.strong : Strength.medium
      );
    }

    // TODO: Drop this?
    context.addTo(ExpressionKind.Machine, producedIn[0], variable);

    for (const { amount: count, resource: item } of ingredients) {
      const expression = variable.multiply(-count * runsPerMin);
      context.addTo(ExpressionKind.Item, item, expression);
    }

    for (const { amount: count, resource: item } of products) {
      const expression = variable.multiply(count * runsPerMin);
      context.addTo(ExpressionKind.Item, item, expression);
    }
  }
}

function _addExpressions(context: SolverContext) {
  for (const [slug, expression] of context.getExpressions(
    ExpressionKind.Item
  )) {
    const target = context.targets.get(slug);
    if (target) {
      context.addConstraint(expression, Operator.Eq, target, Strength.required);
    } else {
      context.addConstraint(expression, Operator.Ge, 0, Strength.required);
    }
  }
}

function _addConstraints(context: SolverContext) {
  const { constraints } = context.config;
  if (!constraints) return;

  for (const constraint of constraints) {
    const { subject, type, value } = constraint;
    let expression: Expression | Variable | undefined;
    let operator: Operator | undefined;
    let strength: number | undefined;
    if (subject.kind === SolverConstraintSubjectKind.Resource) {
      expression = context.variable(VariableKind.Resource, subject.name);
    }

    if (type === SolverConstraintType.Limit) {
      operator = Operator.Le;
      strength = Strength.required;
    } else if (type === SolverConstraintType.Minimize) {
      operator = Operator.Eq;
      strength = Strength.strong;
    }

    if (!expression || operator === undefined || strength === undefined) {
      const missing = [];
      if (!expression) missing.push('expression');
      if (!operator) missing.push('operator');
      if (!strength) missing.push('strength');
      const details = JSON.stringify(constraint);
      throw new Error(
        `Invalid constraint: ${details} (missing ${missing.join(', ')})`
      );
    }

    console.log(
      `adding constraint: ${expression} ${operator} ${value} ${strength}`
    );
    context.addConstraint(expression, operator, value, strength);
  }
}

function _optimizeResiduals(context: SolverContext) {
  const { residuals } = _collectOutputResults(context);
  if (!residuals.length) return;

  // TODO: Should we try multiple rounds?
  for (const residual of residuals) {
    const expression = context.expression(ExpressionKind.Item, residual.slug);
    context.addConstraint(expression, Operator.Eq, 0, Strength.required);
  }

  context.solver.updateVariables();
}

function _collectInputResults(context: SolverContext) {
  const result = [];
  for (const { name: slug } of context.resources) {
    const value = _round(context.variable(VariableKind.Resource, slug).value());
    if (value === 0) continue;
    result.push({ slug, perMinute: value });
  }

  return result;
}

function _collectRecipeResults(context: SolverContext) {
  const result = [];
  for (const [slug, variable] of context.getVariables(VariableKind.Recipe)) {
    const value = _round(variable.value());
    if (value === 0) continue;
    result.push({ slug, multiple: value });
  }

  return result;
}

function _collectOutputResults(context: SolverContext) {
  const outputs = [];
  const residuals = [];

  for (const [slug, expression] of context.getExpressions(
    ExpressionKind.Item
  )) {
    const value = _round(expression.value());
    if (value === 0) continue;

    if (context.targets.has(slug)) {
      outputs.push({ slug, perMinute: value });
    } else {
      residuals.push({ slug, perMinute: value });
    }
  }

  return { outputs, residuals };
}

enum VariableKind {
  Resource = 'resource',
  Recipe = 'recipe'
}

enum ExpressionKind {
  Item = 'item',
  Machine = 'machine'
}

export class SolverContext {
  constructor(
    private _recipesBySlug: any,
    private _entitiesBySlug: any,
    private core: any,
    public config: SolverConfiguration
  ) {
    console.log(this.resources, this.recipes);
  }

  public solver = new Solver();
  public targets = new Map(
    this.config.targets.map(({ slug, perMinute: perMin }) => [slug, perMin])
  );
  public recipes = this._recipesBySlug as any[];

  public resources = Object.values(this._entitiesBySlug).filter((entity: any) =>
    this.core.has(entity.name)
  ) as any[];

  private _variablesByKindBySlug = new Map<
    VariableKind,
    Map<string, Variable>
  >();
  private _expressionsByKindBySlug = new Map<
    ExpressionKind,
    Map<string, Expression>
  >();

  variable(kind: VariableKind, slug: string) {
    if (!this._variablesByKindBySlug.has(kind))
      this._variablesByKindBySlug.set(kind, new Map());
    const bySlug = this._variablesByKindBySlug.get(kind)!;
    if (!bySlug.has(slug)) {
      bySlug.set(slug, new Variable(`[${kind}] ${slug}`));
    }

    return bySlug.get(slug)!;
  }

  expression(kind: ExpressionKind, slug: string) {
    if (!this._expressionsByKindBySlug.has(kind))
      this._expressionsByKindBySlug.set(kind, new Map());
    const bySlug = this._expressionsByKindBySlug.get(kind)!;
    if (!bySlug.has(slug)) {
      bySlug.set(slug, new Expression());
    }

    return bySlug.get(slug)!;
  }

  addTo(
    kind: ExpressionKind,
    slug: string,
    value: Variable | Expression | number
  ) {
    const expression = this.expression(kind, slug);
    const bySlug = this._expressionsByKindBySlug.get(kind)!;
    bySlug.set(slug, expression.plus(value));
  }

  addConstraint(
    expression: Expression | Variable,
    operator: Operator,
    value: number,
    strength: number
  ) {
    const constraint = new Constraint(expression, operator, value, strength);
    this.solver.addConstraint(constraint);
    return constraint;
  }

  getVariables(kind: VariableKind) {
    return this._variablesByKindBySlug.get(kind) || new Map<string, Variable>();
  }

  getExpressions(kind: ExpressionKind) {
    return (
      this._expressionsByKindBySlug.get(kind) || new Map<string, Expression>()
    );
  }
}

const _roundPrecision = 2 ** 24;

function _round(value: number) {
  return Math.round(value * _roundPrecision) / _roundPrecision;
}

const blackListedProducerTypes = new Set([
  'WorkBenchComponent',
  'BuildGun',
  'Converter'
]);

export const kiwiSolver = () => {
  const nameToRecipe: Map<string, any> = new Map();

  const allProducts: Set<string> = new Set();
  const allIngredients: Set<string> = new Set();
  const extractorProducedResources: Set<string> = new Set();
  // data.extractorMachine
  //   .map((item: any) => {
  //     return item.allowedResources;
  //   })
  //   .flat(1)
  //
  // const recipesUsed = data.recipe;

  const ingredientsToRecipe = new Map();
  const productsToRecipe = new Map();

  // recipesUsed.forEach((recipe: any) => {
  //   const sources = (recipe.producedIn ?? []).filter((producedIn: string) => {
  //     return !blackListedProducerTypes.has(producedIn);
  //   });
  //
  //   if (sources.length === 0) {
  //     return;
  //   }
  //
  //   nameToRecipe.set(recipe.name, recipe);
  //
  //   // Ingredients
  //   (recipe.ingredients ?? []).forEach((ingredient: any) => {
  //     const resource = ingredient.resource;
  //     allIngredients.add(resource);
  //
  //     if (!ingredientsToRecipe.get(resource)) {
  //       ingredientsToRecipe.set(resource, new Set());
  //     }
  //
  //     ingredientsToRecipe.get(resource)!.add(recipe);
  //   });
  //
  //   // Products
  //   (recipe.product ?? []).forEach((product: any) => {
  //     const resource = product.resource;
  //     allProducts.add(product.resource);
  //
  //     if (!productsToRecipe.get(resource)) {
  //       productsToRecipe.set(resource, new Set());
  //     }
  //
  //     productsToRecipe.get(resource)!.add(recipe);
  //   });
  // });

  const coreResources = new Set([
    ...[...allIngredients].filter(x => !allProducts.has(x)),
    ...extractorProducedResources
  ]);

  const targets = [{ slug: 'SpaceElevatorPart_5', perMinute: 90 }];
  const activeTargets = targets.some(({ perMinute }) => perMinute > 0);
  if (!activeTargets) return;

  // const context = new SolverContext(data.recipe, data.item, coreResources, {targets, constraints: []});
  // _addResources(context);
  // _addRecipes(context);
  // _addExpressions(context);
  // _addConstraints(context);

  // context.solver.updateVariables();
  //
  // // if (config?.optimizeResiduals) {
  // //   _optimizeResiduals(context);
  // // }
  //
  // console.log({
  //   inputs: _collectInputResults(context),
  //   recipes: _collectRecipeResults(context),
  //   ..._collectOutputResults(context),
  // });
};
