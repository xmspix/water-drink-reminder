import axios from "axios";

export type Users = {
  name: string;
  dayTarget: number;
  current: number;
};

export type ApiClient = {
  getMsg: () => Promise<any>;
  getUser: () => Promise<Users>;
  updateUser: () => Promise<Users>;
};

const host = "http://192.168.1.102:3232";
// const host = "http://localhost:3232"

export const createApiClient = () => {
  return {
    getMsg: () => {
      return axios.get(`${host}/api/hello`).then((res) => res.data);
    },

    getUser: () => {
      return axios.get(`${host}/api/users`).then((res) => res.data);
    },

    updateUser: (user: Users) => {
      return axios
        .get(
          `${host}/api/update?name=${user.name}&dayTarget=${user.dayTarget}&current=${user.current}`
        )
        .then((res) => res.data);
    },
  };
};
