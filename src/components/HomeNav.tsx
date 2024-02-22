import Logo from "../assets/tietlogo.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "./ui/button.tsx";
import { ModeToggle } from "./mode-toggle.tsx";

const HomeNav: React.FC = () => {
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
      );
      // Create User
      axios
        .post(
          "https://thapar-event-management-system-production.up.railway.app/create",
          {
            email: userInfo.data.email,
            name: userInfo.data.name,
            token: tokenResponse.access_token,
          }
        )
        .then((resp) => {
          localStorage.setItem("token", resp.data.token);
          localStorage.setItem("name", resp.data.user.name);
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onError: (errorResponse) => console.log(errorResponse),
  });
  return (
    <div className="absolute z-10 flex items-center p-2 mt-2 justify-between w-full">
      <div className="flex space-x-5 items-center ml-16">
        <a href="/">
          <img src={Logo} alt="logo" className="w-10" />
        </a>
        <h1 className="text-white text-3xl">Invincible</h1>
      </div>
      <div>
        <ul className="flex space-x-9 text-white">
          <Link to="/">
            <li className="hover:text-blue-600">Home</li>
          </Link>
          <Link to="/events">
            <li className="hover:text-blue-600">Events</li>
          </Link>
          <Link to="/societies">
            <li className="hover:text-blue-600">Societies</li>
          </Link>
          <Link to="/contact-us">
            <li className="hover:text-blue-600">Contact Us</li>
          </Link>
        </ul>
      </div>
      <div className="flex space-x-5 mr-16 justify-center">
        {localStorage.getItem("token") ? (
          <Button>Hi {localStorage.getItem("name")}</Button>
        ) : (
          <Button onClick={() => googleLogin()}>Sign in</Button>
        )}
        <ModeToggle />
      </div>
    </div>
  );
};

export default HomeNav;