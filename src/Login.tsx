import { useLoginStore } from "@src/store/store";
import { auth, loginProvider } from "@src/utils/firestoreSetup";
import { signInWithPopup, signOut } from "firebase/auth";

const Login = () => {
  const isLogin = useLoginStore.use.isLogin();

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
