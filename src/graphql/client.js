import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphqQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { Kind, OperationTypeNode } from "graphql";
import { createClient as createWsClient } from "graphql-ws";

const httpLink = new HttpLink({
  uri: "http://localhost:9000/graphql",
});

const wsLink = new GraphqQLWsLink(
  createWsClient({
    url: "ws://localhost:9000/graphql",
  })
);

// write a function that will determine if a given operation is a subscription
const isSubscription = ({ query }) => {
  const definition = getMainDefinition(query);
  return (
    definition.kind === Kind.OPERATION_DEFINITION &&
    definition.operation === OperationTypeNode.SUBSCRIPTION
  );
};

export const client = new ApolloClient({
  link: split(isSubscription, wsLink, httpLink),
  cache: new InMemoryCache(),
});

export default client;
