import { gql } from 'urql';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
};

export type BlockChangedFilter = {
  readonly number_gte: Scalars['Int'];
};

export type Block_Height = {
  readonly hash?: InputMaybe<Scalars['Bytes']>;
  readonly number?: InputMaybe<Scalars['Int']>;
  readonly number_gte?: InputMaybe<Scalars['Int']>;
};

export type CollageToken = {
  readonly __typename?: 'CollageToken';
  readonly id: Scalars['ID'];
  readonly owner: Scalars['Bytes'];
  readonly tokenURI: Scalars['String'];
};

export type CollageToken_Filter = {
  /** Filter for the block changed event. */
  readonly _change_block?: InputMaybe<BlockChangedFilter>;
  readonly id?: InputMaybe<Scalars['ID']>;
  readonly id_gt?: InputMaybe<Scalars['ID']>;
  readonly id_gte?: InputMaybe<Scalars['ID']>;
  readonly id_in?: InputMaybe<ReadonlyArray<Scalars['ID']>>;
  readonly id_lt?: InputMaybe<Scalars['ID']>;
  readonly id_lte?: InputMaybe<Scalars['ID']>;
  readonly id_not?: InputMaybe<Scalars['ID']>;
  readonly id_not_in?: InputMaybe<ReadonlyArray<Scalars['ID']>>;
  readonly owner?: InputMaybe<Scalars['Bytes']>;
  readonly owner_contains?: InputMaybe<Scalars['Bytes']>;
  readonly owner_in?: InputMaybe<ReadonlyArray<Scalars['Bytes']>>;
  readonly owner_not?: InputMaybe<Scalars['Bytes']>;
  readonly owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  readonly owner_not_in?: InputMaybe<ReadonlyArray<Scalars['Bytes']>>;
  readonly tokenURI?: InputMaybe<Scalars['String']>;
  readonly tokenURI_contains?: InputMaybe<Scalars['String']>;
  readonly tokenURI_contains_nocase?: InputMaybe<Scalars['String']>;
  readonly tokenURI_ends_with?: InputMaybe<Scalars['String']>;
  readonly tokenURI_ends_with_nocase?: InputMaybe<Scalars['String']>;
  readonly tokenURI_gt?: InputMaybe<Scalars['String']>;
  readonly tokenURI_gte?: InputMaybe<Scalars['String']>;
  readonly tokenURI_in?: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly tokenURI_lt?: InputMaybe<Scalars['String']>;
  readonly tokenURI_lte?: InputMaybe<Scalars['String']>;
  readonly tokenURI_not?: InputMaybe<Scalars['String']>;
  readonly tokenURI_not_contains?: InputMaybe<Scalars['String']>;
  readonly tokenURI_not_contains_nocase?: InputMaybe<Scalars['String']>;
  readonly tokenURI_not_ends_with?: InputMaybe<Scalars['String']>;
  readonly tokenURI_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  readonly tokenURI_not_in?: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly tokenURI_not_starts_with?: InputMaybe<Scalars['String']>;
  readonly tokenURI_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  readonly tokenURI_starts_with?: InputMaybe<Scalars['String']>;
  readonly tokenURI_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum CollageToken_OrderBy {
  Id = 'id',
  Owner = 'owner',
  TokenUri = 'tokenURI'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Owner = {
  readonly __typename?: 'Owner';
  readonly id: Scalars['Bytes'];
  readonly token?: Maybe<ReadonlyArray<OwnerPiece>>;
};


export type OwnerTokenArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OwnerPiece_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<OwnerPiece_Filter>;
};

export type OwnerPiece = {
  readonly __typename?: 'OwnerPiece';
  readonly amount: Scalars['BigInt'];
  readonly id: Scalars['ID'];
  readonly owner: Owner;
  readonly piece: Piece;
};

export type OwnerPiece_Filter = {
  /** Filter for the block changed event. */
  readonly _change_block?: InputMaybe<BlockChangedFilter>;
  readonly amount?: InputMaybe<Scalars['BigInt']>;
  readonly amount_gt?: InputMaybe<Scalars['BigInt']>;
  readonly amount_gte?: InputMaybe<Scalars['BigInt']>;
  readonly amount_in?: InputMaybe<ReadonlyArray<Scalars['BigInt']>>;
  readonly amount_lt?: InputMaybe<Scalars['BigInt']>;
  readonly amount_lte?: InputMaybe<Scalars['BigInt']>;
  readonly amount_not?: InputMaybe<Scalars['BigInt']>;
  readonly amount_not_in?: InputMaybe<ReadonlyArray<Scalars['BigInt']>>;
  readonly id?: InputMaybe<Scalars['ID']>;
  readonly id_gt?: InputMaybe<Scalars['ID']>;
  readonly id_gte?: InputMaybe<Scalars['ID']>;
  readonly id_in?: InputMaybe<ReadonlyArray<Scalars['ID']>>;
  readonly id_lt?: InputMaybe<Scalars['ID']>;
  readonly id_lte?: InputMaybe<Scalars['ID']>;
  readonly id_not?: InputMaybe<Scalars['ID']>;
  readonly id_not_in?: InputMaybe<ReadonlyArray<Scalars['ID']>>;
  readonly owner?: InputMaybe<Scalars['String']>;
  readonly owner_?: InputMaybe<Owner_Filter>;
  readonly owner_contains?: InputMaybe<Scalars['String']>;
  readonly owner_contains_nocase?: InputMaybe<Scalars['String']>;
  readonly owner_ends_with?: InputMaybe<Scalars['String']>;
  readonly owner_ends_with_nocase?: InputMaybe<Scalars['String']>;
  readonly owner_gt?: InputMaybe<Scalars['String']>;
  readonly owner_gte?: InputMaybe<Scalars['String']>;
  readonly owner_in?: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly owner_lt?: InputMaybe<Scalars['String']>;
  readonly owner_lte?: InputMaybe<Scalars['String']>;
  readonly owner_not?: InputMaybe<Scalars['String']>;
  readonly owner_not_contains?: InputMaybe<Scalars['String']>;
  readonly owner_not_contains_nocase?: InputMaybe<Scalars['String']>;
  readonly owner_not_ends_with?: InputMaybe<Scalars['String']>;
  readonly owner_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  readonly owner_not_in?: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly owner_not_starts_with?: InputMaybe<Scalars['String']>;
  readonly owner_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  readonly owner_starts_with?: InputMaybe<Scalars['String']>;
  readonly owner_starts_with_nocase?: InputMaybe<Scalars['String']>;
  readonly piece?: InputMaybe<Scalars['String']>;
  readonly piece_?: InputMaybe<Piece_Filter>;
  readonly piece_contains?: InputMaybe<Scalars['String']>;
  readonly piece_contains_nocase?: InputMaybe<Scalars['String']>;
  readonly piece_ends_with?: InputMaybe<Scalars['String']>;
  readonly piece_ends_with_nocase?: InputMaybe<Scalars['String']>;
  readonly piece_gt?: InputMaybe<Scalars['String']>;
  readonly piece_gte?: InputMaybe<Scalars['String']>;
  readonly piece_in?: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly piece_lt?: InputMaybe<Scalars['String']>;
  readonly piece_lte?: InputMaybe<Scalars['String']>;
  readonly piece_not?: InputMaybe<Scalars['String']>;
  readonly piece_not_contains?: InputMaybe<Scalars['String']>;
  readonly piece_not_contains_nocase?: InputMaybe<Scalars['String']>;
  readonly piece_not_ends_with?: InputMaybe<Scalars['String']>;
  readonly piece_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  readonly piece_not_in?: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly piece_not_starts_with?: InputMaybe<Scalars['String']>;
  readonly piece_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  readonly piece_starts_with?: InputMaybe<Scalars['String']>;
  readonly piece_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum OwnerPiece_OrderBy {
  Amount = 'amount',
  Id = 'id',
  Owner = 'owner',
  Piece = 'piece'
}

export type Owner_Filter = {
  /** Filter for the block changed event. */
  readonly _change_block?: InputMaybe<BlockChangedFilter>;
  readonly id?: InputMaybe<Scalars['Bytes']>;
  readonly id_contains?: InputMaybe<Scalars['Bytes']>;
  readonly id_in?: InputMaybe<ReadonlyArray<Scalars['Bytes']>>;
  readonly id_not?: InputMaybe<Scalars['Bytes']>;
  readonly id_not_contains?: InputMaybe<Scalars['Bytes']>;
  readonly id_not_in?: InputMaybe<ReadonlyArray<Scalars['Bytes']>>;
  readonly token_?: InputMaybe<OwnerPiece_Filter>;
};

export enum Owner_OrderBy {
  Id = 'id',
  Token = 'token'
}

export type Piece = {
  readonly __typename?: 'Piece';
  readonly creator: Scalars['Bytes'];
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly price: Scalars['BigInt'];
  readonly tokenBalances: ReadonlyArray<OwnerPiece>;
  readonly tokenURI: Scalars['String'];
};


export type PieceTokenBalancesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OwnerPiece_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<OwnerPiece_Filter>;
};

export type Piece_Filter = {
  /** Filter for the block changed event. */
  readonly _change_block?: InputMaybe<BlockChangedFilter>;
  readonly creator?: InputMaybe<Scalars['Bytes']>;
  readonly creator_contains?: InputMaybe<Scalars['Bytes']>;
  readonly creator_in?: InputMaybe<ReadonlyArray<Scalars['Bytes']>>;
  readonly creator_not?: InputMaybe<Scalars['Bytes']>;
  readonly creator_not_contains?: InputMaybe<Scalars['Bytes']>;
  readonly creator_not_in?: InputMaybe<ReadonlyArray<Scalars['Bytes']>>;
  readonly id?: InputMaybe<Scalars['ID']>;
  readonly id_gt?: InputMaybe<Scalars['ID']>;
  readonly id_gte?: InputMaybe<Scalars['ID']>;
  readonly id_in?: InputMaybe<ReadonlyArray<Scalars['ID']>>;
  readonly id_lt?: InputMaybe<Scalars['ID']>;
  readonly id_lte?: InputMaybe<Scalars['ID']>;
  readonly id_not?: InputMaybe<Scalars['ID']>;
  readonly id_not_in?: InputMaybe<ReadonlyArray<Scalars['ID']>>;
  readonly name?: InputMaybe<Scalars['String']>;
  readonly name_contains?: InputMaybe<Scalars['String']>;
  readonly name_contains_nocase?: InputMaybe<Scalars['String']>;
  readonly name_ends_with?: InputMaybe<Scalars['String']>;
  readonly name_ends_with_nocase?: InputMaybe<Scalars['String']>;
  readonly name_gt?: InputMaybe<Scalars['String']>;
  readonly name_gte?: InputMaybe<Scalars['String']>;
  readonly name_in?: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly name_lt?: InputMaybe<Scalars['String']>;
  readonly name_lte?: InputMaybe<Scalars['String']>;
  readonly name_not?: InputMaybe<Scalars['String']>;
  readonly name_not_contains?: InputMaybe<Scalars['String']>;
  readonly name_not_contains_nocase?: InputMaybe<Scalars['String']>;
  readonly name_not_ends_with?: InputMaybe<Scalars['String']>;
  readonly name_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  readonly name_not_in?: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly name_not_starts_with?: InputMaybe<Scalars['String']>;
  readonly name_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  readonly name_starts_with?: InputMaybe<Scalars['String']>;
  readonly name_starts_with_nocase?: InputMaybe<Scalars['String']>;
  readonly price?: InputMaybe<Scalars['BigInt']>;
  readonly price_gt?: InputMaybe<Scalars['BigInt']>;
  readonly price_gte?: InputMaybe<Scalars['BigInt']>;
  readonly price_in?: InputMaybe<ReadonlyArray<Scalars['BigInt']>>;
  readonly price_lt?: InputMaybe<Scalars['BigInt']>;
  readonly price_lte?: InputMaybe<Scalars['BigInt']>;
  readonly price_not?: InputMaybe<Scalars['BigInt']>;
  readonly price_not_in?: InputMaybe<ReadonlyArray<Scalars['BigInt']>>;
  readonly tokenBalances_?: InputMaybe<OwnerPiece_Filter>;
  readonly tokenURI?: InputMaybe<Scalars['String']>;
  readonly tokenURI_contains?: InputMaybe<Scalars['String']>;
  readonly tokenURI_contains_nocase?: InputMaybe<Scalars['String']>;
  readonly tokenURI_ends_with?: InputMaybe<Scalars['String']>;
  readonly tokenURI_ends_with_nocase?: InputMaybe<Scalars['String']>;
  readonly tokenURI_gt?: InputMaybe<Scalars['String']>;
  readonly tokenURI_gte?: InputMaybe<Scalars['String']>;
  readonly tokenURI_in?: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly tokenURI_lt?: InputMaybe<Scalars['String']>;
  readonly tokenURI_lte?: InputMaybe<Scalars['String']>;
  readonly tokenURI_not?: InputMaybe<Scalars['String']>;
  readonly tokenURI_not_contains?: InputMaybe<Scalars['String']>;
  readonly tokenURI_not_contains_nocase?: InputMaybe<Scalars['String']>;
  readonly tokenURI_not_ends_with?: InputMaybe<Scalars['String']>;
  readonly tokenURI_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  readonly tokenURI_not_in?: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly tokenURI_not_starts_with?: InputMaybe<Scalars['String']>;
  readonly tokenURI_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  readonly tokenURI_starts_with?: InputMaybe<Scalars['String']>;
  readonly tokenURI_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Piece_OrderBy {
  Creator = 'creator',
  Id = 'id',
  Name = 'name',
  Price = 'price',
  TokenBalances = 'tokenBalances',
  TokenUri = 'tokenURI'
}

export type Query = {
  readonly __typename?: 'Query';
  /** Access to subgraph metadata */
  readonly _meta?: Maybe<_Meta_>;
  readonly collageToken?: Maybe<CollageToken>;
  readonly collageTokens: ReadonlyArray<CollageToken>;
  readonly owner?: Maybe<Owner>;
  readonly ownerPiece?: Maybe<OwnerPiece>;
  readonly ownerPieces: ReadonlyArray<OwnerPiece>;
  readonly owners: ReadonlyArray<Owner>;
  readonly piece?: Maybe<Piece>;
  readonly pieces: ReadonlyArray<Piece>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryCollageTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryCollageTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CollageToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CollageToken_Filter>;
};


export type QueryOwnerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOwnerPieceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOwnerPiecesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OwnerPiece_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OwnerPiece_Filter>;
};


export type QueryOwnersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Owner_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Owner_Filter>;
};


