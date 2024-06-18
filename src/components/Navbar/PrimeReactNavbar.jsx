import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/auth.context';
import { Menubar } from 'primereact/menubar';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import './Navbar.css'; // Import your custom CSS file for Navbar styling

export default function Navbar() {
    const { isLoggedIn, logOutUser } = useContext(AuthContext);

    const itemRenderer = (item) => (
        <a className="p-menuitem-link">
            <span className={item.icon} />
            <span className="mx-2">{item.label}</span>
            {item.badge && <Badge className="ml-auto" value={item.badge} />}
            {item.shortcut && (
                <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">
                    {item.shortcut}
                </span>
            )}
        </a>
    );

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home'
        },
        {
            label: 'Our Meals',
            icon: 'pi pi-book'
        },
        {
            label: 'How It Works',
            icon: 'pi pi-question'
        },
        {
            label: 'Meal Plan',
            icon: 'pi pi-calculator'
        },
        isLoggedIn && {
            label: 'My Account',
            icon: 'pi pi-user',
            items: [
                {
                    label: 'Profile',
                    icon: 'pi pi-user-edit',
                    template: itemRenderer
                },
                {
                    label: 'Logout',
                    icon: 'pi pi-sign-out',
                    command: logOutUser,
                    template: itemRenderer
                }
            ]
        }
    ].filter(Boolean); // Filter out any false values

    const start = (
        <img
            alt="logo"
            src="https://primefaces.org/cdn/primereact/images/logo.png"
            height="40"
            className="mr-2"
        />
    );

    const end = (
        <div className="flex align-items-center gap-2 ml-auto">
            {isLoggedIn ? (
                <Avatar
                    image="/client/public/user-avatar.jpg" // Adjust the path to your avatar image
                    shape="circle"
                />
            ) : (
                <>
                    <Link to="/signup">
                        <button className="p-button p-component p-button-text p-button-plain">
                            Sign Up
                        </button>
                    </Link>
                    <Link to="/login">
                        <button className="p-button p-component p-button-text p-button-plain">
                            Login
                        </button>
                    </Link>
                </>
            )}
        </div>
    );

    return (
        <div className="navbar-container">
            <Menubar model={items} start={start} end={end} />
        </div>
    );
}
