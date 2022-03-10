import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  completedPomodoros: Number,
  expectedPomodoros: Number,
  color: String,
  completed: Boolean,
});

const timerModes = new mongoose.Schema({
  name: String,
  duration: Number,
  active: Boolean,
  interval: Number,
  autoStart: Boolean,
});

const settingsSchema = new mongoose.Schema({
  timerModes: [timerModes],
  defaultTimerMode: String,
  darkMode: Boolean,
  alarmSound: String,
});

const progressSchema = new mongoose.Schema({
  completedTasks: Number,
  hoursInvest: Number,
});

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  settings: settingsSchema,
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
  tasks: [taskSchema],
  progress: progressSchema,
});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
userSchema.set("toJSON", {
  virtuals: true,
});

userSchema.statics.createTask = async function (userId, data) {
  // Get user
  const user = await this.findOne({ _id: userId });

  if (!user) return user;

  // Push new task in array of tasks
  user.tasks.push(data);

  // Save user
  return user.save();
};

userSchema.statics.getTasks = async function (userId) {
  const user = await this.findOne({ _id: userId });

  if (!user) return user;

  // Return user settings
  return user.tasks;
};

userSchema.statics.updateTask = async function (userId, taskId, updatedTask) {
  // Get task
  const task = await this.updateOne(
    { _id: userId, "tasks._id": taskId },
    {
      $set: {
        "tasks.$.title": updatedTask.title,
        "tasks.$.description": updatedTask.description,
        "tasks.$.completedPomodoros": updatedTask.completedPomodoros,
        "tasks.$.expectedPomodoros": updatedTask.expectedPomodoros,
        "tasks.$.color": updatedTask.color,
        "tasks.$.completed": updatedTask.completed,
      },
    }
  );

  return task;
};

userSchema.statics.getUserSettings = async function (userId) {
  const user = await this.findOne({ _id: userId });

  if (!user) return user;

  // Return user settings
  return user.settings;
};

userSchema.statics.updateUserSettings = async function (userId, newSettings) {
  const updatedTimerModes = await this.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        "settings.defaultTimerMode": newSettings.defaultTimerMode,
        "settings.darkMode": newSettings.darkMode,
        "settings.alarmSound": newSettings.alarmSound,
      },
    }
  );

  return updatedTimerModes;
};

userSchema.statics.updateTimerMode = async function (userId, newTimerMode) {
  const updated = await this.findOneAndUpdate(
    { _id: userId, "settings.timerModes._id": newTimerMode._id },
    {
      $set: {
        "settings.timerModes.$.name": newTimerMode.name,
        "settings.timerModes.$.duration": newTimerMode.duration,
        "settings.timerModes.$.active": newTimerMode.active,
        "settings.timerModes.$.interval": newTimerMode.interval,
        "settings.timerModes.$.autoStart": newTimerMode.autoStart,
      },
    }
  );

  return updated;
};

userSchema.statics.getUserByEmail = async function (email, populate) {
  const search = await this.findOne({ email: email });

  if (populate) return search.populate(...populate);

  return search;
};

userSchema.statics.getUserById = async function (id) {
  const user = await this.findById(id);

  return user;
};

userSchema.statics.createUser = async function (userData) {
  const user = new this(userData);
  return await user.save();
};

userSchema.statics.listUsers = async function (perPage, page) {
  const user = await this.find()
    .limit(perPage)
    .skip(perPage * page);

  return user;
};

userSchema.statics.updateUser = async function (id, userData) {
  const updated = await this.findOneAndUpdate(
    {
      _id: id,
    },
    userData
  );

  return updated;
};

userSchema.statics.deleteById = async function (userId) {
  const deleted = await this.deleteMany({ _id: userId });

  return deleted;
};

const User = mongoose.model("Users", userSchema);

export default User;
