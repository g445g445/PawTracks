import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";





type EagerLoginList = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoginList, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly UID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyLoginList = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoginList, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly UID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type LoginList = LazyLoading extends LazyLoadingDisabled ? EagerLoginList : LazyLoginList

export declare const LoginList: (new (init: ModelInit<LoginList>) => LoginList) & {
  copyOf(source: LoginList, mutator: (draft: MutableModel<LoginList>) => MutableModel<LoginList> | void): LoginList;
}