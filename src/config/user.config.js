const userConfig = {
  timerModes: [
    {
      name: "Pomodoro",
      duration: 25,
      active: true,
      interval: 1,
      autoStart: false,
    },
    {
      name: "Short Break",
      duration: 5,
      active: true,
      interval: 1,
      autoStart: false,
    },
    {
      name: "Long Break",
      duration: 15,
      active: true,
      interval: 4,
      autoStart: false,
    },
  ],
  defaultTimerMode: "",
  darkMode: false,
  alarmSound: "",
};

export default userConfig;
