import { signInWithPopup, signOut } from "firebase/auth";
import { auth, loginProvider } from "./utils/firestoreSetup";
import { useLoginStore } from "./store/store";

const Login = () => {
  const isLogin = useLoginStore((state) => state.isLogin);
  return (
    <button
      onClick={() => {
        if (!isLogin) {
          signInWithPopup(auth, loginProvider)
            .then((result) => {
              console.log(`login result:`, result);
            })
            .catch((e) => {
              console.error(`login failed`, e);
            });
        } else {
          signOut(auth)
            .then(() => {
              console.log("sign out.");
            })
            .catch((e) => {
              console.error("sign out error", e);
            });
        }
      }}
    >
      {!auth.currentUser ? "Login" : "Logout"}
    </button>
  );
};

export default Login;
