import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";

export enum Device {
  MOBILE = "mobile",
  TABLET = "tablet",
  DESKTOP = "desktop"
}

export enum Period {
  DAY = "day",
  MONTH = "month",
  ALL = "all"
}



type EagerTodo = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Todo, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly level: string;
  readonly deviceType: Device | keyof typeof Device;
  readonly time: number;
  readonly user: string;
  readonly date: number;
  readonly datePeriod: Period | keyof typeof Period;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyTodo = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Todo, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly level: string;
  readonly deviceType: Device | keyof typeof Device;
  readonly time: number;
  readonly user: string;
  readonly date: number;
  readonly datePeriod: Period | keyof typeof Period;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Todo = LazyLoading extends LazyLoadingDisabled ? EagerTodo : LazyTodo

export declare const Todo: (new (init: ModelInit<Todo>) => Todo) & {
  copyOf(source: Todo, mutator: (draft: MutableModel<Todo>) => MutableModel<Todo> | void): Todo;
}