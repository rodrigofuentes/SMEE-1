// The store generator function, returns anonymous object through closure
function generateStore() {
  // generate our store object.
  const globalStore = {};

  // This get just grabs the data we hold in the piece of state currently being targeted and nothing else.
  const getter = state => ({
    get: () => state.data
  });

  // This sets initial state data or modifies our state data and updates state listeners.
  const setter = state => ({
    set: newData => {
      state.data = newData;
      state.listeners.forEach(x => x(newData));
    }
  });

  // This will subscribe a component to the target piece of state, and return a function that will unsubscribe when invoked (useEffect).
  const subscriber = state => ({
    subscribe: listener => {
      state.listeners.push(listener);
      return () =>
        (state.listeners = state.listeners.filter(x => x !== listener));
    }
  });

  // We return an anonymous object that can set a piece of state or get a piece of state.
  return {
    setState: (name, data) => {
      // Error handling
      if (typeof name !== "string")
        throw new Error("State name must be *type: 'String'*");

      globalStore[name] = (() => {
        // Define our default empty state
        const state = { data: null, listeners: [] };
        // Using functional composition here-- This way keeps references to functions, allows code to be modified later if needed, and removes the extra syntax text on each build.
        return Object.assign(
          state,
          getter(state),
          setter(state),
          subscriber(state)
        );
      })();
      // Run a set on the new state to write data to object
      globalStore[name].set(data);
    },
    getState: name => {
      // Error handling
      if (typeof name !== "string")
        throw new Error("State name must be *type: 'String'*");

      // Return the store reference
      return globalStore[name];
    }
  };
}
// Export the Store object wrapped in closure for Smee functionality
export const Store = generateStore();
