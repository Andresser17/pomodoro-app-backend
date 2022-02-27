const handleAsyncError = (promise) => {
  return promise
    .then((data) => [data, undefined])
    .catch((error) => [undefined, error]);
};

export default handleAsyncError;
