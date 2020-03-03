import { gql } from 'apollo-boost';

export const GET_RECIPES_BY_MACHINE = gql`
  {
    getRecipesByMachine {
      name
    }
  }
`;
