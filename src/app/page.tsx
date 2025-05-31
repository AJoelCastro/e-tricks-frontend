"use client";
import NavbarComponent from "@/components/NavbarComponent";
import FooterComponent from "@/components/FooterComponent";
import AuthService from "@/services/AuthService";
import { useEffect } from "react";
import MainComponent from "@/components/Main";

export default function Home() {

  const getHealth = async() => {
    const dataHealth = await AuthService.HealthCheck();
    console.log(dataHealth);
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
