"use client";
import NavbarComponent from "@/components/navbar/NavbarComponent";
import FooterComponent from "@/components/footer/FooterComponent";
import AuthService from "@/services/AuthService";
import { useEffect } from "react";
import MainComponent from "@/components/main/Main";

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
