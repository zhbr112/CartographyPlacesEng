import { Avatar, Navbar, Typography } from "@material-tailwind/react";
import TelegramLoginButton from 'react-telegram-login';
import { useAuth } from "../provider/authProvider";

export default function AppNavbar({ className: className = '' }) {
    const { token, setToken, setFirstName, setLastName, setUsername, setPhotoUrl, firstName, photoUrl } = useAuth();

    const login = (response) => {
        var firstName = response.first_name;
        var lastName = response.last_name;
        var username = response.username;
        var photoUrl = response.photo_url;

        var params = new URLSearchParams({
            id: response.id,
            first_name: firstName,
            last_name: lastName,
            username: username,
            photo_url: photoUrl,
            auth_date: response.auth_date,
            hash: response.hash
        });

        let keysForDel = [];
        params.forEach((value, key) => {
            if (!value || value == undefined || value == 'undefined' || value == null) {
                keysForDel.push(key);
            }
        });

        keysForDel.forEach(key => {
            params.delete(key);
        });

        fetch('https://zhbr.1ffy.ru/user/login?' + params).then(async response => {
            if (response.status === 200) {
                var res = await response.json();
                //console.log(res);
                setToken(res);
                setFirstName(firstName);
                setLastName(lastName);
                setUsername(username);
                setPhotoUrl(photoUrl);
            }
        }).catch(err => {
            console.error(err);
        });
    };

    return (
        <div className={'fixed right-2 top-2 rounded-2xl bg-white px-4 py-2 z-20 ' + className}>
            <div className="container mx-auto flex items-center justify-center text-blue-gray-900">
                {token ? (<div><Typography className='inline font-semibold'>{firstName}</Typography><Avatar className='inline ml-3 ring-2 p-0.5 ring-black' src={photoUrl}></Avatar></div>) : (<TelegramLoginButton dataOnauth={login} botName="baikalwildcampingbot" />)}
            </div>
        </div>
    )
}
