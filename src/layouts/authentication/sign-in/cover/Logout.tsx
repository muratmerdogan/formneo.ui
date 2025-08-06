import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {

        // 1. Token'ı temizle
        localStorage.removeItem("menuNameSurmane"); // LocalStorage
        localStorage.removeItem("accessToken"); // SessionStorage

        // 2. Kullanıcıyı Login sayfasına yönlendir
        navigate("/authentication/sign-in/cover");


    }, [navigate]);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                flexDirection: "column",
            }}
        >
            <h2>Çıkış Yapılıyor...</h2>
            <p>Lütfen bekleyin...</p>
        </div>
    );
};

export default Logout;
