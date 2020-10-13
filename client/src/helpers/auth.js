/*
Help file to manage cookies and local storage.
*/
import cookie from "js-cookie";

/*
Set cookie.
*/
export const setCookie = (key, value) => {
  if (window !== "undefiend") {
    cookie.set(key, value, {
      expires: 1,
    });
  }
};

/*
Remove cookie.
*/
export const removeCookie = (key) => {
  if (window !== "undefined") {
    cookie.remove(key, {
      expires: 1,
    });
  }
};

/*
Get cookie.
*/
export const getCookie = (key) => {
  if (window !== "undefined") {
    return cookie.get(key);
  }
};

/*
Set item in local storage.
*/
export const setLocalStorage = (key, value) => {
  if (window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

/*
Remove item from local storage.
*/
export const removeLocalStorage = (key) => {
  if (window !== "undefined") {
    localStorage.removeItem(key);
  }
};

/*
Add cookie and user data to local storage for authentication purposes.
*/
export const authenticate = (response, next) => {
  //console.log("AUTHENTICATE HELPER ON SIGNIN RESPONSE", response);
  setCookie("token", response.data.token);
  setLocalStorage("user", response.data.user);
  next();
};

/*
Check if user information exists in local storage.
*/
export const isAuth = () => {
  if (window !== "undefined") {
    const cookieChecked = getCookie("token");
    if (cookieChecked) {
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user"));
      } else {
        return false;
      }
    }
  }
};

/*
Remove cookie and user information from local storage.
*/
export const signout = (next) => {
  removeCookie("token");
  removeLocalStorage("user");
  next();
};

/*
Update user information in local storage.
*/
export const updateUser = (response, next) => {
  //console.log("UPDATE USER IN LOCALSTORAGE HELPERS", response);
  if (typeof window !== "undefined") {
    let auth = JSON.parse(localStorage.getItem("user"));
    auth = response.data;
    localStorage.setItem("user", JSON.stringify(auth));
  }
  next();
};
