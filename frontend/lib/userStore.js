import { create } from "zustand";

// Create a Zustand store for managing user-related data
const useUserStore = create((set, get) => {
  
  // Initialize the store with data from localStorage (if available)
  const storedData = typeof window !== 'undefined' ? localStorage.getItem("user-store") : null;
  const initialData = storedData ? JSON.parse(storedData) : { user: null, token: null };

  return {
    // Initial state for user and token
    user: initialData.user,
    token: initialData.token,

    // Function to set the user and token, and save to localStorage
    setUser: (user, token) => {
      set({ user, token }); // Update the store state
      localStorage.setItem("user-store", JSON.stringify({ user, token })); // Persist to localStorage
    },

    // Function to clear the user and token, and remove from localStorage
    clearUser: () => {
      set({ user: null, token: null }); // Reset the store state
      localStorage.removeItem("user-store"); // Remove data from localStorage
    },

    // Function to retrieve the current user and token from the store
    getUser: () => ({
      user: get().user,
      token: get().token
    })
  };
});

export default useUserStore;

/*
Explanation:
Zustand is a lightweight state management library for React that simplifies state handling. 
The store here manages user-related data, such as `user` and `token`. 

We use Zustand's `create` function to define the store with state variables (`user` and `token`) 
and methods (`setUser`, `clearUser`, and `getUser`) to manage the state.

To persist the user's session across page reloads, data is synchronized with `localStorage`.
- On initialization, the store fetches any saved user data from `localStorage`.
- When `setUser` is called, the new user data is both saved in the store and persisted to `localStorage`.
- When `clearUser` is called, the store state is reset and the data is removed from `localStorage`.

This ensures a seamless user experience with persistence of authentication data across sessions.
*/
