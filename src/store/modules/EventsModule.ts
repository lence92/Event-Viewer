import moment from "moment";
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import { Actions, Mutations } from "@/store/enums/StoreEnums";
import ApiService from "@/core/services/ApiService";

export interface Event {
  id: string;
  eventName: string;
  eventDate: moment.Moment;
  eventDescription: string;
}

export interface EventInfo {
  new_event: Event;
  errors: Array<string>;
}

@Module
export default class EventsModule extends VuexModule implements EventInfo {
  new_event = {} as Event;
  errors = [];

  /**
   * Get newest event
   * @returns Event
   */
  get newEvent(): Event {
    return this.new_event;
  }

  /**
   * Get new event errors
   * @returns array
   */
  get getEventErrors(): Array<string> {
    return this.errors;
  }

  @Mutation
  [Mutations.SET_EVENT_ERROR](error) {
    this.errors = error;
  }

  @Mutation
  [Mutations.SET_NEW_EVENT](event) {
    this.new_event = event;
  }

  // Add new event action that calls the endpoint for add new event
  @Action
  [Actions.ADD_NEW_EVENT](event) {
    return new Promise<void>((resolve, reject) => {
      ApiService.post("add-event", event)
        .then(({ data }) => {
          this.context.commit(Mutations.SET_NEW_EVENT, data);
          resolve();
        })
        .catch(({ response }) => {
          this.context.commit(Mutations.SET_EVENT_ERROR, response.data.errors);
          reject();
        });
    });
  }

  // Edit action that calls the endpoint for edit event
  @Action
  [Actions.EDIT_EVENT](event) {
    return new Promise<void>((resolve, reject) => {
      ApiService.post("edit-event", event)
        .then(({ data }) => {
          this.context.commit(Mutations.SET_NEW_EVENT, data);
          resolve();
        })
        .catch(({ response }) => {
          this.context.commit(Mutations.SET_EVENT_ERROR, response.data.errors);
          reject();
        });
    });
  }
}