export type QueryPieceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPiecesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Piece_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Piece_Filter>;
};

export type Subscription = {
  readonly __typename?: 'Subscription';
  /** Access to subgraph metadata */
  readonly _meta?: Maybe<_Meta_>;
  readonly collageToken?: Maybe<CollageToken>;
  readonly collageTokens: ReadonlyArray<CollageToken>;
  readonly owner?: Maybe<Owner>;
  readonly ownerPiece?: Maybe<OwnerPiece>;
  readonly ownerPieces: ReadonlyArray<OwnerPiece>;
  readonly owners: ReadonlyArray<Owner>;
  readonly piece?: Maybe<Piece>;
  readonly pieces: ReadonlyArray<Piece>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionCollageTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionCollageTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CollageToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CollageToken_Filter>;
};


export type SubscriptionOwnerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOwnerPieceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOwnerPiecesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OwnerPiece_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OwnerPiece_Filter>;
};


export type SubscriptionOwnersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Owner_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Owner_Filter>;
};


export type SubscriptionPieceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPiecesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Piece_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Piece_Filter>;
};

export type _Block_ = {
  readonly __typename?: '_Block_';
  /** The hash of the block */
  readonly hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  readonly number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  readonly timestamp?: Maybe<Scalars['Int']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  readonly __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  readonly block: _Block_;
  /** The deployment ID */
  readonly deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  readonly hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type CollagesQueryVariables = Exact<{ [key: string]: never; }>;


export type CollagesQuery = { readonly __typename?: 'Query', readonly collageTokens: ReadonlyArray<{ readonly __typename?: 'CollageToken', readonly id: string, readonly tokenURI: string }> };

export type CollageOwnersQueryVariables = Exact<{
  owner: Scalars['Bytes'];
}>;


export type CollageOwnersQuery = { readonly __typename?: 'Query', readonly collageTokens: ReadonlyArray<{ readonly __typename?: 'CollageToken', readonly id: string, readonly tokenURI: string }> };

export type OwnedPiecesQueryVariables = Exact<{
  owner: Scalars['Bytes'];
}>;


export type OwnedPiecesQuery = { readonly __typename?: 'Query', readonly owners: ReadonlyArray<{ readonly __typename?: 'Owner', readonly id: any, readonly token?: ReadonlyArray<{ readonly __typename?: 'OwnerPiece', readonly amount: any, readonly piece: { readonly __typename?: 'Piece', readonly id: string, readonly name: string } }> | null }> };

export type PiecesQueryVariables = Exact<{ [key: string]: never; }>;


export type PiecesQuery = { readonly __typename?: 'Query', readonly pieces: ReadonlyArray<{ readonly __typename?: 'Piece', readonly id: string, readonly tokenURI: string, readonly price: any, readonly name: string }> };


export const CollagesDocument = gql`
    query Collages {
  collageTokens(first: 100) {
    id
    tokenURI
  }
}
    `;

export function useCollagesQuery(options?: Omit<Urql.UseQueryArgs<CollagesQueryVariables>, 'query'>) {
  return Urql.useQuery<CollagesQuery, CollagesQueryVariables>({ query: CollagesDocument, ...options });
};
export const CollageOwnersDocument = gql`
    query CollageOwners($owner: Bytes!) {
  collageTokens(where: {owner: $owner}, first: 100) {
    id
    tokenURI
  }
}
    `;

export function useCollageOwnersQuery(options: Omit<Urql.UseQueryArgs<CollageOwnersQueryVariables>, 'query'>) {
  return Urql.useQuery<CollageOwnersQuery, CollageOwnersQueryVariables>({ query: CollageOwnersDocument, ...options });
};
export const OwnedPiecesDocument = gql`
    query OwnedPieces($owner: Bytes!) {
  owners(where: {id: $owner}, first: 100) {
    id
    token {
      piece {
        id
        name
      }
      amount
    }
  }
}
    `;

export function useOwnedPiecesQuery(options: Omit<Urql.UseQueryArgs<OwnedPiecesQueryVariables>, 'query'>) {
  return Urql.useQuery<OwnedPiecesQuery, OwnedPiecesQueryVariables>({ query: OwnedPiecesDocument, ...options });
};
export const PiecesDocument = gql`
    query Pieces {
  pieces(first: 100) {
    id
    tokenURI
    price
    name
  }
}
    `;

export function usePiecesQuery(options?: Omit<Urql.UseQueryArgs<PiecesQueryVariables>, 'query'>) {
  return Urql.useQuery<PiecesQuery, PiecesQueryVariables>({ query: PiecesDocument, ...options });
};