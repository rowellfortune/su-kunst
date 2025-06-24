export const createOpportunity = /* GraphQL */ `
  mutation CreateOpportunity($input: CreateOpportunityInput!) {
    createOpportunity(input: $input) {
      id
      title
      description
      status
      createdAt
    }
  }
`;
