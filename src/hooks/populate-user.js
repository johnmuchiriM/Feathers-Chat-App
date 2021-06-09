// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    //Get `app`, `method`, `params` and `result`from the hook context
    const { app, method, result, params } = context;
    //Function that adds the user to a single message object
    const addUser = async (message) => {
      // Get the user based on their id, pass the `params` along
      // that we can get a safe version of the user data

      const user = await app.service("users").get(message.userId, params);
      // Merge the message content to include the `user` object
      return {
        ...message,
        user,
      };
    };

    // In a find method we need to process the entire package

    if (method === "find") {
      // Map all the data to include the `user` information
      context.result.data = await Promise.all(result.data.map(addUser));
    } else {
      // Otherwise just update the single result
      context.result = await addUser(result);
    }
    return context;
  };
};
