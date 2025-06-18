"use client";
import NavbarComponent from "@/page-sections/navbar/NavbarComponent";
import FooterComponent from "@/page-sections/footer/FooterComponent";
import AuthService from "@/services/AuthService";
import { useEffect } from "react";
import MainComponent from "@/page-sections/main/Main";

export default function Home() {

  const getHealth = async() => {
    const dataHealth = await AuthService.HealthCheck();
    console.log("health",dataHealth);
  }
  useEffect(() => {
    getHealth();
  }, [])
  return (
    <>
      <NavbarComponent/>
      <MainComponent/>
      <FooterComponent/>
    </>
  );
}
