import { Schema } from "ajv";

export type DomainEvent = {
  source: string;
  eventName: string;
  event: Schema;
  eventDateTime: string;
  eventVersion: string;
};

export interface ICreateDomainEvent {
  source: string;
  eventName: string;
  event: Schema;
  eventSchema?: Record<string, any>;
  eventVersion: string;
}
