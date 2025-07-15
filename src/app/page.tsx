'use client';
import NavbarComponent from "@/components/NavbarComponent";
import FooterComponent from "@/components/FooterComponent";
import MainComponent from "@/page-sections/principal/Main";

export default function Home() {
  return (
    <>
      <NavbarComponent/>
      <MainComponent/>
      <FooterComponent/>
    </>
  );
}
