import { App } from "vue";
import MockAdapter from "axios-mock-adapter";
import moment from "moment";

type User = {
  name: string;
  surname: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  token: string;
};

type Event = {
  id: string;
  eventName: string;
  eventDate: moment.Moment;
  eventDescription: string;
};

// mock testing user accounts
const users: Array<User> = [
  {
    name: "Name",
    surname: "Surname",
    username: "admin",
    email: "admin@demo.com",
    phone: "(01) 2345 6789",
    password: "demo12",
    token: "mgfi5juf74j",
  },
  {
    name: "Name",
    surname: "Surname",
    username: "admin",
    email: "admin2@demo.com",
    phone: "+61 1 2345 6789",
    password: "demo12",
    token: "fgj8fjdfk43",
  },
];

// mock testing events
export const events: Array<Event> = [
  {
    id: "vdgfhgfjgh5454",
    eventName: "New Event",
    eventDate: moment(),
    eventDescription: "Description",
  },
  {
    id: "ilkiliutr68890",
    eventName: "New Event 2",
    eventDate: moment(),
    eventDescription: "Description 2",
  },
];

class MockService {
  public static init(app: App<Element>) {
    // this sets the mock adapter on the default instance
    const mock = new MockAdapter(app.axios);

    // mock login request
    mock.onPost("/login").reply((data) => {
      const credential = JSON.parse(data.data);
      const found = users.find((user) => {
        return (
          credential.username === user.username &&
          credential.password === user.password
        );
      });
      if (found) {
        return [200, found];
      }
      return [404, { errors: ["The login detail is incorrect"] }];
    });

    // mock registration request
    mock.onPost("/registration").reply((data) => {
      const newUser = JSON.parse(data.data);
      if (
        newUser.name &&
        newUser.surname &&
        newUser.username &&
        newUser.email &&
        newUser.password
      ) {
        const found = users.find((user) => {
          return (
            newUser.username === user.username || newUser.email === user.email
          );
        });
        if (!found) {
          newUser.token = Math.random().toString(36).substr(2, 9);
          users.push(newUser);
          return [200, newUser];
        }
        return [
          409,
          { errors: ["User with this email and/or username already exists."] },
        ];
      }
      return [400, { errors: ["Please fill all needed fields to continue."] }];
    });

    // mock to verify authentication
    mock.onGet(/\/verify\/?/).reply((data) => {
      const token = data.headers.Authorization.replace("Token ", "");
      if (token !== "undefined") {
        const found = users.find((user) => {
          return token === user.token;
        });
        if (found) {
          return [200, found];
        } else {
          return [401, { errors: ["Invalid authentication"] }];
        }
      }
      return [401, { errors: ["Invalid authentication"] }];
    });

    // mock add event request
    mock.onPost("/add-event").reply((data) => {
      const newEvent = JSON.parse(data.data);
      if (newEvent.eventName && newEvent.eventDate) {
        const found = events.find((event) => {
          return newEvent.eventName === event.eventName;
        });
        if (!found) {
          newEvent.id = Math.random().toString(12).substr(2, 9);
          events.push(newEvent);
          return [200, newEvent];
        }
        return [409, { errors: ["Event with this name already exists."] }];
      }
      return [400, { errors: ["Please fill all needed fields to continue."] }];
    });

    // mock edit event request
    mock.onPost("/edit-event").reply((data) => {
      const updateEvent = JSON.parse(data.data);
      if (updateEvent.eventName && updateEvent.eventDate && updateEvent.id) {
        const index = events.map((e) => e.id).indexOf(updateEvent.id);
        if (index !== -1) {
          events[index] = updateEvent;
          return [200, updateEvent];
        }
        return [409, { errors: ["Event with this id doesn't exists."] }];
      }
      return [400, { errors: ["Please fill all needed fields to continue."] }];
    });
  }
}

export default MockService;
