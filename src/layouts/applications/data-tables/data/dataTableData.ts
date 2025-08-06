/**
=========================================================
* Material Dashboard 2 PRO React TS - v1.0.2
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

const dataTableData = {
  columns: [
    { Header: "Kullanıcı Adı", accessor: "userName", width: "20%" },
    { Header: "Ad", accessor: "firstName", width: "15%" },
    { Header: "Soyad", accessor: "lastName", width: "15%" },
    { Header: "E-posta", accessor: "email", width: "20%" },
    { Header: "Şehir", accessor: "city", width: "15%" },
    { Header: "Sistem Yöneticisi", accessor: "isSystemAdmin", width: "10%" },
    { Header: "Son Giriş Tarihi", accessor: "lastLoginDate", width: "20%" },
    { Header: "Son Giriş IP", accessor: "lastLoginIp", width: "15%" },
    { Header: "İşe Başlama Tarihi", accessor: "startWorkDate", width: "20%" },
  ],
  rows: [
    {}
  ],
};

export default dataTableData;
