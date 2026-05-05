/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(
    //* If user is logged in already, the user's initial value will be the current email.
    //* If not, user will be null.
    localStorage.getItem("currentUserEmail")
      ? { email: localStorage.getItem("currentUserEmail") }
      : null,
  );

  const signUp = (email, password) => {
    //* This is the signup function, it accepts an email and a password. It contains an initial
    //* array of users, and a new user is created, it's added to the array and a new entry on
    //* the browsers local storage's 'users' field. The fist time a user is created, the default
    //* will be an empty array. It also checks if the email is already in use.
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find((user) => user.email === email)) {
      return { success: false, error: "Email is already in use." };
    }
    const newUser = { email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUserEmail", email);

    setUser({ email });

    return { success: true };
  };

  const login = (email, password) => {
    //! NOTE: Never store data locally without hashing like this.
    //! This is a simple React demo for learning purposes.
    //* Find specific user's account in local storage, if it exists.
    const users = JSON.parse(localStorage.getItem("users")) || [];
    //* Check if both email and password match any existing user.
    const user = users.find(
      (user) => user.email === email && user.password === password,
    );
    //* If it doesn't return login error:
    if (!user) {
      return { success: false, error: "Email or password is invalid." };
    }
    //* If it does, it will set the user into the local storage and the state:
    localStorage.setItem("currentUserEmail", email);
    setUser({ email });

    return { success: true };
  };

  const logout = () => {
    //* The logout will remove user from local storage and set it to null.
    localStorage.removeItem("currentUserEmail");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ signUp, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

//* This custom hook eliminates the need for importing the context
//* in every file we use it.
export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
