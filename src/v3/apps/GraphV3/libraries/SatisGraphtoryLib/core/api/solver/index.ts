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
  Strength,
} from 'kiwi.js';
import { getItemList, getResources } from 'v3/data/loaders/items';
import { getExtractorRecipes, getRecipeList } from 'v3/data/loaders/recipes';
import { getPossibleRecipesFromSinkItem } from 'v3/data/graph/recipeGraph';

export interface SolverOptions {
  optimizeResiduals?: boolean;
  includeAlternateRecipes?: boolean;
}

export interface SolverConfiguration extends SolverOptions {
  targets: ItemRate[];
  constraints: SolverConstraint[];
}

enum SolverConstraintSubjectKind {
  Resource = 'res',
  Recipe = 'rec',
  Item = 'itm',
}

enum SolverConstraintType {
  Limit = 'cap',
  Minimize = 'min',
}

enum VariableKind {
  Resource = 'resource',
  Recipe = 'recipe',
}

enum ExpressionKind {
  Item = 'item',
  Machine = 'machine',
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

export const createResourceLimitConstraint = (
  name: string
): SolverConstraint => {
  return {
    subject: {
      kind: SolverConstraintSubjectKind.Resource,
      name,
    },
    type: SolverConstraintType.Limit,
    value: 0,
  };
};

export const createItemLimitConstraint = (name: string): SolverConstraint => {
  return {
    subject: {
      kind: SolverConstraintSubjectKind.Item,
      name,
    },
    type: SolverConstraintType.Limit,
    value: 0,
  };
};

export const createRecipeLimitConstraint = (name: string): SolverConstraint => {
  return {
    subject: {
      kind: SolverConstraintSubjectKind.Recipe,
      name,
    },
    type: SolverConstraintType.Limit,
    value: 0,
  };
};

function _addResources(context: SolverContext) {
  for (const { slug } of context.resources) {
    const variable = context.variable(VariableKind.Resource, slug);
    context.addTo(ExpressionKind.Item, slug, variable);
  }
}

function _addRecipes(context: SolverContext) {
  for (const {
    manufacturingDuration,
    slug,
    ingredients,
    products,
  } of context.recipes) {
    const runsPerMin = 60 / manufacturingDuration;

    const variable = context.variable(VariableKind.Recipe, slug);
    context.addConstraint(variable, Operator.Ge, 0, Strength.required);
    // When we're trying to optimize away residuals, we bias towards recipes
    // that have a target product, by minimizing recipes that don't.
    if (context.config.optimizeResiduals) {
      const hasTargetProduct = products.some(({ slug }: any) =>
        context.targets.has(slug)
      );

      //TODO: add self-set strengths
      context.solver.addEditVariable(
        variable,
        hasTargetProduct ? Strength.strong : Strength.medium
      );
    }

    for (const { amount, slug } of ingredients) {
      const expression = variable.multiply(-amount * runsPerMin);
      context.addTo(ExpressionKind.Item, slug, expression);
    }

    for (const { amount, slug } of products) {
      const expression = variable.multiply(amount * runsPerMin);
      context.addTo(ExpressionKind.Item, slug, expression);
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
    } else if (subject.kind === SolverConstraintSubjectKind.Recipe) {
      expression = context.variable(VariableKind.Recipe, subject.name);
    } else if (subject.kind === SolverConstraintSubjectKind.Item) {
      expression = context.expression(ExpressionKind.Item, subject.name);
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

    // console.log(
    //   `adding constraint: ${expression} ${operator} ${value} ${strength}`
    // );
    context.addConstraint(expression, operator, value, strength);
  }
}

function _optimizeResiduals(context: SolverContext) {
  const { residuals } = _collectOutputResults(context);
  if (!residuals.length) return;

  for (const residual of residuals) {
    const expression = context.expression(ExpressionKind.Item, residual.slug);
    context.addConstraint(expression, Operator.Eq, 0, Strength.required);
  }

  context.solver.updateVariables();
}

function _collectInputResults(context: SolverContext) {
  const result = [];
  for (const { slug } of context.resources) {
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

export class SolverContext {
  constructor(
    private _recipes: any,
    private _entities: any,
    private _baseResources: Set<string>,
    public config: SolverConfiguration
  ) {}

  public solver = new Solver();
  public targets = new Map(
    this.config.targets.map(({ slug, perMinute: perMin }) => [slug, perMin])
  );
  public recipes = this._recipes as any[];

  public resources = Object.values(this._entities).filter((entity: any) => {
    return this._baseResources.has(entity.slug);
  }) as any[];

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

export const kiwiSolver = () => {
  const baseResources = new Set(getResources());

  const targets = [{ slug: 'item-space-elevator-part-5', perMinute: 90 }];
  const activeTargets = targets.some(({ perMinute }) => perMinute > 0);
  if (!activeTargets) return;

  const whitelistedRecipes = new Set<string>();
  targets.forEach((target) => {
    const possibleItems = getPossibleRecipesFromSinkItem(target.slug);
    for (const item of possibleItems) {
      whitelistedRecipes.add(item);
    }
  });

  getExtractorRecipes()
    .map(({ slug }) => slug)
    .forEach((extractorSlug) => {
      whitelistedRecipes.delete(extractorSlug);
    });

  // TODO: find a better way
  const alternates = [...whitelistedRecipes].filter(
    (item) => item.indexOf('-alternate-') !== -1
  );

  if (true) {
    alternates.forEach((altRecipe) => {
      whitelistedRecipes.delete(altRecipe);
    });
  }

  const blacklistedRecipes = ['recipe-residual-fuel'];

  blacklistedRecipes.forEach((deletedRecipe) => {
    whitelistedRecipes.delete(deletedRecipe);
  });

  const context = new SolverContext(
    getRecipeList().filter((recipe) => whitelistedRecipes.has(recipe.slug)),
    getItemList(),
    baseResources,
    { optimizeResiduals: true, targets, constraints: [] }
  );
  _addResources(context);
  _addRecipes(context);
  _addExpressions(context);
  _addConstraints(context);

  context.solver.updateVariables();

  // if (config?.optimizeResiduals) {
  _optimizeResiduals(context);
  // }
  //
  console.log({
    inputs: _collectInputResults(context),
    recipes: _collectRecipeResults(context),
    ..._collectOutputResults(context),
  });
};

export const wizardSolver = (
  targets: any[],
  constraints: SolverConstraint[] = [],
  disableProp = false
) => {
  if (!disableProp) {
    console.log('CALLING WITH CONSTRAINTS');
    console.log(constraints);
  }
  const baseResources = new Set(getResources());

  const activeTargets = targets.some(({ perMinute }) => perMinute > 0);
  if (!activeTargets) return;

  const whitelistedRecipes = new Set<string>();
  targets.forEach((target) => {
    const possibleItems = getPossibleRecipesFromSinkItem(target.slug);
    for (const item of possibleItems) {
      whitelistedRecipes.add(item);
    }
  });

  getExtractorRecipes()
    .map(({ slug }) => slug)
    .forEach((extractorSlug) => {
      whitelistedRecipes.delete(extractorSlug);
    });

  // TODO: find a better way
  const alternates = [...whitelistedRecipes].filter(
    (item) => item.indexOf('-alternate-') !== -1
  );

  if (true) {
    alternates.forEach((altRecipe) => {
      whitelistedRecipes.delete(altRecipe);
    });
  }

  const blacklistedRecipes: string[] = [];

  blacklistedRecipes.forEach((deletedRecipe) => {
    whitelistedRecipes.delete(deletedRecipe);
  });

  const context = new SolverContext(
    getRecipeList().filter((recipe) => whitelistedRecipes.has(recipe.slug)),
    getItemList(),
    baseResources,
    { optimizeResiduals: true, targets, constraints }
  );

  try {
    _addResources(context);
    _addRecipes(context);
    _addExpressions(context);
    _addConstraints(context);
    context.solver.updateVariables();
  } catch (e) {
    if (!disableProp) {
      console.log('Error found: ', activeTargets);
      return {};
    }

    throw new Error(e);
  }

  // if (config?.optimizeResiduals) {
  // _optimizeResiduals(context);
  // }
  //
  const allOutputs = {
    inputs: _collectInputResults(context),
    recipes: _collectRecipeResults(context),
    ..._collectOutputResults(context),
  };

  const removableRecipes = [];
  const removableResiduals = [];
  const removableInputs = [];

  if (!disableProp) {
    for (const recipe of allOutputs.recipes) {
      const newConstraint = createRecipeLimitConstraint(recipe.slug);
      try {
        wizardSolver(targets, [...constraints, newConstraint], true);
        removableRecipes.push(recipe.slug);
      } catch (e) {}
    }

    for (const residual of allOutputs.residuals) {
      const newConstraint = createItemLimitConstraint(residual.slug);
      try {
        wizardSolver(targets, [...constraints, newConstraint], true);
        removableResiduals.push(residual.slug);
      } catch (e) {}
    }

    for (const input of allOutputs.inputs) {
      const newConstraint = createResourceLimitConstraint(input.slug);
      try {
        wizardSolver(targets, [...constraints, newConstraint], true);
        removableInputs.push(input.slug);
      } catch (e) {}
    }
  }

  return {
    ...allOutputs,
    removableRecipes,
    removableResiduals,
    removableInputs,
  };
};
