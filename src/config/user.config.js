// const userConfig = {
//   pomodoro: 25,
//   shortBreak: 5,
//   shortBreakActive: true,
//   longBreak: 15,
//   longBreakActive: true,
//   longBreakInterval: 4,
//   autoStartBreak: false,
//   autoStartPomodoro: false,
//   darkMode: false,
//   alarmSound: "",
// }

const userConfig = {
  timerModes: [
    { name: "Pomodoro", time: 25, active: true, interval: 1, autoStart: false },
    {
      name: "Short Break",
      time: 5,
      active: true,
      interval: 1,
      autoStart: false,
    },
    {
      name: "Long Break",
      time: 15,
      active: true,
      interval: 4,
      autoStart: false,
    },
  ],
  darkMode: false,
  alarmSound: "",
};

export default userConfig;
