import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean,
  pomodoros: Number,
  from: Date,
  to: Date,
});

const settingsSchema = new mongoose.Schema({
  pomodoro: Number,
  shortBreak: Number,
  shortBreakActive: Boolean,
  longBreak: Number,
  longBreakActive: Boolean,
  longBreakInterval: Number,
  autoStartBreak: Boolean,
  autoStartPomodoro: Boolean,
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

// userSchema.findById = function (cb) {
//   return this.model("Users").find({ id: this.id }, cb);
// };

userSchema.statics.createTask = async function (userId, data) {
  // Get user
  const user = await this.findOne({ _id: userId });

  if (!user) return user;

  // Push new task in array of tasks
  user.tasks.push(data);

  // Save user
  return user.save();
};

userSchema.statics.getUserSettings = async function (userId) {
  const user = await this.findOne({ _id: userId });

  if (!user) return user;

  // Return user settings
  return user.settings;
};

userSchema.statics.updateUserSettings = async function (userId, newSettings) {
  const updated = await this.findOneAndUpdate(
    { _id: userId },
    {
      settings: newSettings,
    }
  );

  return updated;
};

userSchema.statics.changeUserProgress = async function (userId, newProgress) {
  const changed = await this.findOneAndUpdate(
    { _id: userId },
    {
      progress: newProgress,
    }
  );

  if (!changed) return changed;

  return changed;
};

const User = mongoose.model("Users", userSchema);

// methods
export const getUserByEmail = (email, populate) => {
  const search = User.findOne({ email: email });

  if (populate) return search.populate(...populate);

  return search;
};

export const getUserById = async (id) => {
  const user = await User.findById(id).catch((err) => err);

  // result = result.toJSON();
  // delete result._id;
  // delete result.__v;
  // return result;

  return user;
};

export const createUser = (userData) => {
  const user = new User(userData);
  return user.save();
};

export const listUsers = (perPage, page) => {
  return new Promise((resolve, reject) => {
    User.find()
      .limit(perPage)
      .skip(perPage * page)
      .exec(function (err, users) {
        if (err) {
          reject(err);
        } else {
          resolve(users);
        }
      });
  });
};

export const updateUser = (id, userData) => {
  return User.findOneAndUpdate(
    {
      _id: id,
    },
    userData
  );
};

export const deleteById = (userId) => {
  return new Promise((resolve, reject) => {
    User.deleteMany({ _id: userId }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(err);
      }
    });
  });
};
// Remove this func before deploy
// Delete all users
// export const deleteById = () => {
//     return new Promise((resolve, reject) => {
//         User.deleteMany({}, (err) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(err);
//             }
//         });
//     });
// };

export default User;
