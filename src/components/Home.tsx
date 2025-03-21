import { Link } from "react-router-dom";

export default function Home() {    
    const showNotification = () => {
        if ("Notification" in window) {
            if (Notification.permission === "granted") {
                new Notification("You are the best!");
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission().then(permission => {
                    if (permission === "granted") {
                        new Notification("You are the best!");
                    }
                });
            }
        } else {
            console.log("Notifications are not supported in this browser.");
        }
    };

    return (
        <div>
            <h1>Home</h1>
            <p>This is the home page.</p>
            <Link to="/about">About</Link>
            <br />
            <button onClick={showNotification}>Click me</button>
        </div>
    );
}
