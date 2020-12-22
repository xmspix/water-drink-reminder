import React, { useRef } from "react";
import { createApiClient, Users } from "./api";
import "./App.scss";

export type AppState = {
  msg: string;
  users?: Users[];
  isLoaded: boolean;
  user?: Users;
  dayTarget: number;
  current: number;
  count?: number;
  props?: any;
};

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {
  state: AppState = {
    msg: "",
    isLoaded: false,
    current: 0,
    dayTarget: 0,
  };

  timerDebounce: any = null;

  async componentDidMount() {
    this.setState({
      msg: await api.getMsg(),
      users: await api.getUser(),
      isLoaded: true,
    });
  }

  render() {
    const { isLoaded } = this.state;
    return <main>{isLoaded ? this.renderSelectUser() : "loading..."}</main>;
  }

  onSelect = (selectedUser: string) => {
    const { users } = this.state;

    const user = users?.filter((user) => user.name === selectedUser)[0];

    this.setState({
      user: user,
    });
  };

  setCurrent = (e: any) => {
    e.preventDefault();

    const { user, users, current, dayTarget } = this.state;

    const updatedUsers = users?.map((u) => {
      if (u.name === user?.name) {
        return { ...user, current: current + user.current };
      } else return u;
    });

    const currentInput: any = document.getElementById("current");
    const targetInput: any = document.getElementById("target");

    user &&
      this.setState({
        user: {
          ...user,
          current: currentInput.value ? current + user.current : current,
          dayTarget: targetInput.value ? dayTarget : user.dayTarget,
        },
        users: updatedUsers,
      });

      user &&
    api.updateUser({
        ...user,
          current: currentInput.value ? current + user.current : current,
          dayTarget: targetInput.value ? dayTarget : user.dayTarget
    })

    currentInput.value = "";
    targetInput.value = "";
  };

  setData = (option: string, e: any) => {
    clearTimeout(this.timerDebounce);
    this.timerDebounce = setTimeout(() => {
      switch (option) {
        case "current":
          this.setState({ current: Number(e) });
          break;

        case "target":
          this.setState({ dayTarget: Number(e) });
          break;
      }
    }, 300);
  };

  renderCard = (user: Users) => {
    return (
      <div className={"card"}>
        <div className={"card__header"}>
          {App.convertValue(user.current)} / {App.convertValue(user.dayTarget)}
        </div>
        <div className={"card__container"}>
          <form onSubmit={(e) => this.setCurrent(e)}>
            <span>
              <label htmlFor="current">Current: </label>
              <input
                type="number"
                min={0}
                id={"current"}
                className={"card__container_current"}
                placeholder={user.current.toString()}
                onChange={(e) => this.setData("current", e.target.value)}
              />
            </span>
            <span>
              <label htmlFor="">Daily target: </label>
              <input
                type="number"
                min={0}
                id={"target"}
                placeholder={user.dayTarget.toString()}
                onChange={(e) => this.setData("target", e.target.value)}
              />
            </span>
            <button type="submit">Update</button>
          </form>
        </div>
      </div>
    );
  };

  renderSelectUser() {
    const { msg, users, user } = this.state;
    return (
      <div>
        <div className="selector">
          <label htmlFor="user">Select user </label>
          <select
            id="user"
            onChange={(e) => this.onSelect(e.currentTarget.value)}
          >
            <option value=""></option>
            {users?.map((user, i) => (
              <option value={user.name} key={i}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        {user ? this.renderCard(user) : null}
      </div>
    );
  }

  static convertValue(value: number) {
    return value > 1000 ? value / 1000 + "L" : value + "ml";
  }
}

export default App;
